
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { db } from '../services/db';
import { SyncStatus } from '../types';
import { useLiveQuery } from 'dexie-react-hooks';

// --- App Context (Connection & Auth) ---

interface AppContextType {
  isAuthenticated: boolean;
  isOnline: boolean;
  dbReady: boolean;
  dbError: Error | null;
  login: () => void;
  logout: () => void;
  toggleOnlineStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);
  const { isOnline, toggleOnlineStatus } = useOnlineStatus();

  // Effect to open the database on startup
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.open();
        setDbReady(true);
        console.log("Database opened successfully.");
      } catch (e: any) {
        console.error("Failed to open database:", e);
        setDbError(e);
      }
    };
    initializeDatabase();
  }, []);

  // Effect to check authentication on startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token === 'loggedIn') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleSync = useCallback(async () => {
    if (!isOnline) return;
    console.log('Starting sync...');

    try {
      const pendingSurveyors = await db.surveyors.where('status').equals(SyncStatus.PENDING).toArray();
      const pendingRegular = await db.surveyRegularResponses.where('status').equals(SyncStatus.PENDING).toArray();
      const pendingEvent = await db.surveyEventResponses.where('status').equals(SyncStatus.PENDING).toArray();

      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (pendingSurveyors.length > 0) {
          const ids = pendingSurveyors.map(s => s.id!);
          await db.surveyors.bulkUpdate(ids.map(id => ({ key: id, changes: { status: SyncStatus.SYNCED } })));
          console.log(`Synced ${pendingSurveyors.length} surveyors.`);
      }
      if (pendingRegular.length > 0) {
          const ids = pendingRegular.map(r => r.id!);
          await db.surveyRegularResponses.bulkUpdate(ids.map(id => ({ key: id, changes: { status: SyncStatus.SYNCED } })));
          console.log(`Synced ${pendingRegular.length} regular surveys.`);
      }
      if (pendingEvent.length > 0) {
          const ids = pendingEvent.map(e => e.id!);
          await db.surveyEventResponses.bulkUpdate(ids.map(id => ({ key: id, changes: { status: SyncStatus.SYNCED } })));
          console.log(`Synced ${pendingEvent.length} event surveys.`);
      }

      console.log('Sync complete.');
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
  }, [isOnline]);

  // Effect for background sync
  useEffect(() => {
    if (isOnline && isAuthenticated && dbReady) {
      handleSync().catch(error => {
          console.error("Background sync triggered by useEffect failed:", error);
      });
    }
  }, [isOnline, isAuthenticated, dbReady, handleSync]);

  const login = () => {
    localStorage.setItem('authToken', 'loggedIn');
    setIsAuthenticated(true);
  };

  // Simplified logout to prioritize stability. Background sync will handle pending items.
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isOnline,
    dbReady,
    dbError,
    login,
    logout,
    toggleOnlineStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

// --- Data Context (Live Queries) ---

interface DataContextType {
    submissionsToday: number;
    pendingSyncCount: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // The useLiveQuery hooks are safe here because this component will only
    // be rendered *after* the database is ready.
    const submissionsToday = useLiveQuery(async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const counts = await Promise.all([
              db.surveyors.where('createdAt').aboveOrEqual(today).count(),
              db.surveyRegularResponses.where('createdAt').aboveOrEqual(today).count(),
              db.surveyEventResponses.where('createdAt').aboveOrEqual(today).count()
            ]);
            return counts.reduce((a, b) => a + b, 0);
        } catch (error) {
            console.error("Failed to fetch submissions today count:", error);
            return 0;
        }
    }, [], 0);

    const pendingSyncCount = useLiveQuery(async () => {
        try {
            const counts = await Promise.all([
              db.surveyors.where('status').equals(SyncStatus.PENDING).count(),
              db.surveyRegularResponses.where('status').equals(SyncStatus.PENDING).count(),
              db.surveyEventResponses.where('status').equals(SyncStatus.PENDING).count()
            ]);
            return counts.reduce((a, b) => a + b, 0);
        } catch (error) {
            console.error("Failed to fetch pending sync count:", error);
            return 0;
        }
    }, [], 0);

    const value = {
        submissionsToday: submissionsToday ?? 0,
        pendingSyncCount: pendingSyncCount ?? 0,
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataContextProvider');
  }
  return context;
};
