
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, UserProfile, UserStats, Memory, DailyLog } from './types';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import Vault from './views/Vault';
import Auth from './views/Auth';

const LOCAL_STORAGE_KEY = 'future_me_coach_data';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      user: null,
      stats: { streak: 0, lastActive: null, totalCheckIns: 0 },
      memories: [],
      logs: [],
      isAuthenticated: false,
    };
  });

  const [currentView, setCurrentView] = useState<'auth' | 'onboarding' | 'dashboard' | 'vault'>('auth');

  // Persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // View Navigation Logic
  useEffect(() => {
    if (!state.isAuthenticated) {
      setCurrentView('auth');
    } else if (!state.user) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  }, [state.isAuthenticated, state.user]);

  const handleLogin = (email: string) => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState(prev => ({ ...prev, user: profile }));
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = state.stats.lastActive;
    
    let newStreak = state.stats.streak;
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1;
    }

    const newLog: DailyLog = { date: today, completed: true };
    
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        streak: newStreak,
        lastActive: today,
        totalCheckIns: prev.stats.totalCheckIns + 1,
      },
      logs: [...prev.logs, newLog],
    }));
  };

  const addMemory = (text: string, type: Memory['triggerType']) => {
    const newMemory: Memory = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      triggerType: type,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, memories: [newMemory, ...prev.memories] }));
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col relative overflow-hidden bg-neutral-950 text-neutral-200">
      {currentView === 'auth' && <Auth onLogin={handleLogin} />}
      {currentView === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {currentView === 'dashboard' && state.user && (
        <Dashboard 
          state={state} 
          onCheckIn={handleCheckIn} 
          onOpenVault={() => setCurrentView('vault')}
          addMemory={addMemory}
        />
      )}
      {currentView === 'vault' && (
        <Vault 
          memories={state.memories} 
          onBack={() => setCurrentView('dashboard')} 
        />
      )}
    </div>
  );
};

export default App;
