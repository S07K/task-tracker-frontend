import { useOutletContext } from "react-router-dom";
import { TaskEvent } from "../../lib/date";

export interface TaskDraft {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface DashboardContext {
  events: TaskEvent[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  openCreate: (draft?: TaskDraft) => void;
  openEdit: (event: TaskEvent) => void;
}

export const useDashboard = () => useOutletContext<DashboardContext>();
