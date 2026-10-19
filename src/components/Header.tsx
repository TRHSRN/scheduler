import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    userName,
    setUserName,
    openCreateModal,
    setIsDatePickerOpen,
    setIsSettingsModalOpen
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);

  const navItems: { id: TabType; label: string }[] = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'schedule', label: '스케줄' },
    { id: 'todos', label: '투두' },
    { id: 'goals-and-stats', label: '목표 & 통계' }
  ];

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      setUserName(editingName.trim());
      setIsEditingName(false);
    }
  };

  const avatarChar = userName.replace(/[^a-zA-Z가-힣0-9]/g, '').charAt(0) || '유';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
      <div className="h-16 w-full px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Date indicator */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <img
              alt="Dayflow Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U0PsOcgOO5Lb9EZXp4itryWHvTb-fUn4iTaz_1aHcJ-_oHuRL6874GU9tDIAXVb2YFpwyV-8iZ-_fo3M8iZ2iMcrQBsLSu5x2PrX1sLd_1jdF1z5vNhMmRq1u5EE3Wcu1__uYCIZkJpI4PrF9_D8zP9_jvoLzu2w0qB5o7M1_BGLxsfIvbAVe0qMFiXaoqO3Xsu91eBM4mN7wgjyxXtH9C__4dDfihkR0cE8-3OvqejTGGgLAjiiV_zqw"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-title-md text-title-md text-on-surface tracking-tight font-semibold">
              Dayflow
            </span>
          </button>

          <div className="h-4 w-px bg-outline-variant/60 hidden xl:block"></div>

          <div
            onClick={() => setIsDatePickerOpen(true)}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
            title="날짜 선택 열기"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              2025년 5월 19일 월요일
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse ml-1"></span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">10:42 AM</span>
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-surface-container-lowest/80 p-1 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.04)] border border-surface-container-high/40"
          aria-label="메인 네비게이션"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3.5 py-1.5 font-body-md text-body-md transition-all rounded-lg cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Quick Create Action */}
          <button
            onClick={() => openCreateModal('task')}
            className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-[0_1px_3px_rgba(69,58,206,0.2)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>새 일정/할 일</span>
          </button>

          {/* Date Picker Button */}
          <button
            onClick={() => setIsDatePickerOpen(true)}
            aria-label="날짜 선택"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
            title="날짜 선택"
          >
            <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
            title={isDarkMode ? '라이트 모드' : '다크 모드'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            aria-label="설정"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
            title="설정"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <div className="h-4 w-px bg-outline-variant/60 mx-1 hidden sm:block"></div>

          {/* User Profile Avatar with Name Editor */}
          <div className="relative">
            <button
              onClick={() => {
                setEditingName(userName);
                setIsProfileMenuOpen((prev) => !prev);
              }}
              aria-label="사용자 이름 및 프로필 설정"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
              type="button"
            >
              {avatarChar}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 top-11 w-64 rounded-2xl bg-surface-container-lowest p-3 shadow-xl border border-surface-container-high/60 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="pb-3 border-b border-surface-container-high/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {avatarChar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-title-md text-sm text-on-surface font-bold truncate">
                          {userName}
                        </p>
                        <p className="font-label-sm text-[11px] text-on-surface-variant">
                          로컬 워크스페이스 (로그인 없음)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingName(!isEditingName)}
                      className="text-primary hover:bg-surface-container p-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                      title="이름 수정"
                    >
                      {isEditingName ? '닫기' : '이름 변경'}
                    </button>
                  </div>

                  {/* Inline Name Editor */}
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="mt-3 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="이름 입력 (예: 유저님!)"
                        className="flex-1 h-8 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="h-8 px-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                      >
                        저장
                      </button>
                    </form>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>생산성 부스트 ON</span>
                    </div>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">dashboard</span>
                    <span>대시보드로 가기</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('schedule');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                    <span>주간 스케줄 보기</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('todos');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">check_circle</span>
                    <span>투두 리스트 보기</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
                    <span>환경설정</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="lg:hidden flex items-center justify-around px-4 py-2 border-t border-surface-container-high/30 bg-surface/95 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
