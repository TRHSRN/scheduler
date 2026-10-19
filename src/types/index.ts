export type Priority = 'p0' | 'p1' | 'p2';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  priority: Priority;
  tag: string;
  category?: string;
  deadline?: string;
  startTime?: string;
  endTime?: string;
  note?: string;
  goalId?: string;
  date: string; // e.g. "2025-05-19"
}

export type EventCategory = 'work' | 'meeting' | 'study' | 'personal' | 'health';
export type EventColor = 'primary' | 'primary-container' | 'secondary' | 'tertiary' | 'error';

export interface ScheduleEvent {
  id: string;
  title: string;
  day: number; // e.g. 19 to 25
  dayName: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  dateStr: string; // "2025-05-19"
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  location: string;
  category: EventCategory;
  categoryLabel: string;
  color: EventColor;
  memo: string;
  isOngoing?: boolean;
  repeatWeekly?: boolean;
  notification?: boolean;
  topPx: number;
  heightPx: number;
  widthPercent?: number;
  leftPercent?: number;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'count' | 'checklist' | 'time';
  typeLabel: string;
  category: string;
  categoryIcon: string;
  current: number;
  total: number;
  unit: string;
  description: string;
  recentLog?: string;
  milestones?: Milestone[];
  weeklyMilestones?: { week: string; count: string; completed: boolean }[];
  deadlineStr?: string;
}

export type TabType = 'dashboard' | 'schedule' | 'todos' | 'goals-and-stats';
