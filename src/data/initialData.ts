import { Task, ScheduleEvent, Goal } from '../types';

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const DEFAULT_USER_NAME = '유저님!';

export const DAY_ANALYTICS_DATA: Record<string, {
  dayName: string;
  dateFull: string;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  categories: { name: string; count: number; color?: string }[];
  focusTime: string;
  statusText: string;
  statusBadge: string;
  isMvp?: boolean;
  desc: string;
}> = {
  mon: {
    dayName: '월',
    dateFull: '5월 19일 (월)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '기록 대기',
    statusBadge: 'bg-surface-container text-on-surface-variant',
    desc: '오늘 완료된 투두가 아직 없습니다. 하루를 시작해보세요.'
  },
  tue: {
    dayName: '화',
    dateFull: '5월 20일 (화)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '예정 없음',
    statusBadge: 'bg-surface-container text-on-surface-variant',
    desc: '등록된 일정이 없습니다.'
  },
  wed: {
    dayName: '수',
    dateFull: '5월 21일 (수)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '예정 없음',
    statusBadge: 'bg-surface-container text-on-surface-variant',
    desc: '등록된 일정이 없습니다.'
  },
  thu: {
    dayName: '목',
    dateFull: '5월 22일 (목)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '예정 없음',
    statusBadge: 'bg-surface-container text-on-surface-variant',
    desc: '등록된 일정이 없습니다.'
  },
  fri: {
    dayName: '금',
    dateFull: '5월 23일 (금)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '예정 없음',
    statusBadge: 'bg-surface-container text-on-surface-variant',
    desc: '등록된 일정이 없습니다.'
  },
  sat: {
    dayName: '토',
    dateFull: '5월 24일 (토)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '주말 루틴',
    statusBadge: 'bg-surface-container text-outline',
    desc: '주말 예정 할 일을 등록해보세요.'
  },
  sun: {
    dayName: '일',
    dateFull: '5월 25일 (일)',
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    categories: [],
    focusTime: '0시간',
    statusText: '휴식일',
    statusBadge: 'bg-surface-container text-outline',
    desc: '자율 휴식 및 충전 루틴 전용.'
  }
};
