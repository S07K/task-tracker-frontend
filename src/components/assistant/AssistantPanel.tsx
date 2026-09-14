import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { LuCheck, LuPencil, LuRotateCcw, LuSend, LuSparkles, LuTrash2 } from "react-icons/lu";
import { normalizeHex } from "../../lib/color";
import { formatTime, parseLocal } from "../../lib/date";
import { AssistantState, AssistantTask, ChatMessage } from "./useAssistant";

const MAX_INPUT_CHARS = 2000;

const SUGGESTIONS = [
  "What's on my schedule tomorrow?",
  "Add a 1-hour focus block tomorrow at 10am",
  "Move my next task to Friday",
  "Delete everything from last week",
];

function describeWhen(task: AssistantTask): string {
  const start = parseLocal(task.start);
  if (!start) return task.start;
  const day = start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const end = parseLocal(task.end);
  if (task.allDay) {
    return end && end > start
      ? `${day} – ${end.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}`
      : `${day} · All day`;
  }
  return end && end > start ? `${day} · ${formatTime(start)} – ${formatTime(end)}` : `${day} · ${formatTime(start)}`;
}

const TaskRow: React.FC<{ task: AssistantTask }> = ({ task }) => (
  <HStack spacing={2.5} align="flex-start" minW={0}>
    <Box boxSize={2.5} mt={1.5} borderRadius="full" bg={normalizeHex(task.color)} flexShrink={0} />
    <Box minW={0}>
      <Text fontSize="sm" fontWeight={500} noOfLines={1}>
        {task.title}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {describeWhen(task)}
      </Text>
    </Box>
  </HStack>
);

const AssistantAvatar: React.FC = () => (
  <Flex boxSize={7} borderRadius="full" bg="gray.900" color="white" align="center" justify="center" flexShrink={0}>
    <Icon as={LuSparkles} boxSize={3.5} />
  </Flex>
);

