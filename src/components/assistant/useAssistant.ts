import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { chatApi } from "../../lib/api";
import { toDateTimeInput } from "../../lib/date";

export interface AssistantTask {
  id: string;
  title: string;
  allDay: boolean;
  /** Timed: YYYY-MM-DDTHH:mm. All-day: YYYY-MM-DD */
  start: string;
  /** Timed: YYYY-MM-DDTHH:mm. All-day: last day, inclusive */
  end: string;
  color: string;
}

export type PendingStatus = "pending" | "confirming" | "confirmed" | "cancelled";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  actions?: { type: "created" | "updated"; task: AssistantTask }[];
  pendingDelete?: { tasks: AssistantTask[]; status: PendingStatus };
}

interface ApiErrorFields {
  isInvalidToken?: boolean;
  error?: { message: string; code: string };
}

interface ChatResponse extends ApiErrorFields {
  reply?: string;
  actions?: ChatMessage["actions"];
  pendingAction?: { type: "delete"; tasks: AssistantTask[] } | null;
  changed?: boolean;
}

interface ConfirmResponse extends ApiErrorFields {
  deleted?: AssistantTask[];
  changed?: boolean;
}

const STORAGE_KEY = "task-tracker:assistant-chat";
// Matches the backend's history limit.
const MAX_HISTORY_MESSAGES = 12;

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function loadMessages(): ChatMessage[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    // A confirm that was in flight when the page reloaded can be retried.
    return parsed.map((m: ChatMessage) =>
      m.pendingDelete?.status === "confirming" ? { ...m, pendingDelete: { ...m.pendingDelete, status: "pending" } } : m
    );
  } catch {
    return [];
  }
}

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorFields>(error)) {
    return error.response?.data?.error?.message || error.message || fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

/** Chat state for the AI assistant, kept for the browser session. */
export function useAssistant({ onChanged, onInvalidToken }: { onChanged: () => void; onInvalidToken: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage can be unavailable (private mode); the chat still works in memory.
    }
  }, [messages]);

  const append = (message: ChatMessage) => setMessages((prev) => [...prev, message]);

  const setPendingStatus = (messageId: string, status: PendingStatus) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId && m.pendingDelete ? { ...m, pendingDelete: { ...m.pendingDelete, status } } : m))
    );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isSending) return;

      const userMessage: ChatMessage = { id: newId(), role: "user", content };
      const history = [...messagesRef.current, userMessage]
        .filter((m) => !m.isError && m.content.trim())
        .slice(-MAX_HISTORY_MESSAGES)
        .map(({ role, content }) => ({ role, content }));

      append(userMessage);
      setIsSending(true);
      try {
        const res = await chatApi.post<ChatResponse>("/", {
          messages: history,
          clientNow: toDateTimeInput(new Date()),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        if (res.data?.isInvalidToken) {
          onInvalidToken();
          return;
        }
        if (res.data?.error) throw new Error(res.data.error.message);

        append({
          id: newId(),
          role: "assistant",
          content: res.data.reply ?? "",
          actions: res.data.actions?.length ? res.data.actions : undefined,
          pendingDelete: res.data.pendingAction?.tasks?.length
            ? { tasks: res.data.pendingAction.tasks, status: "pending" }
            : undefined,
        });
        if (res.data.changed) onChanged();
      } catch (error) {
        append({
          id: newId(),
          role: "assistant",
          isError: true,
          content: errorMessage(error, "Something went wrong. Please try again."),
        });
      } finally {
        setIsSending(false);
      }
    },
    [isSending, onChanged, onInvalidToken]
  );

  const confirmDelete = useCallback(
    async (messageId: string) => {
      const message = messagesRef.current.find((m) => m.id === messageId);
      if (!message?.pendingDelete || message.pendingDelete.status !== "pending") return;

      setPendingStatus(messageId, "confirming");
      try {
        const res = await chatApi.post<ConfirmResponse>("/confirm", {
          action: { type: "delete", taskIds: message.pendingDelete.tasks.map((task) => task.id) },
        });
        if (res.data?.isInvalidToken) {
          onInvalidToken();
          return;
        }
        if (res.data?.error) throw new Error(res.data.error.message);

        setPendingStatus(messageId, "confirmed");
        const titles: string[] = (res.data.deleted ?? []).map((task: AssistantTask) => `"${task.title}"`);
        append({
          id: newId(),
          role: "assistant",
          content: titles.length
            ? `Deleted ${titles.length === 1 ? "1 task" : `${titles.length} tasks`}: ${titles.join(", ")}.`
            : "Those tasks were already gone, so nothing was deleted.",
        });
        if (res.data.changed) onChanged();
      } catch (error) {
        setPendingStatus(messageId, "pending");
        append({
          id: newId(),
          role: "assistant",
          isError: true,
          content: errorMessage(error, "Couldn't delete those tasks. Please try again."),
        });
      }
    },
    [onChanged, onInvalidToken]
  );

  const cancelDelete = useCallback((messageId: string) => {
    const message = messagesRef.current.find((m) => m.id === messageId);
    if (message?.pendingDelete?.status !== "pending") return;
    setPendingStatus(messageId, "cancelled");
    append({ id: newId(), role: "assistant", content: "Okay, I didn't delete anything." });
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, isSending, send, confirmDelete, cancelDelete, clear };
}

export type AssistantState = ReturnType<typeof useAssistant>;
