import React, { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBell,
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuLayoutGrid,
  LuMousePointerClick,
  LuPalette,
  LuSmartphone,
  LuUser,
  LuZap,
} from "react-icons/lu";
import Logo from "./components/Logo";
import { addDays, isSameDay, startOfDay } from "./lib/date";

const MotionBox = motion(Box);

// Animate on mount (not on scroll) so content is never stuck invisible if an observer doesn't fire.
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const FEATURES: { icon: IconType; title: string; body: string }[] = [
  { icon: LuMousePointerClick, title: "Click to schedule", body: "Select a day or drag across hours on the calendar to block out time instantly." },
  { icon: LuLayoutGrid, title: "Month, week & day", body: "Zoom from the big picture down to the hour with views that feel familiar." },
  { icon: LuZap, title: "Drag to reschedule", body: "Plans change. Move or resize a task and it's saved automatically." },
  { icon: LuPalette, title: "Color-coded", body: "Give each task a color so work, personal and focus time are easy to tell apart." },
  { icon: LuClock, title: "Upcoming at a glance", body: "A clean agenda of what's next, grouped by day, with search built in." },
  { icon: LuSmartphone, title: "Works everywhere", body: "A responsive layout that feels just as good on your phone as on desktop." },
];

const STEPS = [
  { title: "Create your account", body: "Sign up with your email and verify it in a few seconds." },
  { title: "Add your tasks", body: "Pick a time on the calendar, name it, and choose a color." },
  { title: "Stay on track", body: "Check your upcoming list and adjust your week as it unfolds." },
];

/** A decorative, interactive preview in the style of a scheduling "booker". */
const BookerPreview: React.FC = () => {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(addDays(today, 1));
  const [slot, setSlot] = useState("10:00am");

  const days = useMemo(() => {
    const first = new Date(month);
    const offset = first.getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  const slots = ["9:00am", "9:30am", "10:00am", "11:30am", "1:00pm", "2:30pm", "4:00pm"];

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="0 24px 48px -12px rgba(17,24,39,0.12)"
      overflow="hidden"
    >
      <Grid templateColumns={{ base: "1fr", md: "220px 1fr 180px" }}>
        <Box p={6} borderRight={{ md: "1px solid" }} borderBottom={{ base: "1px solid", md: "none" }} borderColor="gray.200">
          <Avatar size="sm" bg="gray.900" color="white" icon={<LuUser />} />
          <Text fontSize="sm" color="gray.500" mt={3}>
            You
          </Text>
          <Text fontSize="lg" fontWeight={600} letterSpacing="-0.01em">
            Deep work block
          </Text>
          <Stack spacing={2} mt={4} fontSize="sm" color="gray.600">
            <HStack>
              <Icon as={LuClock} />
              <Text>90 min</Text>
            </HStack>
            <HStack>
              <Icon as={LuCalendarDays} />
              <Text>
                {selected.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              </Text>
            </HStack>
            <HStack>
              <Icon as={LuBell} />
              <Text>{slot}</Text>
            </HStack>
          </Stack>
        </Box>

        <Box p={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight={600} fontSize="sm">
              {month.toLocaleDateString(undefined, { month: "long" })}{" "}
              <Text as="span" color="gray.500">
                {month.getFullYear()}
              </Text>
            </Text>
            <HStack spacing={1}>
              <Button size="sm" variant="minimal" px={2} aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                <LuChevronLeft />
              </Button>
              <Button size="sm" variant="minimal" px={2} aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                <LuChevronRight />
              </Button>
            </HStack>
          </Flex>
          <Grid templateColumns="repeat(7, 1fr)" gap={1} textAlign="center">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <Text key={d} fontSize="10px" fontWeight={600} color="gray.500" py={1}>
                {d}
              </Text>
            ))}
            {days.map((day, i) => {
              if (!day) return <Box key={`empty-${i}`} />;
              const isPast = day < today;
              const isSelected = isSameDay(day, selected);
              return (
                <Box
                  key={day.toISOString()}
                  as="button"
                  aspectRatio={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={500}
                  disabled={isPast}
                  bg={isSelected ? "gray.900" : isPast ? "transparent" : "gray.100"}
                  color={isSelected ? "white" : isPast ? "gray.300" : "gray.900"}
                  cursor={isPast ? "default" : "pointer"}
                  _hover={isPast || isSelected ? undefined : { bg: "gray.200" }}
                  position="relative"
                  onClick={() => setSelected(day)}
                >
                  {day.getDate()}
                  {isSameDay(day, today) && (
                    <Box position="absolute" bottom="4px" left="50%" transform="translateX(-50%)" boxSize="4px" borderRadius="full" bg={isSelected ? "white" : "gray.900"} />
                  )}
                </Box>
              );
            })}
          </Grid>
        </Box>

        <Box p={6} borderLeft={{ md: "1px solid" }} borderTop={{ base: "1px solid", md: "none" }} borderColor="gray.200">
          <Text fontWeight={600} fontSize="sm" mb={4}>
            {selected.toLocaleDateString(undefined, { weekday: "short" })}{" "}
            <Text as="span" color="gray.500">
              {selected.getDate()}
            </Text>
          </Text>
          <Stack spacing={2}>
            {slots.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={slot === s ? "primary" : "secondary"}
                w="full"
                onClick={() => setSlot(s)}
              >
                {s}
              </Button>
            ))}
          </Stack>
        </Box>
      </Grid>
    </Box>
  );
};

