import React from 'react';
import { useApp } from '../context/AppContext';

export const DatePickerModal: React.FC = () => {
  const { isDatePickerOpen, setIsDatePickerOpen, setActiveTab, showToast } = useApp();

  if (!isDatePickerOpen) return null;

  const daysInMay = [
    { date: 15, day: '목', tasks: 6, hasEvents: true },
    { date: 16, day: '금', tasks: 7, hasEvents: true },
    { date: 17, day: '토', tasks: 3, hasEvents: false },
    { date: 18, day: '일', tasks: 2, hasEvents: false },
    { date: 19, day: '월', tasks: 8, hasEvents: true, isToday: true },
    { date: 20, day: '화', tasks: 10, hasEvents: true },
    { date: 21, day: '수', tasks: 8, hasEvents: true },
    { date: 22, day: '목', tasks: 6, hasEvents: true },
    { date: 23, day: '금', tasks: 7, hasEvents: true },
    { date: 24, day: '토', tasks: 3, hasEvents: true },
    { date: 25, day: '일', tasks: 1, hasEvents: true }
  ];

  const handleSelectDay = (day: number) => {
    setIsDatePickerOpen(false);
    showToast(`2025년 5월 ${day}일 일정으로 이동했습니다.`);
    setActiveTab('schedule');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsDatePickerOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container-high/60 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">2025년 5월</h3>
          </div>
          <button
            onClick={() => setIsDatePickerOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {daysInMay.map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => handleSelectDay(item.date)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-between transition-all cursor-pointer ${
                item.isToday
                  ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/40'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <span
                className={`font-label-sm text-[10px] ${
                  item.isToday ? 'text-on-primary/80 font-bold' : 'text-outline'
                }`}
              >
                {item.day}
              </span>
              <span className="font-headline-md text-lg font-bold my-0.5">{item.date}</span>
              <span
                className={`font-label-sm text-[9px] px-1.5 py-0.2 rounded-full ${
                  item.isToday
                    ? 'bg-on-primary/20 text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {item.tasks}개
              </span>
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleSelectDay(19)}
            className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-body-sm font-semibold transition-colors"
            type="button"
          >
            오늘 (5월 19일)로 바로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
