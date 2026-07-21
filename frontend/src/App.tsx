// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Login } from './pages/auth/Login';
import { Sidebar } from './components/Sidebar';
import { TransportHeadDashboard } from './pages/head/Dashboard';
import { ParentDashboard } from './pages/parent/Dashboard';
import { DriverDashboard } from './pages/driver/Dashboard';
import { SuperAdminDashboard } from './pages/superadmin/Dashboard';
import { initLocalStorageDB, dbService } from './utils/db';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationBell } from './components/NotificationBell';

// ── Zustand stores ──────────────────────────────────────────
import { useAuthStore, useAppStore } from './store';
import type { UserSession } from './store';

// ── AppContent (needs access to toast context) ──────────────
const AppContent: React.FC = () => {
  const toast = useToast();

  // Auth store
  const user    = useAuthStore((s) => s.user);
  const token   = useAuthStore((s) => s.token);
  const login   = useAuthStore((s) => s.login);
  const logout  = useAuthStore((s) => s.logout);

  // Navigation store
  const activeTab       = useAppStore((s) => s.activeTab);
  const setActiveTab    = useAppStore((s) => s.setActiveTab);
  const resetTabForRole = useAppStore((s) => s.resetTabForRole);

  // Initialize localStorage DB on first mount
  useEffect(() => {
    initLocalStorageDB();
  }, []);

  // ── Background Fastag Auto-Scanner ────────────────────────
  // Automatically logs Entry/Exit gate timings for all active buses.
  // Direction is determined by time of day:
  //   06:00–11:59 → Entry  (morning fleet entering campus)
  //   12:00–22:00 → Exit   (afternoon/evening fleet leaving campus)
  // Runs every 60s when user is logged in; cycles through vehicles round-robin.
  const vehicleScanIndexRef = useRef(0);
  useEffect(() => {
    if (!user) return; // Only run when authenticated

    const runAutoScan = () => {
      const vehicles = dbService.getVehicles();
      if (vehicles.length === 0) return;

      const hour = new Date().getHours();
      // Morning (6–11): Entry. Afternoon/evening (12+): Exit.
      const direction: 'Entry' | 'Exit' = hour >= 6 && hour < 12 ? 'Entry' : 'Exit';
      const gates = ['North Main Gate', 'South Gate 2', 'West Campus Gate'];

      // Cycle through vehicles round-robin
      const idx = vehicleScanIndexRef.current % vehicles.length;
      const vehicle = vehicles[idx];
      vehicleScanIndexRef.current += 1;

      const existingLogs = dbService.getFastagLogs();

      // Skip duplicate: if last log for this vehicle today already has same direction, skip
      const todayStr = new Date().toISOString().split('T')[0];
      const todayVehicleLogs = existingLogs.filter(
        (l) => l.vehicleNumber === vehicle.vehicleNumber && l.timestamp.startsWith(todayStr)
      );
      if (todayVehicleLogs.length > 0) {
        const lastLog = todayVehicleLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
        if (lastLog.direction === direction) return; // Already scanned this direction recently
      }

      const newLog = {
        id: `FT-AUTO-${vehicle.vehicleNumber}-${Date.now()}`,
        vehicleNumber: vehicle.vehicleNumber,
        gateName: gates[idx % gates.length],
        direction,
        timestamp: new Date().toISOString(),
        status: 'Valid'
      };

      dbService.saveFastagLogs([newLog, ...existingLogs]);
    };

    // Run once immediately on mount / login
    runAutoScan();

    // Then every 60 seconds
    const intervalId = setInterval(runAutoScan, 60000);
    return () => clearInterval(intervalId);
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────
  const handleLoginSuccess = (loggedInUser: UserSession, accessToken: string) => {
    login(loggedInUser, accessToken);
    resetTabForRole(loggedInUser.role);
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out from Transcend Transport Portal.');
  };

  // ── Header copy helpers ───────────────────────────────────
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Transport Overview';
      case 'vehicles': return 'Fleet Vehicle Management';
      case 'routes': return 'Route & Bus Stops';
      case 'drivers': return 'Driver Directory';
      case 'students': return 'Student Bus Allocation';
      case 'attendance': return 'Daily Attendance Board';
      case 'telematics': return 'Fleet Telematics & Security';
      case 'notifications': return 'FCM Push & Announcements';
      case 'child-info': return 'Student Transport Details';
      case 'today-attendance': return 'Daily Attendance Declaration';
      case 'child-attendance': return 'Attendance Logs';
      case 'my-schedule': return 'Daily Driver Route Summary';
      case 'student-list': return 'Student Passengers';
      case 'users': return 'System User & Role Control';
      case 'analytics': return 'Transport Analytics';
      case 'database': return 'Database Control';
      default: return 'Dashboard';
    }
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'overview': return 'Real-time overview of fleet operations and alerts';
      case 'notifications': return 'Send and manage FCM push alerts & announcements';
      default: return `Logged in as ${user?.name || ''} (${user?.role || ''})`;
    }
  };

  // ── Role-based dashboard renderer ─────────────────────────
  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Transport Head':
        return <TransportHeadDashboard activeTab={activeTab} user={user} />;
      case 'Parent':
        return <ParentDashboard activeTab={activeTab} user={user} />;
      case 'Driver':
        return <DriverDashboard activeTab={activeTab} user={user} />;
      case 'Super Admin':
        return <SuperAdminDashboard activeTab={activeTab} />;
      default:
        return null;
    }
  };

  // ── Unauthenticated ───────────────────────────────────────
  if (!user || !token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // ── Authenticated layout ──────────────────────────────────
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="bg-gradient-glow" />
        <div className="bg-gradient-glow-2" />

        <header className="header-container">
          <div className="header-title-section">
            <h1>{getHeaderTitle()}</h1>
            <p>{getHeaderSubtitle()}</p>
          </div>
          <div className="header-actions">
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
              Academic Session 2026-27
            </span>
            <NotificationBell />
          </div>
        </header>

        {renderDashboard()}
      </main>
    </div>
  );
};

// ── Root (provides Toast & Notification contexts) ─────────────
const App: React.FC = () => (
  <ToastProvider>
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  </ToastProvider>
);

export default App;
