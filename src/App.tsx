import { useCallback, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/dashboard/Sidebar";
import TaskDialog, { TaskDialogState } from "./components/dashboard/TaskDialog";
import { Account, DashboardContext, TaskDraft } from "./components/dashboard/context";
import AssistantPanel from "./components/assistant/AssistantPanel";
import { useAssistant } from "./components/assistant/useAssistant";
import { eventsApi, usersApi } from "./lib/api";
import { TaskEvent } from "./lib/date";
import { logOut } from "./redux/eventActions";

function App() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: any) => state.event);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState<TaskDialogState | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleInvalidToken = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  const refresh = useCallback(async () => {
    try {
      const res: any = await eventsApi.get("/getAllEvents");
      if (res.data?.isInvalidToken) {
        handleInvalidToken();
        return;
      }
      if (res.data?.events) {
        setEvents(res.data.events);
      } else {
        console.error("Error fetching events");
      }
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setIsLoading(false);
    }
  }, [handleInvalidToken]);

  const fetchAccount = useCallback(async () => {
    try {
      const res: any = await usersApi.get("/me");
      if (res.data?.isInvalidToken) {
        handleInvalidToken();
        return;
      }
      if (res.data?.user) {
        setAccount(res.data.user);
      } else {
        console.error("Error fetching account", res.data?.error);
      }
    } catch (error) {
      console.error("Error fetching account", error);
    }
  }, [handleInvalidToken]);

  useEffect(() => {
    if (userId) {
      refresh();
      fetchAccount();
    }
  }, [userId, refresh, fetchAccount]);

  // Tasks changed through chat refresh the list and calendar behind the panel.
  const assistant = useAssistant({ onChanged: refresh, onInvalidToken: handleInvalidToken });

  const context: DashboardContext = {
    events,
    isLoading,
    refresh,
    openCreate: (draft?: TaskDraft) => setDialog({ mode: "create", draft }),
    openEdit: (event: TaskEvent) => setDialog({ mode: "edit", event }),
    account,
    setAccount,
  };

  return (
    <Box minH="100vh" bg="white">
      <Sidebar account={account} onOpenAssistant={() => setIsAssistantOpen(true)} />
      <Box as="main" ml={{ base: 0, md: "224px" }} pb={{ base: 20, md: 0 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Outlet context={context} />
        </Box>
      </Box>
      <TaskDialog state={dialog} onClose={() => setDialog(null)} onSaved={refresh} />
      <AssistantPanel isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} assistant={assistant} />
    </Box>
  );
}

export default App;
