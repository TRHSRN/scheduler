import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DAY_ANALYTICS_DATA } from '../../data/initialData';

export const GoalsAndStatsView: React.FC = () => {
  const {
    tasks,
    goals,
    incrementGoal,
    toggleMilestone,
    setIsGoalModalOpen,
    setActiveTab,
    exportJSON,
    importJSON,
    showToast
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<'2025-05' | '2025-04'>('2025-05');
  const [selectedDayKey, setSelectedDayKey] = useState<string>('mon');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const weeklyCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.current / g.total) * 100, 0) / goals.length)
    : 0;

  const selectedDayInfo = DAY_ANALYTICS_DATA[selectedDayKey] || DAY_ANALYTICS_DATA['mon'];

  const handleExportDailyReport = () => {
    const report = `[Dayflow 일일 리포트 - ${selectedDayInfo.dateFull}]
- 달성률: ${selectedDayInfo.completionRate}% (${selectedDayInfo.completedTasks}/${selectedDayInfo.totalTasks} 완료)
- 집중 몰입 시간: ${selectedDayInfo.focusTime}
- 주요 카테고리: ${selectedDayInfo.categories.map((c) => `${c.name} ${c.count}`).join(', ')}
- 요약: ${selectedDayInfo.desc}`;

    navigator.clipboard?.writeText(report);
    showToast(`${selectedDayInfo.dateFull} 일일 리포트가 클립보드에 복사되었습니다!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importJSON(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1560px] mx-auto w-full flex flex-col gap-8">
      {/* Screen Sub-Header & Period Navigator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
              P0 Analytics Canvas
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">/</span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              실시간 연동 활성화
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            2025년 5월 성과 분석 & 목표 관리
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            주간 투두 완수 지표와 월간 중점 목표 진행률을 통합 추적하여 루틴의 연속성을 극대화합니다.
          </p>
        </div>

        {/* Action Cluster: View Switcher & Quick Add */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setSelectedMonth('2025-05')}
              className={`px-3.5 py-1.5 rounded-lg font-body-md text-body-md font-semibold transition-all cursor-pointer ${
                selectedMonth === '2025-05'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              2025년 5월
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2025-04');
                showToast('2025년 4월 아카이브 데이터는 읽기 전용으로 로드됩니다.');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-body-md text-body-md transition-all cursor-pointer ${
                selectedMonth === '2025-04'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              2025년 4월
            </button>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-[40px] px-4 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>새 월간 목표 추가</span>
          </button>
        </div>
      </div>

      {/* 1. Top Summary Banner (4 KPI Metric Tiles) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container-high/40">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant tracking-wide font-medium">
              이번 주 총 완료율
            </span>
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                {weeklyCompletionRate}%
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-md">
                {weeklyCompletionRate > 0 ? `+${weeklyCompletionRate}%p` : '기록 시작'}
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant mt-1">
              <span>{completedTasks}개 완료됨</span>
              <span className="font-label-sm text-label-sm">총 {totalTasks}개 중</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${weeklyCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container-high/40">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant tracking-wide font-medium">
              일평균 몰입 완료
            </span>
            <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                {totalTasks > 0 ? (completedTasks / 7).toFixed(1) : '0.0'}
              </span>
              <span className="font-title-md text-title-md text-on-surface-variant font-medium">
                개 투두 / 일
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant mt-1">
              <span>{completedTasks > 0 ? '집중 세션 기여 중' : '기록 대기 중'}</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                {completedTasks > 0 ? '생산성 활성화' : '새 일과 시작'}
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(weeklyCompletionRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container-high/40">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-tertiary-fixed-dim/20 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant tracking-wide font-medium">
              연속 달성 스트릭
            </span>
            <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl text-tertiary-container font-extrabold tracking-tight">
                {completedTasks > 0 ? 1 : 0}
              </span>
              <span className="font-title-md text-title-md text-tertiary-container font-bold">
                일 연속
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant mt-1">
              <span>{completedTasks > 0 ? '스트릭 진행 중' : '첫 투두를 완료해보세요'}</span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                오늘의 도전
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`h-2 flex-1 rounded-full ${completedTasks > 0 ? 'bg-tertiary-container' : 'bg-surface-container-high'}`}></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
              <span className="h-2 flex-1 rounded-full bg-surface-container-high"></span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container-high/40">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary-container/10 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant tracking-wide font-medium">
              활성 월간 목표
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                {goals.length}
              </span>
              <span className="font-title-md text-title-md text-on-surface-variant font-medium">
                개 목표 등록됨
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant mt-1">
              <span>{goals.length > 0 ? `${goals.filter((g) => g.current / g.total >= 0.75).length}개 순항 중` : '목표를 추가해보세요'}</span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                평균 진행도 {avgGoalProgress}%
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${avgGoalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 주간 투두 달성 통계 (Weekly Todo Analytics) */}
      <section className="rounded-3xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm flex flex-col gap-8 border border-surface-container-high/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                주간 투두 달성 통계
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              요일별 완료 현황 및 달성률 비교 (월요일 - 일요일 · 2025.05.19 ~ 05.25)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-primary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">완료된 투두</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-surface-container-high"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">미달성 / 총 할일</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-secondary-fixed"></span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                최고 달성일
              </span>
            </div>
          </div>
        </div>

        {/* Visual Modern Bar Chart */}
        <div className="bg-surface-container-low/60 rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
          <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-64 sm:h-72 w-full pt-8">
            {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((key, idx) => {
              const item = DAY_ANALYTICS_DATA[key];
              const isSelected = selectedDayKey === key;
              const dayNumber = 19 + idx;
              const rate = key === 'mon' && totalTasks > 0 ? weeklyCompletionRate : item.completionRate;
              const compCount = key === 'mon' && totalTasks > 0 ? completedTasks : item.completedTasks;
              const totCount = key === 'mon' && totalTasks > 0 ? totalTasks : item.totalTasks;
              const isMvp = Boolean(item.isMvp && rate > 0);

              return (
                <div
                  key={key}
                  className={`flex flex-col items-center h-full justify-end relative group cursor-pointer transition-all ${
                    isSelected ? 'scale-105' : ''
                  }`}
                  onClick={() => setSelectedDayKey(key)}
                >
                  {isMvp && (
                    <div className="absolute -top-3 z-10 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-sm flex items-center gap-1 animate-bounce">
                      <span className="material-symbols-outlined text-[13px]">stars</span>
                      <span>최고 달성</span>
                    </div>
                  )}

                  <div className="text-center mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className={`font-label-sm text-label-sm font-bold ${rate > 0 ? (isMvp ? 'text-secondary font-extrabold' : 'text-primary') : 'text-outline'}`}>
                      {rate}%
                    </span>
                    <span className="block font-label-sm text-[10px] text-on-surface-variant">
                      {totCount > 0 ? `${compCount}/${totCount}개` : '0/0개'}
                    </span>
                  </div>

                  <div className="w-full max-w-[54px] bg-surface-container-high rounded-xl overflow-hidden flex flex-col justify-end h-full p-1 group-hover:shadow-md transition-all">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        rate > 0
                          ? isMvp
                            ? 'bg-secondary'
                            : 'bg-primary'
                          : 'bg-outline-variant/20'
                      }`}
                      style={{ height: rate > 0 ? `${rate}%` : '4px' }}
                    ></div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className={`font-title-md text-title-md font-semibold block ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
                      {item.dayName}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {dayNumber}일
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Daily Breakdown Table (Clickable Rows) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                calendar_view_day
              </span>
              <span>일자별 투두 완수 내역 세부사항</span>
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              행을 클릭하면 하단 인라인 세부 항목이 전환됩니다
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high/40">
            <table className="w-full text-left font-body-md text-body-md">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                  <th className="py-3.5 px-4 font-semibold">일자 / 요일</th>
                  <th className="py-3.5 px-4 font-semibold">완료율</th>
                  <th className="py-3.5 px-4 font-semibold">완료 / 전체 수</th>
                  <th className="py-3.5 px-4 font-semibold">주요 완수 카테고리</th>
                  <th className="py-3.5 px-4 font-semibold">집중 몰입 시간</th>
                  <th className="py-3.5 px-4 text-right font-semibold">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {['mon', 'tue', 'wed', 'thu', 'fri'].map((key) => {
                  const item = DAY_ANALYTICS_DATA[key];
                  const isSelected = selectedDayKey === key;
                  return (
                    <tr
                      key={key}
                      onClick={() => setSelectedDayKey(key)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-secondary-container/15'
                          : 'hover:bg-surface-container-low/80'
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold text-on-surface flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isMvp
                              ? 'bg-secondary'
                              : key === 'fri'
                              ? 'bg-tertiary-container'
                              : 'bg-primary'
                          }`}
                        ></span>
                        <span>{item.dateFull}</span>
                        {item.isMvp && (
                          <span className="px-1.5 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-[10px] font-bold">
                            주간 MVP
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-4 px-4 font-label-md text-label-md font-bold ${
                          item.isMvp
                            ? 'text-secondary font-extrabold'
                            : key === 'fri'
                            ? 'text-tertiary'
                            : 'text-primary'
                        }`}
                      >
                        {item.completionRate}%
                      </td>
                      <td className="py-4 px-4 font-label-md text-label-md">
                        {item.completedTasks}개 / {item.totalTasks}개 완료
                      </td>
                      <td className="py-4 px-4">
                        {item.categories.map((c, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md font-label-sm text-label-sm font-semibold mr-1 ${
                              item.isMvp
                                ? 'bg-secondary/10 text-secondary'
                                : key === 'fri'
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-surface-container text-primary'
                            }`}
                          >
                            {c.name} {c.count}
                          </span>
                        ))}
                      </td>
                      <td className="py-4 px-4 font-label-md text-label-md text-on-surface-variant">
                        {item.focusTime}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${item.statusBadge}`}
                        >
                          {item.statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* In-context Detail Drawer Panel for Selected Day */}
        <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-container-high/40">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                selectedDayInfo.isMvp ? 'bg-secondary' : 'bg-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  {selectedDayInfo.dateFull} 투두 세부 분석
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
                    selectedDayInfo.isMvp
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  {selectedDayInfo.completionRate}% 달성
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {selectedDayInfo.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className="h-9 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer shadow-xs"
              type="button"
            >
              스케줄 원본 보기
            </button>
            <button
              onClick={handleExportDailyReport}
              className="h-9 px-3.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold shadow-sm hover:bg-primary-container transition-all cursor-pointer"
              type="button"
            >
              일일 리포트 내보내기
            </button>
          </div>
        </div>
      </section>

      {/* 3. 월간 목표 관리 (Monthly Goals - P0 Core Feature) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">flag_circle</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                월간 목표 관리 (P0 중점 과제)
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              주 단위 일상 투두와 직접 매핑되어 달성률이 자동 산출되는 2025년 5월 핵심 목표입니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full font-medium">
              {goals.length}개 중 {goals.filter((g) => g.current / g.total >= 0.75).length}개 목표 75% 도달
            </span>
          </div>
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {goals.length === 0 ? (
            <div className="lg:col-span-3 rounded-3xl bg-surface-container-lowest p-10 shadow-sm flex flex-col items-center justify-center text-center gap-4 border border-dashed border-surface-container-high/80">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">flag</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  등록된 월간 목표가 없습니다
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                  이번 달 달성하고 싶은 핵심 목표(도서 완독, 운동 횟수, 프로젝트 과제 등)를 수립해보세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>새 월간 목표 수립하기</span>
              </button>
            </div>
          ) : (
            goals.map((goal, idx) => {
            const pct = Math.round((goal.current / goal.total) * 100);
            const isFirst = idx === 0;
            const isSecond = idx === 1;

            return (
              <div
                key={goal.id}
                className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container-high/40"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wide ${
                        isFirst
                          ? 'bg-primary/10 text-primary'
                          : isSecond
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-primary-container text-on-primary-container'
                      }`}
                    >
                      {goal.typeLabel}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-label-md text-label-md font-bold ${
                        isFirst ? 'text-primary' : isSecond ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {goal.categoryIcon || 'flag'}
                      </span>
                      <span>{goal.category}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold group-hover:text-primary transition-colors">
                      {goal.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {goal.description}
                    </p>
                  </div>

                  {/* Visual Progress & Metric */}
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          현재 진척도
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                            {goal.current}
                          </span>
                          <span className="font-title-md text-title-md text-on-surface-variant">
                            / {goal.total} {goal.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-headline-md text-headline-md font-bold ${
                            isFirst ? 'text-primary' : isSecond ? 'text-secondary' : 'text-primary'
                          }`}
                        >
                          {pct}%
                        </span>
                        <span className="block font-label-sm text-label-sm text-secondary font-semibold">
                          {goal.total - goal.current > 0
                            ? `남은 분량 ${goal.total - goal.current} ${goal.unit}`
                            : '100% 달성 완료!'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFirst ? 'bg-primary' : isSecond ? 'bg-secondary' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Milestone Tracker or Recent Log */}
                  {goal.weeklyMilestones && (
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {goal.weeklyMilestones.map((wm, mi) => (
                        <div
                          key={mi}
                          className={`text-center py-1 rounded-lg font-label-sm text-label-sm font-bold ${
                            wm.completed
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-surface-container-high text-on-surface-variant font-semibold'
                          }`}
                        >
                          {wm.week} ({wm.count})
                        </div>
                      ))}
                    </div>
                  )}

                  {goal.recentLog && !goal.weeklyMilestones && (
                    <div className="rounded-xl bg-surface-container-lowest p-3 shadow-xs flex items-start gap-2.5 border border-surface-container-high/30">
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          최근 완료 기록
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium line-clamp-1">
                          {goal.recentLog}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Interactive Milestones Checklist for Goal 3 */}
                  {goal.milestones && (
                    <div className="flex flex-col gap-2">
                      {goal.milestones.map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                            m.completed
                              ? 'bg-surface-container-lowest hover:bg-surface-container-low'
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => toggleMilestone(goal.id, m.id)}
                            className="w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                          />
                          <span
                            className={`font-body-sm text-body-sm ${
                              m.completed
                                ? 'line-through opacity-70 text-on-surface'
                                : 'font-semibold text-on-surface'
                            }`}
                          >
                            {m.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action / Meta */}
                <div className="mt-6 pt-4 border-t border-surface-container-high/40 flex items-center justify-between">
                  {goal.type === 'count' ? (
                    <>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        기록 갱신
                      </span>
                      <button
                        onClick={() => incrementGoal(goal.id)}
                        className={`h-9 px-4 rounded-xl font-body-sm text-body-sm font-semibold active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          isFirst
                            ? 'bg-primary text-on-primary hover:bg-primary-container'
                            : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>{isFirst ? '진행량 +1 권 추가' : '운동 +1 회 기록'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        마감 목표일: {goal.deadlineStr || '2025.05.31'}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-semibold">
                        순조로운 진행 중
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        </div>
      </section>

      {/* 4. Bottom Grid: Visual Motivation Showcase & LocalStorage Data Engine Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Visual Focus Ambient Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden border border-surface-container-high/40">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                workspace_premium
              </span>
              <h3 className="font-title-md text-title-md text-on-surface font-bold">
                주간 몰입 하이라이트
              </h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl leading-relaxed">
              이번 주는 오전 9시부터 11시 30분 사이의 &apos;딥 워크 윈도우&apos; 달성률이 94%로 가장
              높았습니다. 불필요한 알림 차단과 사전 계획된 캘린더 블록이 성과 향상에 주도적인 역할을
              했습니다.
            </p>

            {/* Focus Stats Inline Tags */}
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <div className="px-3 py-1.5 rounded-xl bg-surface-container-low flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  총 딥워크: <strong className="text-primary font-bold">28.5 시간</strong>
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-surface-container-low flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  verified_user
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  완료 집중도: <strong className="text-secondary font-bold">상위 3%</strong>
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-surface-container-low flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-container text-[18px]">
                  bolt
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  작업 전환 손실율: <strong className="text-tertiary font-bold">-18% 감소</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-surface-container-high/40 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>차주 목표 추천: 화/목 오전 세션 유지 & 금요일 마감 루틴 조기 배분</span>
            <button
              onClick={() => {
                showToast('주간 회고 템플릿이 퀵 메모에 준비되었습니다.');
                setActiveTab('dashboard');
              }}
              className="text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span>주간 회고 작성하기</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* LocalStorage & Data Export/Import Quick Guide Card (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-container-high/40 p-6 lg:p-8 shadow-sm flex flex-col justify-between border border-surface-container-high/40">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">database</span>
                </span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  로컬 스토리지 & 데이터 동기화
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
                클라우드 암호화 연동
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              모든 완료 통계와 목표 진척도는 안전하게 브라우저 로컬 저장소와 동기화됩니다. 다른
              디바이스로 마이그레이션하거나 JSON 스냅샷으로 백업할 수 있습니다.
            </p>

            <div className="bg-surface-container-lowest p-3.5 rounded-2xl flex flex-col gap-1.5 mt-1 border border-surface-container-high/30">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">로컬 저장소 상태</span>
                <span className="text-secondary font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% 정상 (18.4 KB)
                </span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">마지막 데이터 백업</span>
                <span className="text-on-surface font-medium">오늘 10:42 AM</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={exportJSON}
              className="h-10 px-4 rounded-xl bg-surface-container-lowest text-primary font-body-sm text-body-sm font-semibold shadow-sm hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>JSON 내보내기</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-4 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              <span>데이터 복원/가져오기</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
