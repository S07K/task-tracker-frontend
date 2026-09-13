import { useCallback, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/dashboard/Sidebar";
import TaskDialog, { TaskDialogState } from "./components/dashboard/TaskDialog";
import { DashboardContext, TaskDraft } from "./components/dashboard/context";
import { eventsApi } from "./lib/api";
import { TaskEvent } from "./lib/date";
import { logOut } from "./redux/eventActions";

function App() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: any) => state.event);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState<TaskDialogState | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res: any = await eventsApi.get("/getAllEvents");
      if (res.data?.isInvalidToken) {
        dispatch(logOut());
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
  }, [dispatch]);

  useEffect(() => {
    if (userId) refresh();
  }, [userId, refresh]);

  const context: DashboardContext = {
    events,
    isLoading,
    refresh,
    openCreate: (draft?: TaskDraft) => setDialog({ mode: "create", draft }),
    openEdit: (event: TaskEvent) => setDialog({ mode: "edit", event }),
  };

  return (
    <Box minH="100vh" bg="white">
      <Sidebar />
      <Box as="main" ml={{ base: 0, md: "224px" }} pb={{ base: 20, md: 0 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Outlet context={context} />
        </Box>
      </Box>
      <TaskDialog state={dialog} onClose={() => setDialog(null)} onSaved={refresh} />
    </Box>
  );
}

export default App;
