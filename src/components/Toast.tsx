import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-on-surface text-surface-container-lowest shadow-xl text-body-sm font-medium">
        <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
