import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, ScheduleEvent, Goal, TabType } from '../types';
import { INITIAL_TASKS, INITIAL_SCHEDULE_EVENTS, INITIAL_GOALS, DEFAULT_USER_NAME } from '../data/initialData';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userName: string;
  setUserName: (name: string) => void;
  tasks: Task[];
  events: ScheduleEvent[];
  goals: Goal[];
  quickMemo: string;
  setQuickMemo: (memo: string) => void;
  selectedScheduleEvent: ScheduleEvent | null;
  isScheduleModalOpen: boolean;
  openScheduleModal: (event: ScheduleEvent) => void;
  closeScheduleModal: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createModalDefaultTab: 'event' | 'task';
  openCreateModal: (defaultTab?: 'event' | 'task') => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Task methods
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  postponeTask: (id: string) => void;
  postponeAllPendingTasks: () => void;
  // Event methods
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteEvent: (id: string) => void;
  // Goal methods
  incrementGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  // Utilities
  exportICS: () => void;
  exportJSON: () => void;
  importJSON: (data: string) => boolean;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure clean state migration synchronously on first load
  const CLEAN_STORAGE_KEY = 'dayflow_clean_fresh_v5';
  if (typeof window !== 'undefined' && localStorage.getItem(CLEAN_STORAGE_KEY) !== 'true') {
    localStorage.removeItem('dayflow_tasks');
    localStorage.removeItem('dayflow_events');
    localStorage.removeItem('dayflow_goals');
    localStorage.removeItem('dayflow_quick_memo');
    localStorage.setItem('dayflow_user_name', DEFAULT_USER_NAME);
    localStorage.setItem(CLEAN_STORAGE_KEY, 'true');
  }

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('dayflow_dark_mode') === 'true';
  });

  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('dayflow_user_name') || DEFAULT_USER_NAME;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dayflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('dayflow_events');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_EVENTS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('dayflow_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [quickMemo, setQuickMemoState] = useState<string>(() => {
    return localStorage.getItem('dayflow_quick_memo') || '';
  });

  const [selectedScheduleEvent, setSelectedScheduleEvent] = useState<ScheduleEvent | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultTab, setCreateModalDefaultTab] = useState<'event' | 'task'>('task');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dayflow_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Persist user name
  const setUserName = (name: string) => {
    const trimmed = name.trim() || DEFAULT_USER_NAME;
    setUserNameState(trimmed);
    localStorage.setItem('dayflow_user_name', trimmed);
    showToast(`이름이 '${trimmed}'으로 변경되었습니다.`);
  };

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('dayflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist events
  useEffect(() => {
    localStorage.setItem('dayflow_events', JSON.stringify(events));
  }, [events]);

  // Persist goals
  useEffect(() => {
    localStorage.setItem('dayflow_goals', JSON.stringify(goals));
  }, [goals]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setQuickMemo = (memo: string) => {
    setQuickMemoState(memo);
    localStorage.setItem('dayflow_quick_memo', memo);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  const openScheduleModal = (event: ScheduleEvent) => {
    setSelectedScheduleEvent(event);
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const openCreateModal = (defaultTab: 'event' | 'task' = 'task') => {
    setCreateModalDefaultTab(defaultTab);
    setIsCreateModalOpen(true);
  };

  // Task Handlers
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`'${newTask.title}' 할 일이 추가되었습니다.`);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? `${timeStr} 완료` : undefined
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`'${taskToDelete?.title || '할 일'}' 항목이 삭제되었습니다.`);
  };

  const postponeTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            deadline: '내일 09:00 예정',
            date: '2025-05-20'
          };
        }
        return t;
      })
    );
    showToast('할 일이 내일 일정으로 순연되었습니다.');
  };

  const postponeAllPendingTasks = () => {
    const count = tasks.filter(t => !t.completed).length;
    if (count === 0) {
      showToast('이동할 미완료 할 일이 없습니다.');
      return;
    }
    setTasks(prev =>
      prev.map(t => {
        if (!t.completed) {
          return {
            ...t,
            deadline: '내일 09:00 예정',
            date: '2025-05-20'
          };
        }
        return t;
      })
    );
    showToast(`미완료 할 일 ${count}개가 내일로 일괄 이동되었습니다.`);
  };

  // Event Handlers
  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvt: ScheduleEvent = {
      ...event,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvt]);
    showToast(`'${newEvt.title}' 일정이 등록되었습니다.`);
  };

  const updateEvent = (id: string, updates: Partial<ScheduleEvent>) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === id) {
          const updated = { ...evt, ...updates };
          if (selectedScheduleEvent?.id === id) {
            setSelectedScheduleEvent(updated);
          }
          return updated;
        }
        return evt;
      })
    );
    showToast('일정이 성공적으로 수정되었습니다.');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
    setIsScheduleModalOpen(false);
    showToast('일정이 삭제되었습니다.');
  };

  // Goal Handlers
  const incrementGoal = (id: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          if (g.current >= g.total) {
            showToast('이미 이번 달 목표량을 100% 달성했습니다! 멋진 성취입니다 🎉');
            return g;
          }
          const next = g.current + 1;
          showToast(`'${g.title}' 진척도: ${next}/${g.total} ${g.unit}`);
          return { ...g, current: next };
        }
        return g;
      })
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId && g.milestones) {
          const updatedMilestones = g.milestones.map(m => {
            if (m.id === milestoneId) {
              return { ...m, completed: !m.completed };
            }
            return m;
          });
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          return {
            ...g,
            milestones: updatedMilestones,
            current: completedCount
          };
        }
        return g;
      })
    );
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, newGoal]);
    showToast(`'${newGoal.title}' 월간 목표가 등록되었습니다.`);
  };

  // ICS Export
  const exportICS = () => {
    if (events.length === 0) {
      showToast('내보낼 일정이 없습니다.');
      return;
    }
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Dayflow//Calendar 1.0//KO\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;
    events.forEach(evt => {
      const cleanDate = evt.dateStr.replace(/-/g, '');
      const [startH, startM] = evt.startTime.split(':');
      const [endH, endM] = evt.endTime.split(':');
      const dtStart = `${cleanDate}T${startH}${startM}00`;
      const dtEnd = `${cleanDate}T${endH}${endM}00`;
      icsContent += `BEGIN:VEVENT\nUID:${evt.id}@dayflow.app\nSUMMARY:${evt.title}\nDESCRIPTION:${evt.memo || ''}\nLOCATION:${evt.location || ''}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayflow_schedule_2025_05.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('iCalendar(.ics) 파일이 다운로드되었습니다.');
  };

  // JSON Export & Import
  const exportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      userName,
      tasks,
      events,
      goals,
      quickMemo
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('전체 데이터 스냅샷 JSON 파일이 다운로드되었습니다.');
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed.userName === 'string') {
        setUserNameState(parsed.userName);
        localStorage.setItem('dayflow_user_name', parsed.userName);
      }
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
      }
      if (parsed.events && Array.isArray(parsed.events)) {
        setEvents(parsed.events);
      }
      if (parsed.goals && Array.isArray(parsed.goals)) {
        setGoals(parsed.goals);
      }
      if (typeof parsed.quickMemo === 'string') {
        setQuickMemo(parsed.quickMemo);
      }
      showToast('백업 데이터가 성공적으로 복원되었습니다.');
      return true;
    } catch {
      showToast('올바르지 않은 JSON 파일 형식입니다.');
      return false;
    }
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setEvents(INITIAL_SCHEDULE_EVENTS);
    setGoals(INITIAL_GOALS);
    setQuickMemoState('');
    setUserNameState(DEFAULT_USER_NAME);
    localStorage.removeItem('dayflow_tasks');
    localStorage.removeItem('dayflow_events');
    localStorage.removeItem('dayflow_goals');
    localStorage.removeItem('dayflow_quick_memo');
    localStorage.setItem('dayflow_user_name', DEFAULT_USER_NAME);
    showToast('모든 일정과 투두가 초기화되었습니다.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        userName,
        setUserName,
        tasks,
        events,
        goals,
        quickMemo,
        setQuickMemo,
        selectedScheduleEvent,
        isScheduleModalOpen,
        openScheduleModal,
        closeScheduleModal,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createModalDefaultTab,
        openCreateModal,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isDatePickerOpen,
        setIsDatePickerOpen,
        toastMessage,
        showToast,
        addTask,
        toggleTask,
        deleteTask,
        postponeTask,
        postponeAllPendingTasks,
        addEvent,
        updateEvent,
        deleteEvent,
        incrementGoal,
        toggleMilestone,
        addGoal,
        exportICS,
        exportJSON,
        importJSON,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
