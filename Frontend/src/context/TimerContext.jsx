import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

const TimerContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const useTimer = () => useContext(TimerContext);

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const SYNC_INTERVAL_SEC = 60; // Sync to backend every 60 seconds

export const TimerProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [unsyncedSeconds, setUnsyncedSeconds] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  // Global study stats
  const [studyStats, setStudyStats] = useState({
    todayStudyHours: 0,
    totalStudyHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyGoal: 3,
    studyHistory: []
  });

  const inactivityTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const getEmail = () => {
    return sessionStorage.getItem('userEmail');
  };

  // Fetch initial stats once user is logged in
  useEffect(() => {
    const fetchStats = async () => {
      const email = getEmail();
      if (!email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/study-stats?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          setStudyStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    
    // Simplistic approach to wait for login
    const checkAuthInterval = setInterval(() => {
       if (getEmail()) {
          fetchStats();
          clearInterval(checkAuthInterval);
       }
    }, 2000);
    
    return () => clearInterval(checkAuthInterval);
  }, []);

  const resetInactivityTimer = () => {
    if (isIdle) {
      setIsIdle(false);
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isActive && !isPaused) {
      inactivityTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        setIsPaused(true); // Auto pause on inactivity
      }, INACTIVITY_LIMIT_MS);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    const handleActivity = () => {
      if (isActive && !isPaused) {
         resetInactivityTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
        setUnsyncedSeconds(prev => {
          const newUnsynced = prev + 1;
          if (newUnsynced >= SYNC_INTERVAL_SEC) {
            syncToBackend(newUnsynced);
            return 0; // Reset unsynced after syncing
          }
          return newUnsynced;
        });
      }, 1000);
      
      resetInactivityTimer();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused]);

  const syncToBackend = async (secondsToSync) => {
    if (secondsToSync <= 0) return;
    
    const email = getEmail();
    if (!email) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update-study-time`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sessionSeconds: secondsToSync })
      });
      
      const data = await response.json();
      if (response.ok) {
        setStudyStats(data);
      }
    } catch (error) {
      console.error("Failed to sync study time", error);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsIdle(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isIdle) setIsIdle(false);
  };

  const stopSession = async () => {
    setIsActive(false);
    setIsPaused(false);
    
    if (unsyncedSeconds > 0) {
      await syncToBackend(unsyncedSeconds);
      setUnsyncedSeconds(0);
    }
    
    setSessionSeconds(0);
  };

  return (
    <TimerContext.Provider value={{
      isActive,
      isPaused,
      isIdle,
      sessionSeconds,
      studyStats,
      startSession,
      togglePause,
      stopSession
    }}>
      {children}
    </TimerContext.Provider>
  );
};
