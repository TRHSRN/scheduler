import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isDarkMode,
    toggleDarkMode,
    userName,
    setUserName,
    resetToDefaults,
    exportJSON,
    importJSON,
    showToast
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      setUserName(editingName.trim());
      setIsEditing(false);
      showToast(`사용자 이름이 '${editingName.trim()}'(으)로 변경되었습니다.`);
    }
  };

  const avatarChar = userName.replace(/[^a-zA-Z가-힣0-9]/g, '').charAt(0) || '유';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsSettingsModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container-high/60 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              환경설정 & 데이터 관리
            </h3>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-5 text-body-sm text-on-surface-variant max-h-[65vh] overflow-y-auto pr-1">
          {/* User profile section */}
          <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold shrink-0">
                  {avatarChar}
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold truncate">
                    {userName}
                  </h4>
                  <p className="font-label-sm text-label-sm text-outline">
                    로컬 사용자 (별도 로그인 불필요)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingName(userName);
                  setIsEditing(!isEditing);
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-xs font-semibold hover:bg-surface-container transition-all cursor-pointer shadow-xs shrink-0"
              >
                {isEditing ? '닫기' : '이름 바꾸기'}
              </button>
            </div>

            {isEditing && (
              <form onSubmit={handleNameSave} className="flex items-center gap-2 pt-2 border-t border-surface-container-high/40">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="새로운 이름 입력 (기본: 유저님!)"
                  className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border border-surface-container-high"
                  autoFocus
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                >
                  저장
                </button>
              </form>
            )}

            <div className="flex items-center gap-2 pt-1 text-[11px] text-outline">
              <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
              <span>데이터는 외부 로그인 없이 브라우저 로컬 저장소에 보관됩니다.</span>
            </div>
          </div>

          {/* Theme setting */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">palette</span>
              <div>
                <p className="font-title-md text-sm text-on-surface font-semibold">테마 스타일</p>
                <p className="font-label-sm text-xs text-outline">라이트 / 다크 인터페이스</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-xs font-semibold shadow-xs hover:bg-surface-container transition-all cursor-pointer"
              type="button"
            >
              {isDarkMode ? '다크 모드 적용 중' : '라이트 모드 적용 중'}
            </button>
          </div>

          {/* Deep Work Window Setting */}
          <div className="p-3.5 rounded-xl bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                <div>
                  <p className="font-title-md text-sm text-on-surface font-semibold">딥워크 포커스 윈도우</p>
                  <p className="font-label-sm text-xs text-outline">방해 금지 및 자동 알림 음소거</p>
                </div>
              </div>
              <span className="font-label-sm text-secondary font-bold">09:00 - 11:30</span>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="p-4 rounded-2xl bg-surface-container-low space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-sm text-on-surface font-semibold">
                로컬 데이터 백업 및 복원
              </span>
              <span className="font-label-sm text-[10px] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                클라우드 비의존 독립 구동
              </span>
            </div>
            <p className="font-body-sm text-xs text-outline">
              현재 저장된 할 일, 스케줄 타임블록, 월간 목표, 퀵 메모 데이터를 JSON 파일로 내보내거나 백업 파일을 불러옵니다.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={exportJSON}
                className="h-9 px-3 rounded-lg bg-surface-container-lowest text-primary font-body-sm text-xs font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>JSON 내보내기</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-3 rounded-lg bg-primary text-on-primary font-body-sm text-xs font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>백업 복원하기</span>
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

          {/* Danger zone: reset to defaults */}
          <div className="p-3.5 rounded-xl border border-error/20 bg-error-container/20 flex items-center justify-between">
            <div>
              <p className="font-title-md text-sm text-error font-semibold">전체 일정 &amp; 투두 초기화</p>
              <p className="font-label-sm text-[11px] text-on-error-container">
                모든 일정, 할 일, 목표를 완전히 비우고 이름을 기본값(유저님!)으로 되돌립니다.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('모든 데이터를 처음 시작 상태(빈 일정/투두, 유저님!)로 초기화하시겠습니까?')) {
                  resetToDefaults();
                  setIsSettingsModalOpen(false);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-error text-on-error font-body-sm text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              type="button"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-container-high/40">
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-md text-sm font-semibold hover:bg-primary-container transition-all cursor-pointer"
            type="button"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
