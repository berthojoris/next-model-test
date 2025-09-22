
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useAppContext, DataContextProvider } from './context/AppContext';
import LoginModal from './components/LoginModal';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import RegisterSurveyor from './pages/RegisterSurveyor';
import SurveyRegular from './pages/SurveyRegular';
import SurveyEvent from './pages/SurveyEvent';
import Report from './pages/Report';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </AppContextProvider>
  );
};

const MainApp: React.FC = () => {
  const { isAuthenticated, dbReady, dbError } = useAppContext();

  // 1. Handle database initialization error (e.g., private browsing)
  if (dbError) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-lg mx-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Storage Access Required</h1>
          <p className="text-gray-300 mb-2">
            This application requires access to browser storage to function, but it has been blocked.
          </p>
          <p className="text-gray-300 mb-6">
            This commonly happens when using <strong>Private or Incognito Mode</strong>. Please switch to a regular browser window and ensure that site data is not blocked.
          </p>
          <p className="text-xs text-gray-500">Error: {dbError.message}</p>
        </div>
      </div>
    );
  }

  // 2. Show a loading screen while the DB is connecting
  if (!dbReady) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-300 animate-pulse">Initializing Application...</h1>
        </div>
      </div>
    );
  }

  // 3. Once DB is ready, render the main application
  return (
    <>
      {!isAuthenticated && <LoginModal />}
      <div className={!isAuthenticated ? 'blur-sm' : ''}>
        {isAuthenticated ? (
          // This is the key change: Wrap the authenticated app in DataContextProvider.
          // This ensures useLiveQuery hooks only run when dbReady is true, preventing the crash.
          <DataContextProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="register-surveyor" element={<RegisterSurveyor />} />
                  <Route path="survey-regular" element={<SurveyRegular />} />
                  <Route path="survey-event" element={<SurveyEvent />} />
                  <Route path="report" element={<Report />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </DataContextProvider>
        ) : (
          <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900"></div>
        )}
      </div>
    </>
  );
};

export default App;