const MessageItem: React.FC<{
  message: ChatMessage;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}> = ({ message, onConfirm, onCancel }) => {
  if (message.role === "user") {
    return (
      <Flex justify="flex-end">
        <Box
          maxW="85%"
          bg="gray.900"
          color="white"
          px={3.5}
          py={2.5}
          borderRadius="2xl"
          borderBottomRightRadius="md"
          fontSize="sm"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          {message.content}
        </Box>
      </Flex>
    );
  }

  const pending = message.pendingDelete;
  return (
    <Flex gap={2.5} align="flex-start">
      <AssistantAvatar />
      <Box maxW="85%" minW={0} flex={1}>
        <Box
          display="inline-block"
          maxW="100%"
          px={3.5}
          py={2.5}
          borderRadius="2xl"
          borderTopLeftRadius="md"
          fontSize="sm"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          bg={message.isError ? "red.50" : "gray.100"}
          color={message.isError ? "red.700" : "gray.900"}
        >
          {message.content}
        </Box>

        {message.actions && (
          <Stack mt={2} spacing={2.5} border="1px solid" borderColor="gray.200" borderRadius="lg" p={3} bg="white">
            {message.actions.map((action, i) => (
              <HStack key={`${action.task.id}-${i}`} spacing={2.5} align="flex-start">
                <Icon
                  as={action.type === "created" ? LuCheck : LuPencil}
                  boxSize={3.5}
                  mt={1}
                  color="green.600"
                  flexShrink={0}
                  aria-label={action.type === "created" ? "Created" : "Updated"}
                />
                <TaskRow task={action.task} />
              </HStack>
            ))}
          </Stack>
        )}

        {pending && (
          <Box mt={2} border="1px solid" borderColor="gray.200" borderRadius="lg" overflow="hidden" bg="white">
            <HStack px={3} py={2} bg="gray.50" borderBottom="1px solid" borderColor="gray.200" spacing={2}>
              <Icon as={LuTrash2} boxSize={3.5} color="red.600" />
              <Text fontSize="xs" fontWeight={600} color="gray.700">
                Delete {pending.tasks.length === 1 ? "1 task" : `${pending.tasks.length} tasks`}?
              </Text>
            </HStack>
            <Stack spacing={2.5} p={3} maxH="220px" overflowY="auto">
              {pending.tasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </Stack>
            <Flex px={3} py={2.5} borderTop="1px solid" borderColor="gray.200" justify="flex-end" gap={2} align="center">
              {pending.status === "confirmed" && (
                <Text fontSize="xs" fontWeight={500} color="green.700">
                  Deleted
                </Text>
              )}
              {pending.status === "cancelled" && (
                <Text fontSize="xs" fontWeight={500} color="gray.500">
                  Cancelled
                </Text>
              )}
              {(pending.status === "pending" || pending.status === "confirming") && (
                <>
                  <Button size="sm" onClick={() => onCancel(message.id)} isDisabled={pending.status === "confirming"}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructiveSolid"
                    leftIcon={<LuTrash2 />}
                    onClick={() => onConfirm(message.id)}
                    isLoading={pending.status === "confirming"}
                  >
                    Confirm delete
                  </Button>
                </>
              )}
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  assistant: AssistantState;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ isOpen, onClose, assistant }) => {
  const { messages, isSending, send, confirmDelete, cancelDelete, clear } = assistant;
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, isSending, isOpen]);

  const submit = () => {
    if (!input.trim() || isSending) return;
    send(input);
    setInput("");
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md" initialFocusRef={inputRef}>
      <DrawerOverlay bg="blackAlpha.300" />
      <DrawerContent>
        <DrawerHeader borderBottom="1px solid" borderColor="gray.200" py={4} pr={24}>
          <HStack spacing={3}>
            <AssistantAvatar />
            <Box>
              <Text fontSize="md" fontWeight={600} lineHeight="short">
                Ask AI
              </Text>
              <Text fontSize="xs" fontWeight={400} color="gray.500">
                Create, find, change and delete tasks by chatting
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>
        <Tooltip label="Clear conversation" placement="bottom">
          <IconButton
            aria-label="Clear conversation"
            icon={<LuRotateCcw />}
            variant="minimal"
            size="sm"
            position="absolute"
            top={4}
            right={12}
            onClick={clear}
            isDisabled={messages.length === 0 || isSending}
          />
        </Tooltip>
        <DrawerCloseButton top={4} />

        <DrawerBody px={4} py={5} bg="white">
          {messages.length === 0 ? (
            <Flex direction="column" align="center" textAlign="center" pt={10} px={2}>
              <Flex boxSize={12} borderRadius="full" bg="gray.100" align="center" justify="center" mb={4}>
                <Icon as={LuSparkles} boxSize={5} color="gray.700" />
              </Flex>
              <Text fontWeight={600}>How can I help with your tasks?</Text>
              <Text fontSize="sm" color="gray.500" mt={1} maxW="sm">
                Ask about your schedule or tell me what to add, move or remove. Deletes always ask you first.
              </Text>
              <Stack mt={6} spacing={2} w="full">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    size="sm"
                    justifyContent="flex-start"
                    fontWeight={400}
                    whiteSpace="normal"
                    h="auto"
                    py={2}
                    textAlign="left"
                    onClick={() => send(suggestion)}
                    isDisabled={isSending}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Stack>
            </Flex>
          ) : (
            <Stack spacing={4}>
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} onConfirm={confirmDelete} onCancel={cancelDelete} />
              ))}
              {isSending && (
                <Flex gap={2.5} align="center">
                  <AssistantAvatar />
                  <HStack px={3.5} py={2.5} bg="gray.100" borderRadius="2xl" borderTopLeftRadius="md" spacing={2}>
                    <Spinner size="xs" color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      Thinking…
                    </Text>
                  </HStack>
                </Flex>
              )}
            </Stack>
          )}
          <div ref={bottomRef} />
        </DrawerBody>

        <DrawerFooter borderTop="1px solid" borderColor="gray.200" px={4} py={3} flexDirection="column" alignItems="stretch">
          <Flex
            gap={2}
            align="flex-end"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={1.5}
            pl={3}
            _focusWithin={{ borderColor: "gray.900", boxShadow: "0 0 0 1px var(--chakra-colors-gray-900)" }}
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask about or change your tasks…"
              aria-label="Message the assistant"
              rows={1}
              resize="none"
              maxH="140px"
              minH="36px"
              py={2}
              px={0}
              border="none"
              fontSize="sm"
              _focusVisible={{ boxShadow: "none" }}
              sx={{ fieldSizing: "content" }}
            />
            <IconButton
              aria-label="Send message"
              icon={<LuSend />}
              variant="primary"
              size="sm"
              borderRadius="lg"
              onClick={submit}
              isDisabled={!input.trim() || isSending}
            />
          </Flex>
          <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
            AI can make mistakes. Check important changes.
          </Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AssistantPanel;
