import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { useSelector } from "react-redux";
import { LuCheck, LuPalette, LuTrash2 } from "react-icons/lu";
import { eventsApi } from "../../lib/api";
import { DEFAULT_TASK_COLOR, TASK_COLORS, normalizeHex } from "../../lib/color";
import {
  TaskEvent,
  addDays,
  parseLocal,
  toDateInput,
  toDateTimeInput,
} from "../../lib/date";
import { TaskDraft } from "./context";
import DatePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";

export type TaskDialogState =
  | { mode: "create"; draft?: TaskDraft }
  | { mode: "edit"; event: TaskEvent };

interface TaskDialogProps {
  state: TaskDialogState | null;
  onClose: () => void;
  onSaved: () => void;
}

function defaultDraft(): TaskDraft {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  return { start, end: new Date(start.getTime() + 30 * 60000), allDay: false };
}

const TaskDialog: React.FC<TaskDialogProps> = ({ state, onClose, onSaved }) => {
  const toast = useToast();
  const { userId } = useSelector((s: any) => s.event);
  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState(DEFAULT_TASK_COLOR);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = state?.mode === "edit";

  useEffect(() => {
    if (!state) return;
    setSubmitted(false);
    setConfirmDelete(false);

    if (state.mode === "edit") {
      const { event } = state;
      const start = parseLocal(event.start) ?? new Date();
      const end = parseLocal(event.end) ?? start;
      setTitle(event.title ?? "");
      setAllDay(Boolean(event.allDay));
      setColor(normalizeHex(event.backgroundColor));
      setStartDateTime(toDateTimeInput(start));
      setEndDateTime(toDateTimeInput(end));
      setStartDate(toDateInput(start));
      // All-day ends are stored exclusive; show the inclusive last day.
      const lastDay = event.allDay && end > start ? addDays(end, -1) : end;
      setEndDate(toDateInput(lastDay < start ? start : lastDay));
    } else {
      const draft = state.draft ?? defaultDraft();
      setTitle("");
      setAllDay(draft.allDay);
      setColor(DEFAULT_TASK_COLOR);
      setStartDateTime(toDateTimeInput(draft.start));
      setEndDateTime(toDateTimeInput(draft.end));
      setStartDate(toDateInput(draft.start));
      const lastDay = draft.allDay ? addDays(draft.end, -1) : draft.end;
      setEndDate(toDateInput(lastDay < draft.start ? draft.start : lastDay));
    }
  }, [state]);

  const titleError = !title.trim() ? "Title is required" : "";
  let rangeError = "";
  if (allDay) {
    if (!startDate || !endDate) rangeError = "Pick a start and end date";
    else if (endDate < startDate) rangeError = "End date must be on or after the start date";
  } else {
    if (!startDateTime || !endDateTime) rangeError = "Pick a start and end time";
    else if (endDateTime <= startDateTime) rangeError = "End time must be after the start time";
  }

  const buildPayload = () => {
    if (allDay) {
      const exclusiveEnd = toDateInput(addDays(parseLocal(endDate)!, 1));
      return {
        title: title.trim(),
        allDay: true,
        start: `${startDate}T00:00`,
        end: `${exclusiveEnd}T00:00`,
        startStr: startDate,
        endStr: exclusiveEnd,
        backgroundColor: color,
        url: "",
      };
    }
    return {
      title: title.trim(),
      allDay: false,
      start: startDateTime,
      end: endDateTime,
      startStr: startDateTime.split("T")[0],
      endStr: endDateTime.split("T")[0],
      backgroundColor: color,
      url: "",
    };
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (titleError || rangeError || !state) return;
    setIsSaving(true);
    try {
      const payload = buildPayload();
      const res: any =
        state.mode === "edit"
          ? await eventsApi.patch(`/updateEvent/${state.event.id}`, payload)
          : await eventsApi.post("/addEvent", { ...payload, id: userId });
      if (res.data?.event) {
        toast({ status: "success", title: isEdit ? "Task updated" : "Task created", duration: 2500 });
        onSaved();
        onClose();
      } else {
        throw new Error(res.data?.error?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({ status: "error", title: "Couldn't save task", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (state?.mode !== "edit") return;
    setIsDeleting(true);
    try {
      const res: any = await eventsApi.delete(`/deleteEvent/${state.event.id}`);
      if (res.data?.events) {
        toast({ status: "success", title: "Task deleted", duration: 2500 });
        onSaved();
        onClose();
      } else {
        throw new Error(res.data?.error?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({ status: "error", title: "Couldn't delete task", description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  const isCustomColor = !TASK_COLORS.includes(color);

  const [startDay = "", startTime = ""] = startDateTime.split("T");
  const [endDay = "", endTime = ""] = endDateTime.split("T");

  // Moving the start keeps the task's duration, like most calendar apps.
  const updateStart = (day: string, time: string) => {
    const next = `${day}T${time}`;
    const prevStart = parseLocal(startDateTime);
    const prevEnd = parseLocal(endDateTime);
    const nextStart = parseLocal(next);
    const duration = prevStart && prevEnd && prevEnd > prevStart ? prevEnd.getTime() - prevStart.getTime() : 30 * 60000;
    setStartDateTime(next);
    if (nextStart) setEndDateTime(toDateTimeInput(new Date(nextStart.getTime() + duration)));
  };

  /**
   * Leaves all-day mode for a timed task. Reuses the previous times unless they were
   * the midnight-to-midnight placeholders of an all-day range, in which case 9:00–9:30.
   */
  const exitAllDay = ({
    day = startDate,
    endDay: nextEndDay,
    time,
    endTime: nextEndTime,
  }: {
    day?: string;
    endDay?: string;
    time?: string;
    endTime?: string;
  }) => {
    const prevStart = parseLocal(startDateTime);
    const prevEnd = parseLocal(endDateTime);
    const prevDuration = prevStart && prevEnd ? prevEnd.getTime() - prevStart.getTime() : 0;
    const duration = prevDuration > 0 && prevDuration < 24 * 3600000 ? prevDuration : 30 * 60000;
    const startClock = time ?? (startTime && startTime !== "00:00" ? startTime : "09:00");
    const start = parseLocal(`${day}T${startClock}`);
    if (!start) return;
    let end = new Date(start.getTime() + duration);
    if (nextEndDay) {
      const endOnDay = parseLocal(`${nextEndDay}T${toDateTimeInput(end).split("T")[1]}`);
      if (endOnDay && endOnDay > start) end = endOnDay;
    }
    if (nextEndTime) {
      // End at the chosen time, rolling to the next day if it would be before the start.
      const candidate = parseLocal(`${day}T${nextEndTime}`);
      if (candidate) end = candidate > start ? candidate : addDays(candidate, 1);
    }
    setStartDateTime(toDateTimeInput(start));
    setEndDateTime(toDateTimeInput(end));
    setAllDay(false);
  };

  const toggleAllDay = () => {
    if (allDay) {
      exitAllDay({ day: startDate });
      return;
    }
    setStartDate(startDay);
    setEndDate(endDay && endDay >= startDay ? endDay : startDay);
    setAllDay(true);
  };

  const rangeInvalid = submitted && Boolean(rangeError);

  return (
    <Modal isOpen={Boolean(state)} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent mx={4}>
        <ModalHeader pb={1} pt={6} px={6}>
          <Text fontSize="lg" fontWeight={600}>
            {isEdit ? "Edit task" : "New task"}
          </Text>
          <Text fontSize="sm" fontWeight={400} color="gray.500">
            {isEdit ? "Update the details of this task." : "Block out time for something that matters."}
          </Text>
        </ModalHeader>
        <ModalCloseButton top={5} right={5} />
        <ModalBody px={6} py={5}>
          <FormControl isInvalid={submitted && Boolean(titleError)} mb={5}>
            <FormLabel>Title</FormLabel>
            <Input
              autoFocus
              placeholder="e.g. Weekly planning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={onEnter}
            />
            <FormErrorMessage fontSize="xs">{titleError}</FormErrorMessage>
          </FormControl>

          <Flex
            align="center"
            justify="space-between"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            px={3}
            py={2.5}
            mb={5}
          >
            <Box>
              <Text fontSize="sm" fontWeight={500}>
                All-day
              </Text>
              <Text fontSize="xs" color="gray.500">
                Spans entire days instead of a time slot
              </Text>
            </Box>
            <Switch
              colorScheme="gray"
              isChecked={allDay}
              onChange={toggleAllDay}
              sx={{ "span.chakra-switch__track[data-checked]": { bg: "gray.900" } }}
            />
          </Flex>

          <FormControl isInvalid={submitted && Boolean(rangeError)} mb={5}>
            {/* Date + time are always shown; editing either while all-day is on switches to a timed task. */}
            <SimpleGrid columns={1} spacing={3}>
              <Box>
                <FormLabel>Starts</FormLabel>
                <Flex gap={2}>
                  <Box flex={1} minW={0}>
                    <DatePicker
                      aria-label="Start date"
                      value={allDay ? startDate : startDay}
                      onChange={(d) => (allDay ? exitAllDay({ day: d }) : updateStart(d, startTime))}
                    />
                  </Box>
                  <Box w="130px" flexShrink={0}>
                    <TimePicker
                      aria-label="Start time"
                      value={allDay ? "" : startTime}
                      placeholder="All day"
                      onChange={(t) => (allDay ? exitAllDay({ time: t }) : updateStart(startDay, t))}
                    />
                  </Box>
                </Flex>
              </Box>
              <Box>
                <FormLabel>Ends</FormLabel>
                <Flex gap={2}>
                  <Box flex={1} minW={0}>
                    <DatePicker
                      aria-label="End date"
                      value={allDay ? endDate : endDay}
                      minDate={allDay ? startDate : startDay}
                      onChange={(d) => (allDay ? exitAllDay({ endDay: d }) : setEndDateTime(`${d}T${endTime}`))}
                      isInvalid={rangeInvalid}
                    />
                  </Box>
                  <Box w="130px" flexShrink={0}>
                    <TimePicker
                      aria-label="End time"
                      value={allDay ? "" : endTime}
                      placeholder="All day"
                      onChange={(t) => (allDay ? exitAllDay({ endTime: t }) : setEndDateTime(`${endDay}T${t}`))}
                      isInvalid={rangeInvalid}
                    />
                  </Box>
                </Flex>
              </Box>
            </SimpleGrid>
            <FormErrorMessage fontSize="xs">{rangeError}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Color</FormLabel>
            <HStack spacing={2} flexWrap="wrap">
              {TASK_COLORS.map((c) => (
                <Box
                  key={c}
                  as="button"
                  type="button"
                  aria-label={`Use color ${c}`}
                  boxSize={7}
                  borderRadius="full"
                  bg={c}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  outline={color === c ? "2px solid" : "none"}
                  outlineColor="gray.900"
                  outlineOffset="2px"
                  onClick={() => setColor(c)}
                >
                  {color === c && <LuCheck size={14} />}
                </Box>
              ))}
              <Popover placement="top" isLazy>
                <PopoverTrigger>
                  <Box
                    as="button"
                    type="button"
                    aria-label="Custom color"
                    boxSize={7}
                    borderRadius="full"
                    border="1px dashed"
                    borderColor="gray.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={isCustomColor ? color : "white"}
                    color={isCustomColor ? "white" : "gray.500"}
                    outline={isCustomColor ? "2px solid" : "none"}
                    outlineColor="gray.900"
                    outlineOffset="2px"
                  >
                    <LuPalette size={14} />
                  </Box>
                </PopoverTrigger>
                <PopoverContent w="220px" borderColor="gray.200" boxShadow="lg">
                  <PopoverBody p={3}>
                    <HexColorPicker color={color} onChange={setColor} />
                    <Input
                      mt={3}
                      size="sm"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      fontFamily="mono"
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </FormControl>
        </ModalBody>

        <Divider borderColor="gray.200" />
        <ModalFooter px={6} py={4} bg="gray.50" borderBottomRadius="xl">
          {isEdit && !confirmDelete && (
            <Button variant="destructive" leftIcon={<LuTrash2 />} mr="auto" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
          {confirmDelete ? (
            <Flex w="full" align="center" justify="space-between" gap={3} wrap="wrap">
              <Text fontSize="sm" color="gray.700">
                Delete this task? This can't be undone.
              </Text>
              <HStack>
                <Button onClick={() => setConfirmDelete(false)}>Keep</Button>
                <Button variant="destructiveSolid" onClick={handleDelete} isLoading={isDeleting}>
                  Yes, delete
                </Button>
              </HStack>
            </Flex>
          ) : (
            <HStack>
              <Button variant="minimal" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                {isEdit ? "Save changes" : "Create task"}
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDialog;
