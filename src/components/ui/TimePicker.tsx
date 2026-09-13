import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { LuClock } from "react-icons/lu";

interface TimePickerProps {
  /** "HH:mm" (24h) */
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  stepMinutes?: number;
  /** Shown when there is no value, e.g. "All day". */
  placeholder?: string;
  "aria-label"?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatTimeValue(value: string): string {
  const [h, m] = value.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "";
  const suffix = h < 12 ? "am" : "pm";
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)}${suffix}`;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, isInvalid, stepMinutes = 15, placeholder = "Time", ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const listRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const slots: string[] = [];
    for (let minutes = 0; minutes < 24 * 60; minutes += stepMinutes) {
      slots.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
    }
    // Keep off-grid values (e.g. 10:07 from older tasks) selectable.
    if (value && !slots.includes(value)) {
      slots.push(value);
      slots.sort();
    }
    return slots;
  }, [stepMinutes, value]);

  // Scroll the selected slot into the middle of the list when opening.
  useEffect(() => {
    if (!isOpen) return;
    const frame = setTimeout(() => {
      const list = listRef.current;
      const active =
        list?.querySelector<HTMLElement>("[data-selected='true']") ??
        list?.querySelector<HTMLElement>("[data-option='09:00']");
      if (list && active) {
        list.scrollTop = active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2;
      }
    }, 0);
    return () => clearTimeout(frame);
  }, [isOpen]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          w="full"
          justifyContent="flex-start"
          fontWeight={400}
          leftIcon={<LuClock />}
          color={value ? "gray.900" : "gray.400"}
          borderColor={isInvalid ? "red.500" : isOpen ? "gray.900" : "gray.200"}
          boxShadow={isInvalid ? "0 0 0 1px var(--chakra-colors-red-500)" : isOpen ? "0 0 0 1px var(--chakra-colors-gray-900)" : "none"}
          sx={{ ".chakra-button__icon": { color: "gray.500" } }}
          aria-label={rest["aria-label"]}
        >
          {value ? formatTimeValue(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="140px" borderColor="gray.200" boxShadow="lg" borderRadius="lg" _focusVisible={{ outline: "none" }}>
          <PopoverBody p={1}>
            <Box ref={listRef} maxH="240px" overflowY="auto" position="relative" role="listbox">
              {options.map((option) => {
                const isSelected = option === value;
                return (
                  <Box
                    key={option}
                    as="button"
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected}
                    data-option={option}
                    display="block"
                    w="full"
                    textAlign="left"
                    px={3}
                    py={1.5}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight={isSelected ? 600 : 400}
                    bg={isSelected ? "gray.900" : "transparent"}
                    color={isSelected ? "white" : "gray.900"}
                    _hover={isSelected ? undefined : { bg: "gray.100" }}
                    _focusVisible={{ outline: "2px solid", outlineColor: "gray.900", outlineOffset: "-2px" }}
                    onClick={() => {
                      onChange(option);
                      onClose();
                    }}
                  >
                    {formatTimeValue(option)}
                  </Box>
                );
              })}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default TimePicker;
