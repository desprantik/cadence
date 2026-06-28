import { createContext, useContext, useEffect, useState } from 'react';
import { learner as defaultLearner } from '../data/learner';

export const STORAGE_KEY = 'cadence.learner';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadLearnerState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        name: defaultLearner.name,
        streak: { ...defaultLearner.streak },
        overallProgress: defaultLearner.overallProgress,
        progressNudge: defaultLearner.progressNudge,
        lastSessionDate: null,
      };
    }
    const parsed = JSON.parse(stored);
    return {
      name: defaultLearner.name,
      streak: { ...defaultLearner.streak, ...parsed.streak },
      overallProgress: parsed.overallProgress ?? defaultLearner.overallProgress,
      progressNudge: defaultLearner.progressNudge,
      lastSessionDate: parsed.lastSessionDate ?? null,
    };
  } catch {
    return {
      name: defaultLearner.name,
      streak: { ...defaultLearner.streak },
      overallProgress: defaultLearner.overallProgress,
      progressNudge: defaultLearner.progressNudge,
      lastSessionDate: null,
    };
  }
}

function saveLearnerState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      streak: state.streak,
      overallProgress: state.overallProgress,
      lastSessionDate: state.lastSessionDate,
    })
  );
}

const LearnerContext = createContext(null);

export function LearnerProvider({ children }) {
  const [state, setState] = useState(loadLearnerState);
  const [celebrating, setCelebrating] = useState(false);
  const [previousStats, setPreviousStats] = useState(null);

  useEffect(() => {
    saveLearnerState(state);
  }, [state]);

  const completeSession = () => {
    setPreviousStats({
      streakCurrent: state.streak.current,
      streakToday: state.streak.today,
      totalHours: state.streak.totalHours,
      overallProgress: state.overallProgress,
    });

    setState((prev) => ({
      ...prev,
      streak: {
        ...prev.streak,
        current: Math.min(prev.streak.current + 1, prev.streak.goal),
        today: prev.streak.today + 1,
        totalHours: Math.round((prev.streak.totalHours + 0.1) * 10) / 10,
      },
      overallProgress: Math.min(prev.overallProgress + 1, 100),
      lastSessionDate: todayKey(),
    }));
    setCelebrating(true);
  };

  const clearCelebration = () => {
    setCelebrating(false);
    setPreviousStats(null);
  };

  const completedToday = state.lastSessionDate === todayKey();

  return (
    <LearnerContext.Provider
      value={{
        learner: state,
        overallProgress: state.overallProgress,
        celebrating,
        previousStats,
        completedToday,
        completeSession,
        clearCelebration,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error('useLearner requires LearnerProvider');
  return ctx;
}
