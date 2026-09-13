import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LuCalendarDays, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { addDays, isSameDay, parseLocal, startOfDay, toDateInput } from "../../lib/date";

interface DatePickerProps {
  /** "YYYY-MM-DD" */
  value: string;
  onChange: (value: string) => void;
  /** Days before this "YYYY-MM-DD" date are disabled. */
  minDate?: string;
  isInvalid?: boolean;
  "aria-label"?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, isInvalid, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selected = parseLocal(value);
  const min = parseLocal(minDate);
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Jump to the selected month whenever the popover opens.
  useEffect(() => {
    if (isOpen) {
      const base = parseLocal(value) ?? new Date();
      setMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    }
  }, [isOpen, value]);

  // Always render 6 weeks starting on the Sunday before the 1st.
  const cells = useMemo(() => {
    const gridStart = addDays(month, -month.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [month]);

  const select = (day: Date) => {
    onChange(toDateInput(day));
    onClose();
  };

  const shiftMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          w="full"
          justifyContent="flex-start"
          fontWeight={400}
          leftIcon={<LuCalendarDays />}
          color={selected ? "gray.900" : "gray.400"}
          borderColor={isInvalid ? "red.500" : isOpen ? "gray.900" : "gray.200"}
          boxShadow={isInvalid ? "0 0 0 1px var(--chakra-colors-red-500)" : isOpen ? "0 0 0 1px var(--chakra-colors-gray-900)" : "none"}
          sx={{ ".chakra-button__icon": { color: "gray.500" } }}
          aria-label={rest["aria-label"]}
        >
          {selected
            ? selected.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
            : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <Portal>
        {/* The portaled wrapper needs its own z-index to sit above modals. */}
        <PopoverContent rootProps={{ zIndex: "popover" }} w="280px" borderColor="gray.200" boxShadow="lg" borderRadius="lg" _focusVisible={{ outline: "none" }}>
          <PopoverBody p={3}>
            <Flex justify="space-between" align="center" mb={2} pl={1}>
              <Text fontWeight={600} fontSize="sm">
                {month.toLocaleDateString(undefined, { month: "long" })}{" "}
                <Text as="span" color="gray.500">
                  {month.getFullYear()}
                </Text>
              </Text>
              <HStack spacing={0.5}>
                <IconButton size="sm" variant="minimal" aria-label="Previous month" icon={<LuChevronLeft />} onClick={() => shiftMonth(-1)} />
                <IconButton size="sm" variant="minimal" aria-label="Next month" icon={<LuChevronRight />} onClick={() => shiftMonth(1)} />
              </HStack>
            </Flex>

            <Grid templateColumns="repeat(7, 1fr)" gap={0.5} textAlign="center">
              {WEEKDAYS.map((d) => (
                <Text key={d} fontSize="xs" fontWeight={500} color="gray.500" py={1.5}>
                  {d}
                </Text>
              ))}
              {cells.map((day) => {
                const inMonth = day.getMonth() === month.getMonth();
                const isSelected = selected ? isSameDay(day, selected) : false;
                const isToday = isSameDay(day, today);
                const isDisabled = min ? day < min : false;
                return (
                  <Box
                    key={day.toISOString()}
                    as="button"
                    type="button"
                    position="relative"
                    h="34px"
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight={isSelected || isToday ? 600 : 400}
                    bg={isSelected ? "gray.900" : "transparent"}
                    color={isSelected ? "white" : isDisabled ? "gray.300" : inMonth ? "gray.900" : "gray.400"}
                    cursor={isDisabled ? "not-allowed" : "pointer"}
                    _hover={isSelected || isDisabled ? undefined : { bg: "gray.100" }}
                    _focusVisible={{ outline: "2px solid", outlineColor: "gray.900", outlineOffset: "1px" }}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    aria-label={day.toDateString()}
                    onClick={() => select(day)}
                  >
                    {day.getDate()}
                    {isToday && (
                      <Box
                        position="absolute"
                        bottom="4px"
                        left="50%"
                        transform="translateX(-50%)"
                        boxSize="4px"
                        borderRadius="full"
                        bg={isSelected ? "white" : "gray.900"}
                      />
                    )}
                  </Box>
                );
              })}
            </Grid>

            <Flex justify="flex-end" borderTop="1px solid" borderColor="gray.100" mt={2} pt={2}>
              <Button
                size="sm"
                variant="minimal"
                isDisabled={min ? today < min : false}
                onClick={() => select(today)}
              >
                Today
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DatePicker;
