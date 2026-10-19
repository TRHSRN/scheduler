import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    userName,
    setUserName,
    tasks,
    toggleTask,
    addTask,
    goals,
    events,
    openScheduleModal,
    openCreateModal,
    setIsGoalModalOpen,
    setActiveTab,
    quickMemo,
    setQuickMemo,
    showToast
  } = useApp();

  // User name inline editing in greeting
  const [isEditingGreetingName, setIsEditingGreetingName] = useState(false);
  const [tempGreetingName, setTempGreetingName] = useState(userName);

  // Weekly preview drawer toggle state
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);

  // Todo filter in dashboard
  const [todoFilter, setTodoFilter] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [quickTodoText, setQuickTodoText] = useState('');

  // Pomodoro Timer State
  const [totalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMemoSavedAnimated, setIsMemoSavedAnimated] = useState(false);

  // Live Clock
  const [timeDisplay, setTimeDisplay] = useState('14:25 PM');

  // Hero Video State (Classroom anime loop video as default, with IndexedDB persistence for user videos)
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>('./classroom-loop.mp4');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isCustomVideo, setIsCustomVideo] = useState(false);

  // Load custom video from IndexedDB on startup if available
  useEffect(() => {
    try {
      const req = indexedDB.open('DayflowVideoDB', 1);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos');
        }
      };
      req.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('videos', 'readonly');
        const store = tx.objectStore('videos');
        const getReq = store.get('user_uploaded_video');
        getReq.onsuccess = () => {
          if (getReq.result instanceof Blob) {
            const url = URL.createObjectURL(getReq.result);
            setVideoSrc(url);
            setIsCustomVideo(true);
          }
        };
      };
    } catch {
      // IndexedDB fallback
    }
  }, []);

  const saveVideoBlob = (file: File) => {
    try {
      const req = indexedDB.open('DayflowVideoDB', 1);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos');
        }
      };
      req.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('videos', 'readwrite');
        tx.objectStore('videos').put(file, 'user_uploaded_video');
      };
    } catch {
      // ignore
    }
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsCustomVideo(true);
    setIsVideoPlaying(true);
    showToast('🎬 사용자님의 원본 영상이 성공적으로 적용되어 저장되었습니다!');
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      saveVideoBlob(file);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      saveVideoBlob(file);
    }
  };

  const resetToClassroomVideo = () => {
    try {
      const req = indexedDB.open('DayflowVideoDB', 1);
      req.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('videos', 'readwrite');
        tx.objectStore('videos').delete('user_uploaded_video');
      };
    } catch {
      // ignore
    }
    setVideoSrc('./classroom-loop.mp4');
    setIsCustomVideo(false);
    showToast('기본 몰입 클래스룸 영상으로 복원되었습니다.');
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    setTempGreetingName(userName);
  }, [userName]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedH = (hours % 12 || 12).toString().padStart(2, '0');
      const formattedM = minutes.toString().padStart(2, '0');
      setTimeDisplay(`${formattedH}:${formattedM} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsTimerRunning(false);
            showToast('🎉 25분 집중 포커스 세션이 완료되었습니다! 5분간 휴식을 취하세요.');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, showToast]);

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSeconds(totalSeconds);
    showToast('타이머가 25:00으로 리셋되었습니다.');
  };

  const timerMinutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, '0');
  const timerSeconds = (remainingSeconds % 60).toString().padStart(2, '0');
  const circumference = 264;
  const timerOffset = circumference * (1 - remainingSeconds / totalSeconds);

  // Todo stats
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const taskCompletionPct =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 1000) / 10 : 0;
  const remainingTasksCount = totalTasksCount - completedTasksCount;

  // Schedule stats
  const todayEvents = events.filter((e) => e.day === 19 || e.dateStr === '2025-05-19');
  const ongoingEvent = todayEvents.find((e) => e.isOngoing);
  const nextEvent = todayEvents[0];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (todoFilter === 'all') return true;
    if (todoFilter === 'high') return t.priority === 'p0';
    if (todoFilter === 'med') return t.priority === 'p1';
    if (todoFilter === 'low') return t.priority === 'p2';
    return true;
  });

  const handleQuickTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTodoText.trim()) return;

    addTask({
      title: quickTodoText.trim(),
      completed: false,
      priority: 'p1',
      tag: '일반',
      category: '일반',
      date: '2025-05-19'
    });
    setQuickTodoText('');
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuickMemo(e.target.value);
    setIsMemoSavedAnimated(true);
    setTimeout(() => setIsMemoSavedAnimated(false), 800);
  };

  const handleSaveGreetingName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempGreetingName.trim()) {
      setUserName(tempGreetingName.trim());
      setIsEditingGreetingName(false);
    }
  };

  return (
    <div className="w-full px-6 lg:px-8 py-8 space-y-8 max-w-[1600px] mx-auto">
      {/* 1. Top Welcome & Daily Overview Section */}
      <section className="space-y-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleVideoDrop}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 min-h-[220px] shadow-xl border border-white/20 bg-slate-900 flex flex-col md:flex-row md:items-end justify-between gap-6 group/hero"
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none"
          />

          {/* Dark Contrast Gradient Overlay for crystal clear white text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Video Control Pills (Top-Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-xl">
            {isCustomVideo ? (
              <span className="font-label-sm text-[11px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-400/20 mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>내 원본 영상 재생중</span>
              </span>
            ) : (
              <span className="font-label-sm text-[11px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>클래스룸 영상</span>
              </span>
            )}
            <button
              type="button"
              onClick={toggleVideoPlay}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isVideoPlaying ? '영상 일시정지' : '영상 재생'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isVideoPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              type="button"
              onClick={toggleVideoMute}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isVideoMuted ? '음소거 해제' : '음소거'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isVideoMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="h-7 px-3 rounded-full bg-primary text-white font-label-sm text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="컴퓨터에서 내가 올린 영상 파일(.mp4, .webm) 직접 선택하기"
            >
              <span className="material-symbols-outlined text-[15px]">file_upload</span>
              <span>내 영상 파일 올리기</span>
            </button>
            {isCustomVideo && (
              <button
                type="button"
                onClick={resetToClassroomVideo}
                className="h-7 px-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white font-label-sm text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="기본 애니메이션 영상으로 되돌리기"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>기본 영상</span>
              </button>
            )}
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              className="hidden"
            />
          </div>

          {/* Left: Text & Greeting (All black text converted to high-contrast white) */}
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-label-md text-label-md backdrop-blur-md border border-white/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-white">생산성 부스트 모드 ON</span>
            </div>

            {/* Editable Name Greeting */}
            {isEditingGreetingName ? (
              <form onSubmit={handleSaveGreetingName} className="flex flex-wrap items-center gap-2 pt-1">
                <span className="font-headline-xl text-headline-xl text-white font-bold tracking-tight drop-shadow-md">
                  안녕하세요,
                </span>
                <input
                  type="text"
                  value={tempGreetingName}
                  onChange={(e) => setTempGreetingName(e.target.value)}
                  placeholder="이름 입력 (예: 유저님!)"
                  className="px-3 py-1 bg-black/60 text-white rounded-xl font-headline-xl text-headline-xl font-bold focus:outline-none focus:ring-2 focus:ring-white border border-white/40 max-w-[240px]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-white text-black font-body-sm font-bold hover:bg-white/90 transition-colors cursor-pointer shadow-md"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingGreetingName(false)}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  취소
                </button>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5 group">
                <h1 className="font-headline-xl text-headline-xl text-white font-extrabold tracking-tight drop-shadow-md">
                  안녕하세요, <span className="text-amber-300 drop-shadow-sm">{userName}</span>{userName.endsWith('!') ? '' : '!'} 오늘도 몰입하는 하루 되세요 ✨
                </h1>
                <button
                  onClick={() => setIsEditingGreetingName(true)}
                  className="opacity-80 group-hover:opacity-100 px-2.5 py-1 rounded-lg text-white/90 hover:text-white bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-semibold"
                  title="이름 바꾸기"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>이름 변경</span>
                </button>
              </div>
            )}

            <p className="font-body-lg text-body-lg text-white/90 font-medium drop-shadow-sm">
              오늘 계획된 타임블록과 핵심 태스크를 자유롭게 등록하고 시작해보세요.
            </p>
          </div>

          {/* Right: Live Clock & Status Badge (Clean White & Translucent) */}
          <div className="relative z-10 flex items-center gap-3.5 bg-black/55 backdrop-blur-xl p-3.5 px-5 rounded-2xl shadow-xl border border-white/25 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-inner">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-white/70 uppercase tracking-wider font-semibold">
                  Today
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-emerald-300 font-bold">
                  동기화 완료
                </span>
              </div>
              <div className="font-title-md text-title-md text-white flex items-baseline gap-2 mt-0.5">
                <span className="font-semibold text-white/95">2025. 05. 19 (월)</span>
                <span className="font-label-md text-label-md text-white font-extrabold tracking-wide drop-shadow-xs">
                  {timeDisplay}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Cards (4 stats row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Metric 1: 오늘의 일정 */}
          <div
            onClick={() => setActiveTab('schedule')}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-surface-container-high/40"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  오늘의 일정
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface">
                    {todayEvents.length}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">개 예정</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low/60 -mx-5 -mb-5 px-5 py-2.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
              <span className="truncate">
                {nextEvent ? (
                  <>
                    다음: <strong className="text-on-surface">[{nextEvent.startTime}] {nextEvent.title}</strong>
                  </>
                ) : (
                  <span>예정된 일정이 없습니다. 일정을 추가해보세요.</span>
                )}
              </span>
            </div>
          </div>

          {/* Metric 2: 오늘 투두 */}
          <div
            onClick={() => setActiveTab('todos')}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer border border-surface-container-high/40"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  오늘 투두 달성
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface">
                    {completedTasksCount}
                    <span className="text-outline text-title-md font-normal">/{totalTasksCount}</span>
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold">
                    {taskCompletionPct}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
            </div>
            <div className="mt-4 pt-2">
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${taskCompletionPct}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-on-surface-variant">
                <span>남은 할 일 {remainingTasksCount}개</span>
                <span className="text-secondary font-semibold">
                  {totalTasksCount === 0 ? '할 일을 등록해보세요' : '순조로운 진행'}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: 주간 몰입 점수 */}
          <div
            onClick={() => setActiveTab('goals-and-stats')}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer border border-surface-container-high/40"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  주간 몰입 지수
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface">
                    {totalTasksCount > 0 ? '88' : '0'}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">점 / 100</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low/60 -mx-5 -mb-5 px-5 py-2.5">
              <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>{totalTasksCount > 0 ? '+12% 상승' : '기록 대기 중'}</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                {totalTasksCount > 0 ? '전주 76점 대비' : '첫 기록 시작'}
              </span>
            </div>
          </div>

          {/* Metric 4: 5월 목표 달성 */}
          <div
            onClick={() => setActiveTab('goals-and-stats')}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer border border-surface-container-high/40"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  5월 핵심 목표 현황
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface">
                    {goals.length}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    개 목표 등록됨
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary-container group-hover:bg-tertiary-container group-hover:text-on-tertiary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">flag</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low/60 -mx-5 -mb-5 px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="truncate">
                {goals.length > 0 ? (
                  <>
                    달성 마일스톤 평균{' '}
                    <strong className="text-on-surface">
                      {Math.round(
                        goals.reduce((acc, g) => acc + (g.current / g.total) * 100, 0) /
                          goals.length
                      )}
                      %
                    </strong>
                  </>
                ) : (
                  <span>목표를 설정해보세요</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. '오늘의 스케줄' Card with Expandable Weekly Schedule Preview */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-6 border border-surface-container-high/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">timeline</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">오늘의 스케줄</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                  Today Timeline
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                오전 08:00부터 오후 22:00까지의 시간 블록 다이어그램
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {ongoingEvent ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-error-container/40 text-on-error-container font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span>현재: {ongoingEvent.startTime} - {ongoingEvent.endTime} 진행중</span>
              </div>
            ) : (
              <button
                onClick={() => openCreateModal('event')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-label-md text-label-md hover:bg-primary/20 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>새 일정 등록</span>
              </button>
            )}

            <button
              onClick={() => setIsWeeklyOpen(!isWeeklyOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-body-md transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_week</span>
              <span>{isWeeklyOpen ? '주간 시간표 접기 ⤓' : '주간 시간표로 펼쳐보기 ⤢'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Visual Timeline Ribbon (08:00 to 22:00) */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[900px] space-y-2">
            {/* Time ticks */}
            <div className="grid grid-cols-14 text-center font-label-sm text-label-sm text-outline border-b-0 pb-1">
              <div className="text-left pl-1">08:00</div>
              <div>09:00</div>
              <div>10:00</div>
              <div>11:00</div>
              <div>12:00</div>
              <div>13:00</div>
              <div>14:00</div>
              <div>15:00</div>
              <div>16:00</div>
              <div>17:00</div>
              <div>18:00</div>
              <div>19:00</div>
              <div>20:00</div>
              <div className="text-right pr-1">21:00+</div>
            </div>

            {/* Timeline Track Container */}
            <div
              onClick={() => {
                if (todayEvents.length === 0) {
                  openCreateModal('event');
                }
              }}
              className="relative h-28 bg-surface-container-low rounded-xl p-2.5 overflow-hidden cursor-pointer"
              title="클릭하여 새 일정 추가"
            >
              {/* Grid Hour Guidelines */}
              <div className="absolute inset-0 grid grid-cols-14 pointer-events-none opacity-30">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div key={i} className="border-r border-outline-variant/40 h-full"></div>
                ))}
                <div className="h-full"></div>
              </div>

              {/* Current Time Needle (14:25 -> 46%) */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                style={{ left: '46%' }}
              >
                <div className="bg-error text-on-error font-label-sm text-label-sm px-1.5 py-0.5 rounded shadow-sm">
                  14:25
                </div>
                <div className="w-0.5 h-full bg-error shadow-sm"></div>
              </div>

              {/* Dynamic Event blocks if any */}
              {todayEvents.length > 0 ? (
                todayEvents.map((evt) => {
                  const [sH, sM] = evt.startTime.split(':').map(Number);
                  const [eH, eM] = evt.endTime.split(':').map(Number);
                  const startHours = sH + (sM || 0) / 60 - 8;
                  const durHours = eH + (eM || 0) / 60 - (sH + (sM || 0) / 60);

                  const leftPct = Math.max(0, Math.min(90, (startHours / 14) * 100));
                  const widthPct = Math.max(6, Math.min(90, (durHours / 14) * 100));

                  return (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openScheduleModal(evt);
                      }}
                      className="absolute top-3 bottom-3 rounded-xl bg-primary text-on-primary shadow-sm p-2 flex flex-col justify-between transition-transform hover:-translate-y-0.5 cursor-pointer z-10"
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <div className="flex items-center gap-1 truncate font-label-sm text-xs font-semibold">
                        {evt.title}
                      </div>
                      <div className="font-label-sm text-[10px] text-on-primary-container truncate">
                        {evt.startTime} - {evt.endTime}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest/80 text-on-surface-variant font-body-sm shadow-xs backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      add_circle
                    </span>
                    <span>
                      아직 등록된 일정이 없습니다. 원하는 시간대를 클릭하여 첫 일정을 만들어보세요!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Weekly Grid Preview Section */}
        {isWeeklyOpen && (
          <div className="transition-all duration-300 pt-4 bg-surface-container-low/50 rounded-xl p-4 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  calendar_view_week
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  이번 주 7일 캘린더 개요 (5월 3주차)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="font-label-sm text-label-sm text-primary font-semibold hover:underline"
                >
                  스케줄 전체 보기 →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { day: 19, name: '19 월 (오늘)', isToday: true },
                { day: 20, name: '20 화' },
                { day: 21, name: '21 수' },
                { day: 22, name: '22 목' },
                { day: 23, name: '23 금' },
                { day: 24, name: '24 토' },
                { day: 25, name: '25 일' }
              ].map((d) => {
                const dayEvts = events.filter((e) => e.day === d.day);
                return (
                  <div
                    key={d.day}
                    onClick={() => openCreateModal('event')}
                    className={`bg-surface-container-lowest p-3 rounded-xl shadow-sm space-y-2 cursor-pointer hover:border-primary/50 transition-colors border border-surface-container-high/30 ${
                      d.isToday ? 'ring-1 ring-primary/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-title-md text-title-md ${
                          d.isToday ? 'text-primary font-bold' : 'text-on-surface font-semibold'
                        }`}
                      >
                        {d.name}
                      </span>
                      {d.isToday && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </div>

                    <div className="space-y-1.5 min-h-[70px] flex flex-col justify-center">
                      {dayEvts.length > 0 ? (
                        dayEvts.map((e) => (
                          <div
                            key={e.id}
                            className="p-1.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm truncate font-medium"
                          >
                            {e.startTime} {e.title}
                          </div>
                        ))
                      ) : (
                        <div className="text-center font-label-sm text-outline text-[11px] py-3">
                          + 일정 추가
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. Two-Column Productivity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Width ~60% -> col-span-7) */}
        <div className="lg:col-span-7 space-y-8 min-w-0">
          {/* '오늘의 투두 리스트' */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-5 border border-surface-container-high/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    오늘의 투두 리스트
                  </h3>
                  <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full font-bold">
                    {completedTasksCount} / {totalTasksCount} 완료
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  집중 실행할 핵심 태스크 항목을 체크하세요.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                <button
                  onClick={() => setTodoFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                    todoFilter === 'all'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  전체
                </button>
                <button
                  onClick={() => setTodoFilter('high')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                    todoFilter === 'high'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  높은 우선순위
                </button>
                <button
                  onClick={() => setTodoFilter('med')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                    todoFilter === 'med'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  보통
                </button>
                <button
                  onClick={() => setTodoFilter('low')}
                  className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                    todoFilter === 'low'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  낮은 우선순위
                </button>
              </div>
            </div>

            {/* Quick Todo Input Form */}
            <form onSubmit={handleQuickTodoSubmit} className="relative">
              <div className="flex items-center bg-surface-container-low rounded-xl px-3.5 py-2 focus-within:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-[20px] text-primary mr-2.5">
                  add_task
                </span>
                <input
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder="+ 오늘 할 일을 빠르게 입력하세요 (Enter)"
                  type="text"
                  value={quickTodoText}
                  onChange={(e) => setQuickTodoText(e.target.value)}
                />
                <button
                  className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors shrink-0 cursor-pointer"
                  type="submit"
                >
                  추가
                </button>
              </div>
            </form>

            {/* Todo List Items */}
            <div className="space-y-2.5">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                      task.completed
                        ? 'bg-surface-container-low/40 hover:bg-surface-container-low'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4.5 h-4.5 accent-secondary rounded cursor-pointer"
                        type="checkbox"
                      />
                      <span
                        className={`font-body-md text-body-md truncate ${
                          task.completed
                            ? 'text-outline line-through'
                            : 'text-on-surface font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                        {task.tag || '일반'}
                      </span>
                      {task.priority === 'p0' && (
                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-error bg-error-container/40 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          높은 우선순위
                        </span>
                      )}
                      {task.priority === 'p1' && (
                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/60 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                          보통
                        </span>
                      )}
                      {task.priority === 'p2' && (
                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-primary bg-primary-fixed/60 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          낮음
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-xl bg-surface-container-low/40 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[28px] text-outline">
                    checklist
                  </span>
                  <p className="font-body-md font-medium text-on-surface">
                    등록된 할 일이 없습니다.
                  </p>
                  <p className="font-body-sm text-outline">
                    상단 입력창에 첫 번째 할 일을 작성하고 추가해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* '월간 목표 진행 현황' */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-5 border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/70 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">track_changes</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    월간 목표 진행 현황
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    5월 달성을 위해 설정된 마일스톤 달성도
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed px-3 py-1 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
                type="button"
              >
                + 새 목표 추가
              </button>
            </div>

            {/* Goal Cards */}
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((g, idx) => {
                  const pct = Math.round((g.current / g.total) * 100);
                  return (
                    <div
                      key={g.id}
                      onClick={() => setActiveTab('goals-and-stats')}
                      className="p-4 rounded-xl bg-surface-container-low space-y-3 hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-label-sm text-label-sm font-bold uppercase text-primary">
                            Goal 0{idx + 1} • {g.category}
                          </span>
                          <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                            {g.title}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="font-title-md text-title-md font-bold text-primary">
                            {pct}%
                          </span>
                          <p className="font-label-sm text-label-sm text-outline">
                            {g.current} / {g.total} {g.unit}
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center rounded-xl bg-surface-container-low/40 flex flex-col items-center justify-center gap-2.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] text-tertiary">flag</span>
                  <p className="font-body-md font-medium text-on-surface">
                    아직 등록된 월간 목표가 없습니다.
                  </p>
                  <p className="font-body-sm text-outline max-w-sm">
                    이번 달 꼭 달성하고 싶은 자기계발, 운동, 커리어 목표를 설정하고 관리해보세요.
                  </p>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer shadow-xs"
                    type="button"
                  >
                    + 첫 월간 목표 등록하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Width ~40% -> col-span-5) */}
        <div className="lg:col-span-5 space-y-8 min-w-0">
          {/* '주간 투두 달성 현황' Mini Chart */}
          <div
            onClick={() => setActiveTab('goals-and-stats')}
            className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-5 cursor-pointer border border-surface-container-high/40 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  주간 투두 달성 현황
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  지난 7일간의 완료 성과 통계
                </p>
              </div>
              <div className="text-right">
                <span className="font-headline-md text-headline-md text-secondary font-bold">
                  {taskCompletionPct}%
                </span>
                <p className="font-label-sm text-label-sm text-outline">
                  {completedTasksCount} / {totalTasksCount} 완료
                </p>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="space-y-2 pt-2">
              <div className="h-44 w-full flex items-end justify-between gap-2.5 px-2 pb-2 border-b-0">
                {['월', '화', '수', '목', '금', '토', '일'].map((dayName, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="font-label-sm text-label-sm text-outline">-</span>
                    <div
                      className="w-full bg-surface-container-high rounded-t-lg transition-all duration-300"
                      style={{ height: '8%' }}
                    ></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {dayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight callout */}
            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface">
                  {totalTasksCount > 0 ? (
                    <>
                      가장 생산성이 높았던 시간: <strong className="text-primary font-semibold">오전 10시~12시</strong>
                    </>
                  ) : (
                    <span>오늘 완료한 태스크에 따라 최적의 몰입 시간대가 분석됩니다.</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* '포커스 타이머 & 빠른 메모 위젯' */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-6 border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  뽀모도로 포커스 타이머
                </h3>
              </div>
              <span className="font-label-sm text-label-sm bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md">
                Deep Work
              </span>
            </div>

            {/* Focus Timer Widget UI */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container-high"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                  ></circle>
                  <circle
                    className="text-primary transition-all duration-1000"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={timerOffset}
                    strokeLinecap="round"
                    strokeWidth="6"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                    {timerMinutes}:{timerSeconds}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">집중 세션</span>
                </div>
              </div>

              {/* Timer Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTimer}
                  className={`px-5 py-2 rounded-lg text-on-primary font-body-md text-body-md font-semibold active:scale-[0.98] transition-all shadow-sm cursor-pointer ${
                    isTimerRunning
                      ? 'bg-tertiary-container hover:opacity-90'
                      : 'bg-primary hover:bg-primary-container'
                  }`}
                  type="button"
                >
                  {isTimerRunning ? '일시 정지' : '시작하기'}
                </button>
                <button
                  onClick={resetTimer}
                  className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                  title="타이머 리셋"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                </button>
              </div>
            </div>

            {/* Quick Notepad Widget */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    edit_note
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    퀵 메모 & 브레인스톰
                  </span>
                </div>
                <span
                  className={`font-label-sm text-label-sm text-secondary flex items-center gap-1 transition-colors ${
                    isMemoSavedAnimated ? 'text-primary font-bold' : 'opacity-80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">cloud_done</span> 자동 저장됨
                </span>
              </div>
              <textarea
                value={quickMemo}
                onChange={handleMemoChange}
                className="w-full bg-surface-container-low rounded-xl p-3.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all resize-none"
                placeholder="갑자기 떠오른 아이디어, 다음 미팅 어젠다, 혹은 오늘의 단상을 자유롭게 기록해 두세요..."
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
