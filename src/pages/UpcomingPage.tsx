import React, { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuCalendarCheck, LuPencil, LuPlus, LuSearch } from "react-icons/lu";
import PageHeader from "../components/dashboard/PageHeader";
import { useDashboard } from "../components/dashboard/context";
import { normalizeHex } from "../lib/color";
import {
  TaskEvent,
  addDays,
  durationLabel,
  formatDayHeading,
  formatTime,
  parseLocal,
  startOfDay,
  toDateInput,
} from "../lib/date";

type Tab = "upcoming" | "past";

interface Row {
  event: TaskEvent;
  start: Date;
  end: Date;
}

function toRow(event: TaskEvent): Row | null {
  const start = parseLocal(event.start);
  if (!start) return null;
  const end = parseLocal(event.end) ?? (event.allDay ? addDays(start, 1) : start);
  return { event, start, end };
}

const TaskRow: React.FC<{ row: Row; onEdit: () => void }> = ({ row, onEdit }) => {
  const { event, start, end } = row;
  const color = normalizeHex(event.backgroundColor);
  const multiDay = event.allDay && addDays(start, 1) < end;

  return (
    <Flex
      role="group"
      align={{ base: "flex-start", sm: "center" }}
      direction={{ base: "column", sm: "row" }}
      gap={{ base: 2, sm: 6 }}
      px={{ base: 4, sm: 5 }}
      py={4}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      transition="background 120ms"
      onClick={onEdit}
    >
      <Box w={{ sm: "180px" }} flexShrink={0}>
        <Text fontSize="sm" fontWeight={500}>
          {start.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {event.allDay
            ? multiDay
              ? `Until ${addDays(end, -1).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`
              : "All day"
            : `${formatTime(start)} – ${formatTime(end)}`}
        </Text>
      </Box>

      <Box flex={1} minW={0}>
        <HStack spacing={2}>
          <Box boxSize={2.5} borderRadius="full" bg={color} flexShrink={0} />
          <Text fontSize="sm" fontWeight={600} noOfLines={1}>
            {event.title}
          </Text>
        </HStack>
        <HStack spacing={2} mt={1.5} pl="18px">
          {event.allDay ? (
            <Badge variant="subtle" bg="gray.100" color="gray.700" textTransform="none" fontWeight={500} borderRadius="md" px={2}>
              All day
            </Badge>
          ) : (
            <Badge variant="subtle" bg="gray.100" color="gray.700" textTransform="none" fontWeight={500} borderRadius="md" px={2}>
              {durationLabel(start, end)}
            </Badge>
          )}
        </HStack>
      </Box>

      <Button
        size="sm"
        leftIcon={<LuPencil />}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        display={{ base: "none", sm: "inline-flex" }}
      >
        Edit
      </Button>
    </Flex>
  );
};

const EmptyState: React.FC<{ tab: Tab; searching: boolean; onCreate: () => void }> = ({
  tab,
  searching,
  onCreate,
}) => (
  <Flex
    direction="column"
    align="center"
    textAlign="center"
    border="1px dashed"
    borderColor="gray.300"
    borderRadius="xl"
    py={16}
    px={6}
  >
    <Flex boxSize={14} borderRadius="full" bg="gray.100" align="center" justify="center" mb={4}>
      <Icon as={LuCalendarCheck} boxSize={6} color="gray.700" />
    </Flex>
    <Text fontWeight={600} fontSize="lg">
      {searching ? "No matching tasks" : tab === "upcoming" ? "No upcoming tasks" : "No past tasks"}
    </Text>
    <Text fontSize="sm" color="gray.500" maxW="sm" mt={1}>
      {searching
        ? "Try a different search term."
        : tab === "upcoming"
          ? "You're all caught up. Schedule a task and it will show up here."
          : "Tasks you've completed will appear here."}
    </Text>
    {tab === "upcoming" && !searching && (
      <Button variant="primary" leftIcon={<LuPlus />} mt={6} onClick={onCreate}>
        New task
      </Button>
    )}
  </Flex>
);

const UpcomingPage: React.FC = () => {
  const { events, isLoading, openCreate, openEdit } = useDashboard();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [query, setQuery] = useState("");

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const rows = events.map(toRow).filter((r): r is Row => r !== null);
    return {
      upcoming: rows.filter((r) => r.end >= now).sort((a, b) => a.start.getTime() - b.start.getTime()),
      past: rows.filter((r) => r.end < now).sort((a, b) => b.start.getTime() - a.start.getTime()),
    };
  }, [events]);

  const visible = (tab === "upcoming" ? upcoming : past).filter((r) =>
    r.event.title?.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Group rows by calendar day, preserving sort order.
  const groups: { key: string; label: string; rows: Row[] }[] = [];
  visible.forEach((row) => {
    const key = toDateInput(row.start);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: formatDayHeading(startOfDay(row.start)), rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  });

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "past", label: "Past", count: past.length },
  ];

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="See upcoming and past tasks you've scheduled."
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
        <HStack spacing={1} bg="gray.100" p={1} borderRadius="lg" w="fit-content">
          {tabs.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant="unstyled"
              display="inline-flex"
              h={7}
              px={3}
              fontSize="sm"
              fontWeight={500}
              borderRadius="md"
              bg={tab === t.id ? "white" : "transparent"}
              color={tab === t.id ? "gray.900" : "gray.600"}
              boxShadow={tab === t.id ? "sm" : "none"}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <Text as="span" ml={1.5} color="gray.400" fontSize="xs">
                {t.count}
              </Text>
            </Button>
          ))}
        </HStack>
        <InputGroup maxW={{ sm: "260px" }}>
          <InputLeftElement h={9} pointerEvents="none" color="gray.400">
            <LuSearch />
          </InputLeftElement>
          <Input placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>
      </Flex>

      {isLoading ? (
        <Stack border="1px solid" borderColor="gray.200" borderRadius="xl" p={5} spacing={5}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} h="44px" borderRadius="md" startColor="gray.100" endColor="gray.200" />
          ))}
        </Stack>
      ) : groups.length === 0 ? (
        <EmptyState tab={tab} searching={Boolean(query.trim())} onCreate={() => openCreate()} />
      ) : (
        <Box border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="hidden">
          {groups.map((group, i) => (
            <Box key={group.key} borderTop={i === 0 ? "none" : "1px solid"} borderColor="gray.200">
              <Text
                px={{ base: 4, sm: 5 }}
                py={2}
                bg="gray.50"
                borderBottom="1px solid"
                borderColor="gray.200"
                fontSize="xs"
                fontWeight={600}
                letterSpacing="0.04em"
                textTransform="uppercase"
                color="gray.500"
              >
                {group.label}
              </Text>
              <Stack spacing={0} divider={<Box borderTop="1px solid" borderColor="gray.100" />}>
                {group.rows.map((row) => (
                  <TaskRow key={row.event.id} row={row} onEdit={() => openEdit(row.event)} />
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default UpcomingPage;
