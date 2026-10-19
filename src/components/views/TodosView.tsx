import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority } from '../../types';

export const TodosView: React.FC = () => {
  const {
    tasks,
    toggleTask,
    deleteTask,
    postponeTask,
    postponeAllPendingTasks,
    addTask,
    showToast,
    setIsDatePickerOpen
  } = useApp();

  const [statusTab, setStatusTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState<'deadline' | 'priority'>('deadline');

  // Quick task form state
  const [formTitle, setFormTitle] = useState('');
  const [formStartTime, setFormStartTime] = useState('14:00');
  const [formEndTime, setFormEndTime] = useState('18:00');
  const [formPriority, setFormPriority] = useState<Priority>('p1');
  const [formGoal, setFormGoal] = useState('portfolio');
  const [formMemo, setFormMemo] = useState('');

  const taskTitleInputRef = useRef<HTMLInputElement>(null);

  // Shortcut key 'N' to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        taskTitleInputRef.current?.focus();
        taskTitleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (statusTab === 'in-progress' && t.completed) return false;
    if (statusTab === 'completed' && !t.completed) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (goalFilter === 'portfolio' && t.goalId !== 'portfolio') return false;
    if (goalFilter === 'reading' && t.tag !== '독서') return false;
    if (goalFilter === 'fitness' && t.tag !== '운동') return false;
    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.filter((t) => !t.completed).length;
  const totalCount = tasks.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 1000) / 10 : 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addTask({
      title: formTitle.trim(),
      completed: false,
      priority: formPriority,
      tag: formGoal === 'portfolio' ? '디자인' : formGoal === 'reading' ? '독서' : '업무',
      startTime: formStartTime,
      endTime: formEndTime,
      deadline: `오늘 ${formEndTime} 마감`,
      goalId: formGoal === 'none' ? undefined : formGoal,
      note: formMemo.trim(),
      date: '2025-05-19'
    });

    setFormTitle('');
    setFormMemo('');
  };

  const miniWeek = [
    { date: 15, day: '목' },
    { date: 16, day: '금' },
    { date: 17, day: '토' },
    { date: 18, day: '일' },
    { date: 19, day: '오늘', isToday: true },
    { date: 20, day: '화' },
    { date: 21, day: '수' }
  ];

  return (
    <div className="w-full px-6 lg:px-8 py-6 flex flex-col gap-8 max-w-[1720px] mx-auto">
      {/* Top Command & Date Navigation Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[26px]">task_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  투두 리스트
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold">
                  2025년 5월 19일 (월)
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                선택한 날짜의 작업 파이프라인 및 목표 진행도
              </p>
            </div>
          </div>

          {/* Mini Week Strip */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low overflow-x-auto">
            {miniWeek.map((item) => (
              <button
                key={item.date}
                type="button"
                onClick={() => {
                  if (item.isToday) {
                    showToast('오늘 (5월 19일) 할 일 목록입니다.');
                  } else {
                    showToast(`5월 ${item.date}일 작업 목록을 조회합니다.`);
                  }
                }}
                className={`flex flex-col items-center justify-center w-12 py-1.5 rounded-lg transition-all cursor-pointer ${
                  item.isToday
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span
                  className={`font-label-sm text-label-sm ${
                    item.isToday ? 'text-on-primary/80 font-medium' : 'text-outline'
                  }`}
                >
                  {item.day}
                </span>
                <span className="font-title-md text-title-md font-semibold mt-0.5">{item.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Velocity & Quick Global Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Progress Ring Widget */}
          <div className="flex items-center gap-3.5 px-4 py-2 bg-surface-container-low rounded-xl">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                ></path>
                <path
                  className="text-secondary transition-all duration-700 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${completionPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>
              <span className="absolute font-label-sm text-label-sm font-semibold text-secondary">
                {Math.round(completionPct)}%
              </span>
            </div>
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                오늘 달성률
              </div>
              <div className="font-title-md text-title-md text-on-surface font-semibold">
                {completedCount} / {totalCount} 완료{' '}
                <span className="font-body-sm text-body-sm font-normal text-secondary">
                  ({completionPct}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={postponeAllPendingTasks}
              className="inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-high transition-colors active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary">redo</span>
              <span>미완료 일괄 내일로 이동</span>
            </button>

            <button
              onClick={() => taskTitleInputRef.current?.focus()}
              className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>새 할 일 추가</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-primary-container/40 text-on-primary rounded font-label-sm">
                N
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: 2-Column Asymmetric Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left & Center: Filter Strip and Task Stream (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Filter Bar System */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-4 border border-surface-container-high/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                <button
                  onClick={() => setStatusTab('all')}
                  className={`status-tab px-3.5 py-1.5 rounded-lg font-body-md text-body-md font-semibold transition-colors cursor-pointer ${
                    statusTab === 'all'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  전체 <span className="ml-1 font-label-sm text-label-sm text-primary">{totalCount}</span>
                </button>
                <button
                  onClick={() => setStatusTab('in-progress')}
                  className={`status-tab px-3.5 py-1.5 rounded-lg font-body-md text-body-md font-semibold transition-colors cursor-pointer ${
                    statusTab === 'in-progress'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  진행 중{' '}
                  <span className="ml-1 font-label-sm text-label-sm text-outline">{inProgressCount}</span>
                </button>
                <button
                  onClick={() => setStatusTab('completed')}
                  className={`status-tab px-3.5 py-1.5 rounded-lg font-body-md text-body-md font-semibold transition-colors cursor-pointer ${
                    statusTab === 'completed'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  완료됨{' '}
                  <span className="ml-1 font-label-sm text-label-sm text-secondary">
                    {completedCount}
                  </span>
                </button>
              </div>

              {/* Priority Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                    priorityFilter === 'all'
                      ? 'bg-surface-container text-on-surface font-bold'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  모든 우선순위
                </button>
                <button
                  onClick={() => setPriorityFilter('p0')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                    priorityFilter === 'p0'
                      ? 'bg-error-container text-on-error-container font-bold ring-1 ring-error'
                      : 'bg-surface-container-low text-error hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  <span>P0 높음</span>
                </button>
                <button
                  onClick={() => setPriorityFilter('p1')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                    priorityFilter === 'p1'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold ring-1 ring-tertiary'
                      : 'bg-surface-container-low text-tertiary hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  <span>P1 보통</span>
                </button>
                <button
                  onClick={() => setPriorityFilter('p2')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                    priorityFilter === 'p2'
                      ? 'bg-primary-fixed text-on-primary-fixed-variant font-bold ring-1 ring-primary'
                      : 'bg-surface-container-low text-primary hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>P2 낮음</span>
                </button>
              </div>
            </div>

            {/* Goal Link & Sort Sub-strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  목표 필터:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setGoalFilter('all')}
                    className={`px-2.5 py-1 rounded-full font-body-sm text-body-sm transition-colors cursor-pointer ${
                      goalFilter === 'all'
                        ? 'bg-surface-container text-primary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    전체 목표
                  </button>
                  <button
                    onClick={() => setGoalFilter('portfolio')}
                    className={`px-2.5 py-1 rounded-full font-body-sm text-body-sm transition-colors cursor-pointer ${
                      goalFilter === 'portfolio'
                        ? 'bg-surface-container text-primary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    포트폴리오
                  </button>
                  <button
                    onClick={() => setGoalFilter('reading')}
                    className={`px-2.5 py-1 rounded-full font-body-sm text-body-sm transition-colors cursor-pointer ${
                      goalFilter === 'reading'
                        ? 'bg-surface-container text-primary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    독서 루틴
                  </button>
                  <button
                    onClick={() => setGoalFilter('fitness')}
                    className={`px-2.5 py-1 rounded-full font-body-sm text-body-sm transition-colors cursor-pointer ${
                      goalFilter === 'fitness'
                        ? 'bg-surface-container text-primary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    운동 루틴
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-outline">
                  정렬: {sortOrder === 'deadline' ? '마감시간순' : '우선순위순'}
                </span>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === 'deadline' ? 'priority' : 'deadline'))
                  }
                  className="w-7 h-7 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                  type="button"
                  title="정렬 기준 변경"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Task Group 1: Pending Tasks */}
          {statusTab !== 'completed' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                    미완료 할 일
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                    {pendingTasks.length}개 남음
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  드래그하여 순서 변경 가능
                </span>
              </div>

              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group relative bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-4 border border-surface-container-high/40"
                  >
                    {/* Left accent color stripe */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                        task.priority === 'p0'
                          ? 'bg-error'
                          : task.priority === 'p1'
                          ? 'bg-tertiary'
                          : 'bg-primary'
                      }`}
                    ></div>

                    <div className="pt-0.5 pl-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-5 h-5 rounded text-primary focus:ring-0 focus:outline-none cursor-pointer accent-secondary"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          onClick={() => toggleTask(task.id)}
                          className="font-title-md text-title-md text-on-surface font-medium group-hover:text-primary transition-colors cursor-pointer"
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          {task.priority === 'p0' && (
                            <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> P0 높음
                            </span>
                          )}
                          {task.priority === 'p1' && (
                            <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> P1 보통
                            </span>
                          )}
                          {task.priority === 'p2' && (
                            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> P2 낮음
                            </span>
                          )}
                          {task.goalId === 'portfolio' && (
                            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-medium">
                              포트폴리오
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                        {task.deadline && (
                          <div
                            className={`flex items-center gap-1 font-medium ${
                              task.deadline.includes('15:00')
                                ? 'text-tertiary'
                                : 'text-error'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {task.deadline.includes('15:00') ? 'alarm' : 'schedule'}
                            </span>
                            <span>{task.deadline}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-outline">tag</span>
                          <span>#{task.tag}</span>
                        </div>
                        {task.note && (
                          <div className="flex items-center gap-1 text-outline">
                            <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
                            <span className="truncate max-w-[200px]">{task.note}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Palette on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                        title="내일로 이동"
                        onClick={() => postponeTask(task.id)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                        title="삭제"
                        onClick={() => deleteTask(task.id)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-surface-container-lowest border border-surface-container-high/40 flex flex-col items-center justify-center gap-2.5">
                  <span className="material-symbols-outlined text-[32px] text-primary">task_alt</span>
                  <p className="font-title-md text-on-surface font-semibold">미완료 할 일이 없습니다.</p>
                  <p className="font-body-sm text-outline">
                    오른쪽 &apos;빠른 할 일 추가&apos; 양식을 이용해 새로운 작업을 등록해보세요.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Task Group 2: Completed Tasks */}
          {statusTab !== 'in-progress' && completedTasks.length > 0 && !isHideCompleted && (
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    check_circle
                  </span>
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                    완료된 할 일
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                    {completedTasks.length}개 완료
                  </span>
                </div>
                <button
                  onClick={() => setIsHideCompleted(true)}
                  className="font-body-sm text-body-sm text-primary hover:underline cursor-pointer"
                  type="button"
                >
                  완료 내역 숨기기
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface-container-lowest/70 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-opacity hover:bg-surface-container-lowest border border-surface-container-high/30"
                  >
                    <div
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3.5 min-w-0 cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-on-secondary shrink-0">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant line-through truncate">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {task.completedAt && (
                        <span className="font-label-sm text-label-sm text-outline">
                          {task.completedAt}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        done_all
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isHideCompleted && completedTasks.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setIsHideCompleted(false)}
                className="text-body-sm text-primary hover:underline font-medium"
                type="button"
              >
                숨겨진 완료 항목 {completedTasks.length}개 다시 보기
              </button>
            </div>
          )}
        </div>

        {/* Right Side Panel: Fast Task Creation & Reschedule Control Center (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Fast Creation Form Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-5 border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">post_add</span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                  빠른 할 일 추가
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline">속성 상세 지정</span>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-medium text-on-surface"
                  htmlFor="task-title-input"
                >
                  할 일 제목 *
                </label>
                <input
                  ref={taskTitleInputRef}
                  className="w-full h-[40px] px-3.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
                  id="task-title-input"
                  placeholder="어떤 일을 완료해야 하나요?"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              {/* Schedule & Deadline Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    시작 시간
                  </label>
                  <input
                    className="w-full h-[38px] px-3 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none"
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    마감 기한
                  </label>
                  <input
                    className="w-full h-[38px] px-3 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none"
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Priority Selector (Radio Pills) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  우선순위
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPriority('p0')}
                    className={`h-[36px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formPriority === 'p0'
                        ? 'bg-error-container text-on-error-container font-semibold ring-1 ring-error'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span>P0 높음</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('p1')}
                    className={`h-[36px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formPriority === 'p1'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold ring-1 ring-tertiary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span>P1 보통</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('p2')}
                    className={`h-[36px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formPriority === 'p2'
                        ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold ring-1 ring-primary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>P2 낮음</span>
                  </button>
                </div>
              </div>

              {/* Goal Link Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  연결할 월간 목표
                </label>
                <select
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  className="w-full h-[40px] px-3.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none cursor-pointer"
                >
                  <option value="none">목표 연결 안 함</option>
                  <option value="portfolio">🎨 포트폴리오 사이트 완성 (65%)</option>
                  <option value="reading">📚 매월 경제도서 2권 완독 (40%)</option>
                  <option value="fitness">🏃 주 4회 유산소 및 코어 강화 (80%)</option>
                </select>
              </div>

              {/* Memo Field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  메모 및 체크리스트
                </label>
                <textarea
                  value={formMemo}
                  onChange={(e) => setFormMemo(e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                  placeholder="관련 링크, 참고 메모 또는 세부 작업 목록을 적어주세요..."
                  rows={3}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                className="w-full h-[42px] mt-1 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>할 일 등록 완료</span>
              </button>
            </form>
          </div>

          {/* Smart Reschedule Guide Widget */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-surface-container-high/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-tertiary-container/15 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">update</span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  미완료 할 일 이동 가이드
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  스트레스 없이 다음 일정으로 순연
                </p>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              오늘 계획 중 처리하지 못한{' '}
              <strong className="text-on-surface font-medium">{inProgressCount}개</strong>의 할 일이
              있습니다. 집중도 높은 업무 흐름을 위해 일정으로 재배치하세요.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  postponeAllPendingTasks();
                }}
                className="flex flex-col items-start p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left group cursor-pointer"
                type="button"
              >
                <span className="font-label-md text-label-md font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  내일 (화) 로 이동 →
                </span>
                <span className="font-body-sm text-body-sm text-outline mt-1">
                  오전 9시 슬롯 자동 배치
                </span>
              </button>

              <button
                onClick={() => {
                  showToast('토요일 여유 시간대로 미완료 할 일들이 재배치되었습니다.');
                }}
                className="flex flex-col items-start p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left group cursor-pointer"
                type="button"
              >
                <span className="font-label-md text-label-md font-semibold text-on-surface group-hover:translate-x-0.5 transition-transform">
                  이번 주말 배정 →
                </span>
                <span className="font-body-sm text-body-sm text-outline mt-1">
                  토요일 여유 시간대
                </span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline">
                  calendar_month
                </span>
                <span className="font-body-sm text-body-sm text-on-surface">
                  특정 날짜 직접 지정
                </span>
              </div>
              <button
                onClick={() => setIsDatePickerOpen(true)}
                className="font-label-md text-label-md text-primary font-medium hover:underline cursor-pointer"
                type="button"
              >
                선택하기
              </button>
            </div>
          </div>

          {/* Productivity Rhythm Micro-card */}
          <div className="bg-primary-container text-on-primary-container p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-[32px] text-on-primary-container shrink-0">
              bolt
            </span>
            <div>
              <div className="font-title-md text-title-md font-semibold">딥워크 포커스 타임</div>
              <p className="font-body-sm text-body-sm text-on-primary-container/80 mt-0.5">
                오후 2시 ~ 4시 동안 알림을 차단하고 2개의 P0 핵심 할 일에 몰입하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
