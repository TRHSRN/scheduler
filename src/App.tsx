/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CreateModal } from './components/CreateModal';
import { NewGoalModal } from './components/NewGoalModal';
import { ScheduleDetailDrawer } from './components/ScheduleDetailDrawer';
import { SettingsModal } from './components/SettingsModal';
import { DatePickerModal } from './components/DatePickerModal';
import { DashboardView } from './components/views/DashboardView';
import { ScheduleView } from './components/views/ScheduleView';
import { TodosView } from './components/views/TodosView';
import { GoalsAndStatsView } from './components/views/GoalsAndStatsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="w-full pt-16 bg-background flex-1 flex flex-col">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'schedule' && <ScheduleView />}
      {activeTab === 'todos' && <TodosView />}
      {activeTab === 'goals-and-stats' && <GoalsAndStatsView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
        <Header />
        <MainContent />
        <Footer />

        {/* Global Modals & Drawers */}
        <CreateModal />
        <NewGoalModal />
        <ScheduleDetailDrawer />
        <SettingsModal />
        <DatePickerModal />
        <Toast />
      </div>
    </AppProvider>
  );
}
