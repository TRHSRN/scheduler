import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCategory, ScheduleEvent } from '../../types';

export const ScheduleView: React.FC = () => {
  const {
    events,
    openScheduleModal,
    openCreateModal,
    exportICS,
    showToast
  } = useApp();

  const [activeView, setActiveView] = useState<'day' | 'week' | 'month'>('week');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | EventCategory>('all');
  const [weekOffset, setWeekOffset] = useState(0);

  const filterChips: { id: 'all' | EventCategory; label: string; colorDot?: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'work', label: '업무', colorDot: 'bg-primary' },
    { id: 'meeting', label: '회의', colorDot: 'bg-primary-container' },
    { id: 'personal', label: '개인', colorDot: 'bg-tertiary-container' },
    { id: 'study', label: '학습/QA', colorDot: 'bg-secondary' },
    { id: 'health', label: '운동', colorDot: 'bg-tertiary' }
  ];

  const filteredEvents = events.filter((e) => {
    if (activeCategoryFilter === 'all') return true;
    return e.category === activeCategoryFilter;
  });

  const getEventsForDay = (day: number) => {
    return filteredEvents.filter((e) => e.day === day);
  };

  const daysHeader = [
    { day: 19, name: '월', isToday: true, count: getEventsForDay(19).length },
    { day: 20, name: '화', isToday: false, count: getEventsForDay(20).length },
    { day: 21, name: '수', isToday: false, count: getEventsForDay(21).length },
    { day: 22, name: '목', isToday: false, count: getEventsForDay(22).length },
    { day: 23, name: '금', isToday: false, count: getEventsForDay(23).length },
    { day: 24, name: '토', isToday: false, count: getEventsForDay(24).length },
    { day: 25, name: '일', isToday: false, count: getEventsForDay(25).length }
  ];

  const getColorClass = (color: string, isOngoing?: boolean) => {
    if (isOngoing) {
      return 'bg-error-container/50 hover:bg-error-container/70 border border-error/30 ring-1 ring-error/40';
    }
    switch (color) {
      case 'primary':
        return 'bg-primary-fixed/60 hover:bg-primary-fixed border border-primary/20';
      case 'primary-container':
        return 'bg-surface-container-high hover:bg-surface-container-highest border border-primary-container/20';
      case 'secondary':
        return 'bg-secondary-container/40 hover:bg-secondary-container/60 border border-secondary/20';
      case 'tertiary':
        return 'bg-tertiary-fixed/50 hover:bg-tertiary-fixed/70 border border-tertiary/20';
      case 'error':
        return 'bg-error-container/40 hover:bg-error-container/60 border border-error/20';
      default:
        return 'bg-surface-container-high hover:bg-surface-container-highest';
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Schedule Navigation & Action Bar */}
      <section className="w-full px-6 lg:px-8 py-5 flex flex-col gap-4 bg-surface-container-lowest shadow-sm z-30 border-b border-surface-container-high/40">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1720px] mx-auto w-full">
          {/* Left: Week Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container-low rounded-xl p-1 shadow-sm">
              <button
                aria-label="이전 주"
                onClick={() => {
                  setWeekOffset((prev) => prev - 1);
                  showToast('이전 주차 스케줄을 조회합니다.');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                onClick={() => {
                  setWeekOffset(0);
                  showToast('이번 주 (5월 3주차)로 이동했습니다.');
                }}
                className="px-3 h-8 rounded-lg font-body-sm text-body-sm font-semibold text-primary hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
                type="button"
              >
                오늘
              </button>
              <button
                aria-label="다음 주"
                onClick={() => {
                  setWeekOffset((prev) => prev + 1);
                  showToast('다음 주차 스케줄을 조회합니다.');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2.5 ml-2">
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                2025년 5월 3주차
              </h1>
              <span className="font-label-md text-label-md text-on-surface-variant tracking-normal font-medium bg-surface-container-low px-2.5 py-1 rounded-md">
                5월 19일 — 5월 25일
              </span>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div
            className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-inner"
            role="tablist"
          >
            <button
              onClick={() => {
                setActiveView('day');
                showToast('일간 타임블록 뷰로 전환되었습니다.');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-body-md text-body-md transition-all cursor-pointer ${
                activeView === 'day'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              일간
            </button>
            <button
              onClick={() => setActiveView('week')}
              className={`px-4 py-1.5 rounded-lg font-body-md text-body-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'week'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              <span>주간</span>
            </button>
            <button
              onClick={() => {
                setActiveView('month');
                showToast('월간 캘린더 뷰로 전환되었습니다.');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-body-md text-body-md transition-all cursor-pointer ${
                activeView === 'month'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              월간
            </button>
          </div>

          {/* Right: Category Filters & Add Action */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 bg-surface-container-low/70 px-2 py-1 rounded-lg">
              {filterChips.map((chip) => {
                const isActive = activeCategoryFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveCategoryFilter(chip.id)}
                    className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium'
                    }`}
                    type="button"
                  >
                    {chip.colorDot && (
                      <span className={`w-2 h-2 rounded-full ${chip.colorDot}`}></span>
                    )}
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => openCreateModal('event')}
              className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold inline-flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>새 일정 추가</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Timetable Workstation Wrapper */}
      <div className="relative w-full px-6 lg:px-8 py-4 overflow-hidden max-w-[1720px] mx-auto">
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-surface-container-high/40">
          {/* Sticky Top Date Header Row */}
          <div className="w-full flex bg-surface-container-low shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-20">
            {/* Time Axis Corner */}
            <div className="w-16 sm:w-20 shrink-0 py-3.5 px-2 flex flex-col items-center justify-center bg-surface-container/60 border-r border-surface-container-high/60">
              <span className="font-label-sm text-label-sm font-semibold text-outline tracking-wider">
                GMT+9
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant/70">시간</span>
            </div>

            {/* 7 Days Columns Headers */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-surface-container-high/40">
              {daysHeader.map((d) => (
                <div
                  key={d.day}
                  onClick={() => openCreateModal('event')}
                  className={`py-3 px-2 flex flex-col items-center justify-center relative cursor-pointer ${
                    d.isToday
                      ? 'bg-primary-fixed/30'
                      : 'hover:bg-surface-container-lowest/70 transition-colors'
                  }`}
                  title={`${d.day}일에 일정 추가`}
                >
                  <span
                    className={`font-label-sm text-label-sm tracking-wider uppercase ${
                      d.isToday ? 'font-bold text-primary' : 'font-semibold text-on-surface-variant'
                    }`}
                  >
                    {d.name}
                  </span>

                  <div
                    className={`w-8 h-8 my-0.5 rounded-full flex items-center justify-center font-headline-md text-body-lg font-bold ${
                      d.isToday
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface'
                    }`}
                  >
                    {d.day}
                  </div>

                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full mt-0.5 ${
                      d.isToday
                        ? 'text-primary font-medium bg-primary-fixed-dim/40'
                        : 'text-outline font-normal bg-surface-container'
                    }`}
                  >
                    일정 {d.count}개
                  </span>

                  {d.isToday && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Grid Body (08:00 - 22:00 = 14 hours x 64px = 896px height) */}
          <div className="relative w-full overflow-y-auto max-h-[760px] flex">
            {/* Left Time Axis */}
            <div className="w-16 sm:w-20 shrink-0 bg-surface-container-lowest flex flex-col select-none z-10 border-r border-surface-container-high/50">
              {Array.from({ length: 14 }).map((_, idx) => {
                const hour = 8 + idx;
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <div key={idx} className="h-16 flex items-start justify-center pt-1.5">
                    <span className="font-label-sm text-label-sm font-semibold text-outline">
                      {hourStr}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timetable Canvas (7 Columns) */}
            <div className="relative flex-1 h-[896px] grid grid-cols-7 bg-surface-container-lowest divide-x divide-surface-container-high/30">
              {/* Background Horizontal Guide Lines (repeated every 64px) */}
              <div className="absolute inset-0 pointer-events-none flex flex-col">
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-16 w-full flex flex-col justify-between ${
                      idx % 2 === 0 ? 'bg-surface-container-low/20' : ''
                    }`}
                  >
                    <div className="h-px bg-surface-container-high/60 w-full"></div>
                    <div className="h-px bg-surface-container-high/25 w-full"></div>
                  </div>
                ))}
              </div>

              {/* Current Time Needle Indicator: 14:25 PM -> ~411px */}
              <div className="absolute left-0 right-0 top-[411px] z-30 pointer-events-none flex items-center">
                <div className="flex items-center -ml-16 sm:-ml-20">
                  <span className="bg-error text-on-error font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full shadow-sm">
                    14:25
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-error -mr-1.5 shadow-sm"></span>
                </div>
                <div className="flex-1 h-[2px] bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)]"></div>
              </div>

              {/* 7 Columns for Days 19 to 25 */}
              {daysHeader.map((d) => {
                const dayEvts = getEventsForDay(d.day);
                return (
                  <div key={d.day} className="relative h-full p-1.5 group/col">
                    {/* Render Events */}
                    {dayEvts.map((evt) => {
                      const colorStyle = getColorClass(evt.color, evt.isOngoing);
                      const isSplit = evt.widthPercent !== undefined;

                      return (
                        <div
                          key={evt.id}
                          onClick={() => openScheduleModal(evt)}
                          className={`schedule-card absolute rounded-xl p-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden ${colorStyle}`}
                          style={{
                            top: `${evt.topPx}px`,
                            height: `${evt.heightPx}px`,
                            left: isSplit ? `${evt.leftPercent}%` : '6px',
                            right: isSplit ? undefined : '6px',
                            width: isSplit ? `${evt.widthPercent}%` : undefined
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  evt.isOngoing ? 'bg-error animate-ping' : 'bg-primary'
                                }`}
                              ></span>
                              <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
                                {evt.title}
                              </p>
                            </div>
                            {evt.isOngoing && (
                              <span className="font-label-sm text-label-sm bg-error text-on-error px-1.5 py-0.5 rounded font-bold shrink-0">
                                진행중
                              </span>
                            )}
                          </div>

                          {evt.memo && evt.heightPx >= 120 && (
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                              {evt.memo}
                            </p>
                          )}

                          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                            <span className="truncate flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">location_on</span>
                              {evt.location}
                            </span>
                            <span
                              className={`font-medium ${
                                evt.isOngoing ? 'text-error font-bold' : 'text-primary'
                              }`}
                            >
                              {evt.startTime} - {evt.endTime}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Slot Add on Empty Area */}
                    <button
                      onClick={() => openCreateModal('event')}
                      className="absolute left-2 right-2 bottom-6 h-12 rounded-xl border border-dashed border-outline-variant/40 hover:border-primary/60 hover:bg-primary/5 flex items-center justify-center gap-1.5 text-outline hover:text-primary transition-all opacity-0 hover:opacity-100 group-hover/col:opacity-40 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span className="font-label-sm text-label-sm">{d.day}일 슬롯 추가</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Micro Insight Velocity Bar Below Timetable */}
      <section className="w-full px-6 lg:px-8 py-3 mb-6 max-w-[1720px] mx-auto">
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 border border-surface-container-high/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">donut_large</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                이번 주 집중 몰입 통계
              </p>
              <p className="font-title-md text-title-md text-on-surface font-bold">
                {events.length > 0 ? (
                  <>
                    계획된 몰입 시간:{' '}
                    {(
                      events.reduce((acc, ev) => {
                        const [sH, sM] = ev.startTime.split(':').map(Number);
                        const [eH, eM] = ev.endTime.split(':').map(Number);
                        const dur = eH + (eM || 0) / 60 - (sH + (sM || 0) / 60);
                        return acc + Math.max(0, dur);
                      }, 0)
                    ).toFixed(1)}
                    시간{' '}
                    <span className="font-body-sm text-body-sm font-normal text-secondary ml-1.5">
                      목표 대비 순항 중
                    </span>
                  </>
                ) : (
                  <>
                    계획된 몰입 시간: 0시간{' '}
                    <span className="font-body-sm text-body-sm font-normal text-outline ml-1.5">
                      일정을 등록하여 주간 타임블록을 계획해보세요
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Linear Distribution Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1.5">
              <span>
                업무 {events.filter((e) => e.category === 'work').length}건
              </span>
              <span>
                회의 {events.filter((e) => e.category === 'meeting').length}건
              </span>
              <span>
                학습 {events.filter((e) => e.category === 'study').length}건
              </span>
              <span>
                개인/운동 {events.filter((e) => e.category === 'personal' || e.category === 'health').length}건
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden flex">
              {events.length > 0 ? (
                <>
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(events.filter((e) => e.category === 'work').length / events.length) * 100}%`
                    }}
                  ></div>
                  <div
                    className="h-full bg-primary-container"
                    style={{
                      width: `${(events.filter((e) => e.category === 'meeting').length / events.length) * 100}%`
                    }}
                  ></div>
                  <div
                    className="h-full bg-secondary"
                    style={{
                      width: `${(events.filter((e) => e.category === 'study').length / events.length) * 100}%`
                    }}
                  ></div>
                  <div
                    className="h-full bg-tertiary-container"
                    style={{
                      width: `${(events.filter((e) => e.category === 'personal' || e.category === 'health').length / events.length) * 100}%`
                    }}
                  ></div>
                </>
              ) : (
                <div className="h-full bg-surface-container-high w-full"></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportICS}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>캘린더 내보내기</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
