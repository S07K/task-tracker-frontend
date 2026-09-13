import { useOutletContext } from "react-router-dom";
import { TaskEvent } from "../../lib/date";

export interface TaskDraft {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface Account {
  id: string;
  name: string;
  email: string;
}

export interface DashboardContext {
  events: TaskEvent[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  openCreate: (draft?: TaskDraft) => void;
  openEdit: (event: TaskEvent) => void;
  account: Account | null;
  setAccount: (account: Account) => void;
}

export const useDashboard = () => useOutletContext<DashboardContext>();
