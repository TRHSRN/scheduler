import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const NewGoalModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, addGoal } = useApp();

  const [title, setTitle] = useState('');
  const [goalType, setGoalType] = useState<'count' | 'checklist' | 'time'>('count');
  const [total, setTotal] = useState<number>(10);
  const [category, setCategory] = useState('커리어/학습');

  if (!isGoalModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let icon = 'flag';
    let unit = '회';

    if (category.includes('커리어') || category.includes('학습')) {
      icon = 'school';
      unit = '개';
    } else if (category.includes('건강') || category.includes('운동')) {
      icon = 'directions_run';
      unit = '회';
    } else if (category.includes('독서')) {
      icon = 'menu_book';
      unit = '권';
    } else if (category.includes('재정')) {
      icon = 'savings';
      unit = '건';
    }

    const typeLabel =
      goalType === 'count'
        ? '횟수형 목표'
        : goalType === 'checklist'
        ? '체크리스트형'
        : '누적 시간형';

    addGoal({
      title: title.trim(),
      type: goalType,
      typeLabel,
      category,
      categoryIcon: icon,
      current: 0,
      total: Number(total) || 1,
      unit,
      description: `${category} 관련 5월 핵심 마일스톤 달성`,
      deadlineStr: '2025.05.31',
      milestones:
        goalType === 'checklist'
          ? [
              { id: `m-${Date.now()}-1`, title: '1. 준비 및 계획 수립', completed: false },
              { id: `m-${Date.now()}-2`, title: '2. 1차 핵심 실행 및 점검', completed: false },
              { id: `m-${Date.now()}-3`, title: '3. 최종 완료 및 회고', completed: false }
            ]
          : undefined
    });

    setTitle('');
    setIsGoalModalOpen(false);
  };

  const categories = ['커리어/학습', '건강/운동', '독서/취미', '재정/자산'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsGoalModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-container-high/60 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              새 월간 목표 수립
            </h3>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            onClick={() => setIsGoalModalOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium">
              목표 명칭 *
            </label>
            <input
              className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="예: 토익 850점 달성 및 실전 모의고사 10회 풀이"
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                목표 유형
              </label>
              <select
                className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md outline-none cursor-pointer"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value as 'count' | 'checklist' | 'time')}
              >
                <option value="count">횟수형 (Count)</option>
                <option value="checklist">체크리스트형 (Milestone)</option>
                <option value="time">누적 시간형 (Hours)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                목표 총량
              </label>
              <input
                className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md outline-none"
                min="1"
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium">
              카테고리
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              className="h-10 px-4 rounded-xl text-on-surface-variant hover:bg-surface-container font-body-md text-body-md font-semibold transition-colors"
              onClick={() => setIsGoalModalOpen(false)}
              type="button"
            >
              취소
            </button>
            <button
              className="h-10 px-5 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container shadow-sm transition-all cursor-pointer"
              type="submit"
            >
              목표 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
