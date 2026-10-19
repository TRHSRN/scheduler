import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EventColor } from '../types';

export const ScheduleDetailDrawer: React.FC = () => {
  const {
    isScheduleModalOpen,
    closeScheduleModal,
    selectedScheduleEvent,
    updateEvent,
    deleteEvent
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState<EventColor>('primary');
  const [memo, setMemo] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [notification, setNotification] = useState(true);

  useEffect(() => {
    if (selectedScheduleEvent) {
      setTitle(selectedScheduleEvent.title);
      setStartTime(selectedScheduleEvent.startTime);
      setEndTime(selectedScheduleEvent.endTime);
      setLocation(selectedScheduleEvent.location);
      setColor(selectedScheduleEvent.color);
      setMemo(selectedScheduleEvent.memo || '');
      setRepeatWeekly(!!selectedScheduleEvent.repeatWeekly);
      setNotification(selectedScheduleEvent.notification !== false);
      setIsEditing(false);
    }
  }, [selectedScheduleEvent]);

  if (!isScheduleModalOpen || !selectedScheduleEvent) return null;

  const handleSave = () => {
    updateEvent(selectedScheduleEvent.id, {
      title,
      startTime,
      endTime,
      location,
      color,
      memo,
      repeatWeekly,
      notification
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`'${selectedScheduleEvent.title}' 일정을 삭제하시겠습니까?`)) {
      deleteEvent(selectedScheduleEvent.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-on-surface/30 backdrop-blur-sm transition-opacity duration-200">
      {/* Click outside backdrop closer */}
      <div className="absolute inset-0" onClick={closeScheduleModal}></div>

      {/* Drawer Content Window */}
      <div className="relative w-full max-w-md h-full bg-surface-container-lowest shadow-2xl flex flex-col p-6 overflow-y-auto z-10 animate-in slide-in-from-right duration-200 border-l border-surface-container-high/40">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                selectedScheduleEvent.isOngoing ? 'bg-error animate-pulse' : 'bg-primary'
              }`}
            ></span>
            <span
              className={`font-label-sm text-label-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedScheduleEvent.isOngoing
                  ? 'text-error bg-error-container/60'
                  : 'text-primary bg-primary-fixed'
              }`}
            >
              {selectedScheduleEvent.categoryLabel} • {selectedScheduleEvent.isOngoing ? '진행중' : '예정됨'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="일정 수정"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isEditing
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              onClick={() => setIsEditing(!isEditing)}
              type="button"
              title={isEditing ? '보기 모드' : '수정 모드'}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              aria-label="일정 삭제"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container/40 transition-colors cursor-pointer"
              onClick={handleDelete}
              type="button"
              title="일정 삭제"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
            <button
              aria-label="닫기"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ml-1 cursor-pointer"
              onClick={closeScheduleModal}
              type="button"
              title="닫기"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="py-5 flex flex-col gap-5 flex-1">
          {/* Title & Status */}
          <div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              일정 제목
            </span>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low font-headline-md text-headline-md font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                {title}
              </h2>
            )}
          </div>

          {/* Time & Duration Pill */}
          <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                시간 및 소요
              </span>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-2 py-1 bg-surface-container-lowest rounded-lg font-label-md text-xs"
                  />
                  <span>~</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-2 py-1 bg-surface-container-lowest rounded-lg font-label-md text-xs"
                  />
                </div>
              ) : (
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {startTime} - {endTime}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">location_on</span>
            <div className="flex flex-col flex-1">
              <span className="font-label-sm text-label-sm text-outline">장소</span>
              {isEditing ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none"
                />
              ) : (
                <span className="font-body-md text-body-md font-medium text-on-surface">
                  {location}
                </span>
              )}
            </div>
          </div>

          {/* Category Swatches Selector */}
          <div>
            <label className="font-label-sm text-label-sm text-outline block mb-2">
              카테고리 색상
            </label>
            <div className="flex items-center gap-3">
              <button
                aria-label="Primary"
                onClick={() => setColor('primary')}
                className={`w-7 h-7 rounded-full bg-primary transition-all cursor-pointer ${
                  color === 'primary' ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                }`}
                type="button"
              ></button>
              <button
                aria-label="Primary Container"
                onClick={() => setColor('primary-container')}
                className={`w-7 h-7 rounded-full bg-primary-container transition-all cursor-pointer ${
                  color === 'primary-container'
                    ? 'ring-2 ring-offset-2 ring-primary-container scale-110'
                    : ''
                }`}
                type="button"
              ></button>
              <button
                aria-label="Secondary"
                onClick={() => setColor('secondary')}
                className={`w-7 h-7 rounded-full bg-secondary transition-all cursor-pointer ${
                  color === 'secondary' ? 'ring-2 ring-offset-2 ring-secondary scale-110' : ''
                }`}
                type="button"
              ></button>
              <button
                aria-label="Tertiary"
                onClick={() => setColor('tertiary')}
                className={`w-7 h-7 rounded-full bg-tertiary-container transition-all cursor-pointer ${
                  color === 'tertiary' ? 'ring-2 ring-offset-2 ring-tertiary-container scale-110' : ''
                }`}
                type="button"
              ></button>
              <button
                aria-label="Error"
                onClick={() => setColor('error')}
                className={`w-7 h-7 rounded-full bg-error transition-all cursor-pointer ${
                  color === 'error' ? 'ring-2 ring-offset-2 ring-error scale-110' : ''
                }`}
                type="button"
              ></button>
            </div>
          </div>

          {/* Memo & Agenda Description */}
          <div>
            <label className="font-label-sm text-label-sm text-outline block mb-1.5">
              상세 메모 & 아젠다
            </label>
            {isEditing ? (
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                className="w-full p-3.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            ) : (
              <div className="w-full p-3.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface leading-relaxed min-h-[90px]">
                {memo || '등록된 메모가 없습니다.'}
              </div>
            )}
          </div>

          {/* Repeat & Notification Toggles */}
          <div className="flex flex-col gap-2.5 pt-2">
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low/50 cursor-pointer"
              onClick={() => setRepeatWeekly(!repeatWeekly)}
            >
              <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">repeat</span>
                <span>매주 {selectedScheduleEvent.dayName}요일 반복</span>
              </div>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  repeatWeekly ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                    repeatWeekly ? 'right-0.5' : 'left-0.5'
                  }`}
                ></div>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low/50 cursor-pointer"
              onClick={() => setNotification(!notification)}
            >
              <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">
                  notifications_active
                </span>
                <span>10분 전 알림</span>
              </div>
              <span
                className={`font-label-sm text-label-sm font-semibold ${
                  notification ? 'text-primary' : 'text-outline'
                }`}
              >
                {notification ? '켜짐' : '꺼짐'}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-surface-container-high/40 flex items-center justify-end gap-2.5">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-body-md font-medium transition-colors cursor-pointer"
            onClick={closeScheduleModal}
            type="button"
          >
            닫기
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold transition-all shadow-sm cursor-pointer"
            onClick={() => {
              if (isEditing) {
                handleSave();
              }
              closeScheduleModal();
            }}
            type="button"
          >
            {isEditing ? '저장하기' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};
