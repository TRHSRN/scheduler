import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Priority, EventCategory, EventColor } from '../types';

export const CreateModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultTab,
    addTask,
    addEvent,
    goals
  } = useApp();

  const [activeTab, setActiveTab] = useState<'task' | 'event'>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('p1');
  const [taskTag, setTaskTag] = useState('기획');
  const [taskDeadline, setTaskDeadline] = useState('오늘 18:00 마감');
  const [taskStartTime, setTaskStartTime] = useState('14:00');
  const [taskEndTime, setTaskEndTime] = useState('18:00');
  const [taskGoalId, setTaskGoalId] = useState('portfolio');
  const [taskNote, setTaskNote] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2025-05-19');
  const [eventStartTime, setEventStartTime] = useState('14:00');
  const [eventEndTime, setEventEndTime] = useState('15:30');
  const [eventLocation, setEventLocation] = useState('메인 컨퍼런스룸 3F');
  const [eventCategory, setEventCategory] = useState<EventCategory>('work');
  const [eventColor, setEventColor] = useState<EventColor>('primary');
  const [eventMemo, setEventMemo] = useState('');
  const [eventRepeat, setEventRepeat] = useState(false);
  const [eventNotify, setEventNotify] = useState(true);

  useEffect(() => {
    if (isCreateModalOpen) {
      setActiveTab(createModalDefaultTab);
    }
  }, [isCreateModalOpen, createModalDefaultTab]);

  if (!isCreateModalOpen) return null;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      completed: false,
      priority: taskPriority,
      tag: taskTag,
      category: taskTag,
      deadline: taskDeadline,
      startTime: taskStartTime,
      endTime: taskEndTime,
      goalId: taskGoalId,
      note: taskNote.trim(),
      date: '2025-05-19'
    });

    setTaskTitle('');
    setTaskNote('');
    setIsCreateModalOpen(false);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    // Calculate height and top based on 08:00 start time (64px/hour)
    const [startH, startM] = eventStartTime.split(':').map(Number);
    const [endH, endM] = eventEndTime.split(':').map(Number);

    const startMinutes = (startH - 8) * 60 + (startM || 0);
    const durationMinutes = (endH * 60 + (endM || 0)) - (startH * 60 + (startM || 0));

    const topPx = Math.max(0, Math.round((startMinutes / 60) * 64));
    const heightPx = Math.max(48, Math.round((durationMinutes / 60) * 64));

    const dayNumber = parseInt(eventDate.slice(8, 10), 10) || 19;
    const dayNames: Record<number, '월' | '화' | '수' | '목' | '금' | '토' | '일'> = {
      19: '월',
      20: '화',
      21: '수',
      22: '목',
      23: '금',
      24: '토',
      25: '일'
    };

    const categoryLabels: Record<EventCategory, string> = {
      work: '업무',
      meeting: '회의',
      study: '학습',
      personal: '개인',
      health: '운동'
    };

    addEvent({
      title: eventTitle.trim(),
      day: dayNumber,
      dayName: dayNames[dayNumber] || '월',
      dateStr: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventLocation.trim() || '홈 오피스',
      category: eventCategory,
      categoryLabel: categoryLabels[eventCategory],
      color: eventColor,
      memo: eventMemo.trim(),
      repeatWeekly: eventRepeat,
      notification: eventNotify,
      topPx,
      heightPx
    });

    setEventTitle('');
    setEventMemo('');
    setIsCreateModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsCreateModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container-high/60 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Mode Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`px-3.5 py-1.5 rounded-lg text-body-md font-semibold transition-all cursor-pointer ${
                activeTab === 'task'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              새 할 일
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('event')}
              className={`px-3.5 py-1.5 rounded-lg text-body-md font-semibold transition-all cursor-pointer ${
                activeTab === 'event'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              새 일정
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Task Form */}
        {activeTab === 'task' ? (
          <form onSubmit={handleTaskSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                할 일 제목 *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                placeholder="예: Dayflow 컴포넌트 접근성 검토"
                className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={taskStartTime}
                  onChange={(e) => setTaskStartTime(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  마감 기한
                </label>
                <input
                  type="time"
                  value={taskEndTime}
                  onChange={(e) => setTaskEndTime(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none"
                />
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                우선순위
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskPriority('p0')}
                  className={`h-9 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    taskPriority === 'p0'
                      ? 'bg-error-container text-on-error-container ring-1 ring-error'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span>P0 높음</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTaskPriority('p1')}
                  className={`h-9 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    taskPriority === 'p1'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant ring-1 ring-tertiary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span>P1 보통</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTaskPriority('p2')}
                  className={`h-9 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    taskPriority === 'p2'
                      ? 'bg-primary-fixed text-on-primary-fixed-variant ring-1 ring-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>P2 낮음</span>
                </button>
              </div>
            </div>

            {/* Goal Link & Tag */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  태그/카테고리
                </label>
                <select
                  value={taskTag}
                  onChange={(e) => setTaskTag(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none cursor-pointer"
                >
                  <option value="디자인">디자인</option>
                  <option value="기획">기획</option>
                  <option value="업무">업무</option>
                  <option value="리서치">리서치</option>
                  <option value="운동">운동</option>
                  <option value="독서">독서</option>
                  <option value="개인">개인</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  연결할 월간 목표
                </label>
                <select
                  value={taskGoalId}
                  onChange={(e) => setTaskGoalId(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none cursor-pointer"
                >
                  <option value="none">목표 연결 안 함</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({Math.round((g.current / g.total) * 100)}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                메모
              </label>
              <textarea
                value={taskNote}
                onChange={(e) => setTaskNote(e.target.value)}
                placeholder="참고 링크나 세부 할 일 목록을 기록하세요..."
                rows={2}
                className="p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-primary-container shadow-sm transition-all"
              >
                할 일 등록
              </button>
            </div>
          </form>
        ) : (
          /* Event Form */
          <form onSubmit={handleEventSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                일정 명칭 *
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                placeholder="예: 클라이언트 프로토타입 데모 미팅"
                className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  날짜
                </label>
                <select
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="h-10 px-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none cursor-pointer"
                >
                  <option value="2025-05-19">5/19 (월)</option>
                  <option value="2025-05-20">5/20 (화)</option>
                  <option value="2025-05-21">5/21 (수)</option>
                  <option value="2025-05-22">5/22 (목)</option>
                  <option value="2025-05-23">5/23 (금)</option>
                  <option value="2025-05-24">5/24 (토)</option>
                  <option value="2025-05-25">5/25 (일)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="h-10 px-2 rounded-xl bg-surface-container-low text-on-surface font-label-md text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  종료 시간
                </label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="h-10 px-2 rounded-xl bg-surface-container-low text-on-surface font-label-md text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  장소 / 링크
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="예: 메인 컨퍼런스룸 3F"
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-medium text-on-surface">
                  카테고리
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => {
                    const cat = e.target.value as EventCategory;
                    setEventCategory(cat);
                    if (cat === 'work') setEventColor('primary');
                    if (cat === 'meeting') setEventColor('primary-container');
                    if (cat === 'study') setEventColor('secondary');
                    if (cat === 'health') setEventColor('tertiary');
                    if (cat === 'personal') setEventColor('tertiary');
                  }}
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none cursor-pointer"
                >
                  <option value="work">업무</option>
                  <option value="meeting">회의</option>
                  <option value="study">학습/QA</option>
                  <option value="personal">개인</option>
                  <option value="health">운동</option>
                </select>
              </div>
            </div>

            {/* Color Swatch */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                일정 색상 테마
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEventColor('primary')}
                  className={`w-7 h-7 rounded-full bg-primary transition-all cursor-pointer ${
                    eventColor === 'primary' ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setEventColor('primary-container')}
                  className={`w-7 h-7 rounded-full bg-primary-container transition-all cursor-pointer ${
                    eventColor === 'primary-container' ? 'ring-2 ring-offset-2 ring-primary-container scale-110' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setEventColor('secondary')}
                  className={`w-7 h-7 rounded-full bg-secondary transition-all cursor-pointer ${
                    eventColor === 'secondary' ? 'ring-2 ring-offset-2 ring-secondary scale-110' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setEventColor('tertiary')}
                  className={`w-7 h-7 rounded-full bg-tertiary transition-all cursor-pointer ${
                    eventColor === 'tertiary' ? 'ring-2 ring-offset-2 ring-tertiary scale-110' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setEventColor('error')}
                  className={`w-7 h-7 rounded-full bg-error transition-all cursor-pointer ${
                    eventColor === 'error' ? 'ring-2 ring-offset-2 ring-error scale-110' : ''
                  }`}
                />
              </div>
            </div>

            {/* Memo */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-medium text-on-surface">
                아젠다 및 상세 메모
              </label>
              <textarea
                value={eventMemo}
                onChange={(e) => setEventMemo(e.target.value)}
                placeholder="참석자, 안건, 준비물 등 메모..."
                rows={2}
                className="p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventRepeat}
                  onChange={(e) => setEventRepeat(e.target.checked)}
                  className="rounded text-primary accent-primary"
                />
                <span className="font-body-sm text-body-sm text-on-surface">매주 반복</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventNotify}
                  onChange={(e) => setEventNotify(e.target.checked)}
                  className="rounded text-primary accent-primary"
                />
                <span className="font-body-sm text-body-sm text-on-surface">10분 전 알림</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-primary-container shadow-sm transition-all"
              >
                일정 추가
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
