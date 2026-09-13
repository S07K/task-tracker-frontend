import React, { useMemo, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Text, useBreakpointValue, useToast } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventContentArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import { LuChevronLeft, LuChevronRight, LuPlus } from "react-icons/lu";
import PageHeader from "../components/dashboard/PageHeader";
import { useDashboard } from "../components/dashboard/context";
import { eventsApi } from "../lib/api";
import { normalizeHex, tint } from "../lib/color";
import { addDays, formatTime, startOfDay, toDateInput, toDateTimeInput } from "../lib/date";

type View = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

const VIEWS: { id: View; label: string }[] = [
  { id: "dayGridMonth", label: "Month" },
  { id: "timeGridWeek", label: "Week" },
  { id: "timeGridDay", label: "Day" },
];

function renderEventContent(arg: EventContentArg) {
  const color = arg.event.extendedProps.color as string;
  const isMonth = arg.view.type === "dayGridMonth";
  const start = arg.event.start;
  const end = arg.event.end;

  return (
    <Box
      h="full"
      w="full"
      overflow="hidden"
      borderLeft="3px solid"
      borderColor={color}
      borderRadius="6px"
      px={isMonth ? 1.5 : 2}
      py={isMonth ? 0.5 : 1}
      color="gray.900"
      fontSize="xs"
      lineHeight="1.35"
    >
      <Text fontWeight={600} noOfLines={isMonth ? 1 : 2}>
        {arg.event.title}
      </Text>
      {!arg.event.allDay && start && (
        <Text color="gray.600" noOfLines={1}>
          {formatTime(start)}
          {end && !isMonth ? ` – ${formatTime(end)}` : ""}
        </Text>
      )}
    </Box>
  );
}

const CalendarPage: React.FC = () => {
  const { events, refresh, openCreate, openEdit } = useDashboard();
  const toast = useToast();
  const calendarRef = useRef<FullCalendar>(null);
  const [title, setTitle] = useState("");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [view, setView] = useState<View>("dayGridMonth");

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end || undefined,
        allDay: Boolean(event.allDay),
        display: "block",
        backgroundColor: tint(event.backgroundColor, 0.12),
        borderColor: "transparent",
        textColor: "#111827",
        extendedProps: { color: normalizeHex(event.backgroundColor) },
      })),
    [events]
  );

  const api = () => calendarRef.current?.getApi();

  const changeView = (next: View) => {
    setView(next);
    api()?.changeView(next);
  };

  const handleSelect = (info: DateSelectArg) => {
    api()?.unselect();
    const today = startOfDay(new Date());
    if (info.start < today) {
      toast({ status: "info", title: "Tasks can't be scheduled in the past", duration: 2500 });
      return;
    }
    // A single-day click in month view becomes a 30-minute slot at 9am; anything else keeps its range.
    if (info.allDay && info.view.type === "dayGridMonth" && toDateInput(addDays(info.start, 1)) === toDateInput(info.end)) {
      const start = new Date(info.start);
      start.setHours(9, 0, 0, 0);
      openCreate({ start, end: new Date(start.getTime() + 30 * 60000), allDay: false });
      return;
    }
    openCreate({ start: info.start, end: info.end, allDay: info.allDay });
  };

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    const event = events.find((e) => e.id === info.event.id);
    if (event) openEdit(event);
  };

  const persistMove = async (info: EventDropArg | EventResizeDoneArg) => {
    const { event } = info;
    if (!event.start) return;
    const allDay = event.allDay;
    const end = event.end ?? (allDay ? addDays(event.start, 1) : new Date(event.start.getTime() + 60 * 60000));
    const start = allDay ? toDateInput(event.start) : toDateTimeInput(event.start);
    const endValue = allDay ? toDateInput(end) : toDateTimeInput(end);
    try {
      const res: any = await eventsApi.patch(`/updateEvent/${event.id}`, {
        allDay,
        start: allDay ? `${start}T00:00` : start,
        end: allDay ? `${endValue}T00:00` : endValue,
        startStr: start.split("T")[0],
        endStr: endValue.split("T")[0],
      });
      if (!res.data?.event) throw new Error(res.data?.error?.message);
      toast({ status: "success", title: "Task rescheduled", duration: 2000 });
      refresh();
    } catch (error: any) {
      info.revert();
      toast({ status: "error", title: "Couldn't reschedule task", description: error?.message });
    }
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Click or drag on the calendar to schedule. Drag tasks to reschedule."
        actions={
          <Button variant="primary" leftIcon={<LuPlus />} onClick={() => openCreate()}>
            New task
          </Button>
        }
      />

      <Flex
        justify="space-between"
        align={{ base: "stretch", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap={3}
        mb={4}
      >
        <HStack spacing={2}>
          <Button size="sm" onClick={() => api()?.today()}>
            Today
          </Button>
          <ButtonGroup size="sm" isAttached>
            <IconButton aria-label="Previous" icon={<LuChevronLeft />} onClick={() => api()?.prev()} />
            <IconButton aria-label="Next" icon={<LuChevronRight />} onClick={() => api()?.next()} ml="-1px" />
          </ButtonGroup>
          <Text fontWeight={600} fontSize="lg" ml={2} letterSpacing="-0.01em">
            {title}
          </Text>
        </HStack>
        <HStack spacing={1} bg="gray.100" p={1} borderRadius="lg" w="fit-content">
          {VIEWS.map((v) => (
            <Button
              key={v.id}
              size="sm"
              variant="unstyled"
              display="inline-flex"
              h={7}
              px={3}
              fontSize="sm"
              fontWeight={500}
              borderRadius="md"
              bg={view === v.id ? "white" : "transparent"}
              color={view === v.id ? "gray.900" : "gray.600"}
              boxShadow={view === v.id ? "sm" : "none"}
              onClick={() => changeView(v.id)}
            >
              {v.label}
            </Button>
          ))}
        </HStack>
      </Flex>

      <Box>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          height={view === "dayGridMonth" ? "auto" : "calc(100vh - 220px)"}
          events={calendarEvents}
          editable
          selectable
          selectMirror
          dayMaxEvents={isMobile ? 1 : 3}
          nowIndicator
          scrollTime="08:00:00"
          allDayText="All day"
          slotLabelFormat={{ hour: "numeric", meridiem: "short" }}
          dayHeaderFormat={view === "dayGridMonth" ? { weekday: "short" } : { weekday: "short", day: "numeric" }}
          datesSet={(arg) => setTitle(arg.view.title)}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={persistMove}
          eventResize={persistMove}
          eventContent={renderEventContent}
        />
      </Box>
    </>
  );
};

export default CalendarPage;