const LandingPage: React.FC = () => {
  return (
    <Box bg="white">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg="rgba(255,255,255,0.85)"
        backdropFilter="saturate(180%) blur(8px)"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Container maxW="6xl">
          <Flex h="64px" align="center" justify="space-between">
            <HStack spacing={10}>
              <Logo />
              <HStack spacing={6} display={{ base: "none", md: "flex" }} fontSize="sm" color="gray.600" fontWeight={500}>
                <ChakraLink href="#features" _hover={{ color: "gray.900" }}>
                  Features
                </ChakraLink>
                <ChakraLink href="#how-it-works" _hover={{ color: "gray.900" }}>
                  How it works
                </ChakraLink>
              </HStack>
            </HStack>
            <HStack spacing={2}>
              <Button as={Link} to="/login" variant="minimal">
                Sign in
              </Button>
              <Button as={Link} to="/register" variant="primary" rightIcon={<LuArrowRight />}>
                Get started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box
        as="section"
        bgGradient="radial(circle at 50% 0%, gray.100, white 60%)"
        pt={{ base: 16, md: 24 }}
        pb={{ base: 16, md: 24 }}
      >
        <Container maxW="6xl">
          <MotionBox {...fadeUp} textAlign="center" maxW="3xl" mx="auto">
            <Badge
              bg="white"
              color="gray.700"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="full"
              px={3}
              py={1}
              textTransform="none"
              fontWeight={500}
              fontSize="xs"
            >
              Free & open to everyone
            </Badge>
            <Heading
              as="h1"
              mt={6}
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
              fontWeight={800}
              letterSpacing="-0.04em"
              lineHeight={1.05}
            >
              Scheduling your day,
              <br />
              made simple.
            </Heading>
            <Text mt={6} fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="xl" mx="auto">
              Task Tracker is the calm, focused way to plan your time. Put tasks on your calendar, see
              what's next, and reschedule with a drag.
            </Text>
            <Flex mt={8} gap={3} justify="center" direction={{ base: "column", sm: "row" }}>
              <Button as={Link} to="/register" variant="primary" size="lg" rightIcon={<LuArrowRight />}>
                Get started for free
              </Button>
              <Button as={Link} to="/login" size="lg">
                Sign in
              </Button>
            </Flex>
          </MotionBox>

          <MotionBox {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} mt={{ base: 12, md: 16 }} maxW="4xl" mx="auto">
            <BookerPreview />
          </MotionBox>
        </Container>
      </Box>

      <Box as="section" id="features" py={{ base: 16, md: 24 }} borderTop="1px solid" borderColor="gray.100">
        <Container maxW="6xl">
          <MotionBox {...fadeUp} textAlign="center" maxW="2xl" mx="auto" mb={12}>
            <Text fontSize="sm" fontWeight={600} color="gray.500">
              Features
            </Text>
            <Heading as="h2" mt={2} fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.03em">
              Everything you need, nothing you don't
            </Heading>
          </MotionBox>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
            {FEATURES.map((f, i) => (
              <MotionBox
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                p={6}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
              >
                <Flex boxSize={10} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" align="center" justify="center">
                  <Icon as={f.icon} boxSize={5} />
                </Flex>
                <Text mt={4} fontWeight={600}>
                  {f.title}
                </Text>
                <Text mt={1.5} fontSize="sm" color="gray.600">
                  {f.body}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" id="how-it-works" py={{ base: 16, md: 24 }} bg="gray.50" borderY="1px solid" borderColor="gray.200">
        <Container maxW="6xl">
          <MotionBox {...fadeUp} textAlign="center" maxW="2xl" mx="auto" mb={12}>
            <Text fontSize="sm" fontWeight={600} color="gray.500">
              How it works
            </Text>
            <Heading as="h2" mt={2} fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.03em">
              Up and running in minutes
            </Heading>
          </MotionBox>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {STEPS.map((s, i) => (
              <MotionBox key={s.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.08 }} bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Flex boxSize={8} borderRadius="full" bg="gray.900" color="white" align="center" justify="center" fontSize="sm" fontWeight={600}>
                  {i + 1}
                </Flex>
                <Text mt={4} fontWeight={600}>
                  {s.title}
                </Text>
                <Text mt={1.5} fontSize="sm" color="gray.600">
                  {s.body}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" py={{ base: 16, md: 24 }}>
        <Container maxW="6xl">
          <MotionBox
            {...fadeUp}
            bg="gray.900"
            color="white"
            borderRadius="2xl"
            px={{ base: 6, md: 16 }}
            py={{ base: 12, md: 16 }}
            textAlign="center"
          >
            <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.03em">
              Take control of your time
            </Heading>
            <Text mt={4} color="gray.400" maxW="lg" mx="auto">
              Join Task Tracker and start planning days that actually go to plan.
            </Text>
            <Button
              as={Link}
              to="/register"
              mt={8}
              size="lg"
              bg="white"
              color="gray.900"
              border="none"
              _hover={{ bg: "gray.100" }}
              rightIcon={<LuArrowRight />}
            >
              Create your free account
            </Button>
          </MotionBox>
        </Container>
      </Box>

      <Box as="footer" borderTop="1px solid" borderColor="gray.200" py={8}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={4}>
            <Logo size="sm" />
            <Text fontSize="sm" color="gray.500">
              Built by{" "}
              <ChakraLink href="https://s07k.github.io/portfolio/" isExternal color="gray.900" fontWeight={500}>
                Shubham
              </ChakraLink>{" "}
              with 🤍
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
