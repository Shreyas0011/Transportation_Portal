// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Login } from './pages/auth/Login';
import { Sidebar } from './components/Sidebar';
import { TransportHeadDashboard } from './pages/head/Dashboard';
import { ParentDashboard } from './pages/parent/Dashboard';
import { DriverDashboard } from './pages/driver/Dashboard';
import { SuperAdminDashboard } from './pages/superadmin/Dashboard';
import { initLocalStorageDB } from './utils/db';

interface UserSession {
  email: string;
  name: string;
  role: 'Transport Head' | 'Parent' | 'Driver' | 'Super Admin';
  studentId?: string;
  employeeId?: string;
}

const AppContent: React.FC = () => {
  const toast = useToast();
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Initialize DB and restore session on mount
  useEffect(() => {
    initLocalStorageDB();
    const storedUser = localStorage.getItem('transport_user');
    const storedToken = localStorage.getItem('transport_token');
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      
      // Set default tab based on role
      setDefaultTab(parsedUser.role);
    }
  }, []);

  const setDefaultTab = (role: string) => {
    if (role === 'Transport Head') {
      setActiveTab('overview');
    } else if (role === 'Parent') {
      setActiveTab('child-info');
    } else if (role === 'Driver') {
      setActiveTab('my-schedule');
    } else if (role === 'Super Admin') {
      setActiveTab('users');
    }
  };

  const handleLoginSuccess = (loggedInUser: UserSession, accessToken: string) => {
    localStorage.setItem('transport_user', JSON.stringify(loggedInUser));
    localStorage.setItem('transport_token', accessToken);
    setUser(loggedInUser);
    setToken(accessToken);
    setDefaultTab(loggedInUser.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('transport_user');
    localStorage.removeItem('transport_token');
    setUser(null);
    setToken(null);
    toast.info('Logged out from Transcend Transport Portal.');
  };

  // Render proper dashboard component
  const renderDashboardContent = () => {
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

  // Dynamic Header Title & Subtitle helper
  const getHeaderTitle = () => {
    if (!user) return '';
    switch (user.role) {
      case 'Transport Head':
        return 'Fleet Operator Control Center';
      case 'Parent':
        return 'Parent Transport Console';
      case 'Driver':
        return 'Driver Duty Console';
      case 'Super Admin':
        return 'System Database & Root Control';
      default:
        return 'Institutional Transport Portal';
    }
  };

  const getHeaderSubtitle = () => {
    if (!user) return '';
    switch (user.role) {
      case 'Transport Head':
        return 'Manage institutional buses, routes, drivers, stops, and student allocations.';
      case 'Parent':
        return 'Monitor child bus schedules, passenger timings, and alerts.';
      case 'Driver':
        return 'View assigned schedules, passenger sheets, and route sequences.';
      case 'Super Admin':
        return 'Configure staff/parent users, analyze route utilization, and storage controls.';
      default:
        return '';
    }
  };

  // 1. Unauthenticated State
  if (!user || !token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Authenticated State
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Workspace Area */}
      <main className="main-content">
        <div className="bg-gradient-glow"></div>
        <div className="bg-gradient-glow-2"></div>

        {/* Dashboard Title Header */}
        <header className="header-container">
          <div className="header-title-section">
            <h1>{getHeaderTitle()}</h1>
            <p>{getHeaderSubtitle()}</p>
          </div>
          <div className="header-actions">
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
              Academic Session 2026-27
            </span>
          </div>
        </header>

        {/* Role Specific Page Tab Content */}
        {renderDashboardContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
