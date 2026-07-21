// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { 
  Bus, Users, MapPin, ClipboardList, Bell, Shield, 
  LogOut, Menu, X, Calendar, UserCheck, Settings, Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    email: string;
    name: string;
    role: string;
    employeeId?: string;
    studentId?: string;
  };
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Define navigation based on roles
  const getNavItems = () => {
    switch (user.role) {
      case 'Transport Head':
        return [
          { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
          { id: 'vehicles', label: 'Vehicle Management', icon: <Bus size={18} /> },
          { id: 'routes', label: 'Route & Stops', icon: <MapPin size={18} /> },
          { id: 'drivers', label: 'Driver Management', icon: <Users size={18} /> },
          { id: 'students', label: 'Student Allocation', icon: <ClipboardList size={18} /> },
          { id: 'attendance', label: 'Attendance Board', icon: <UserCheck size={18} /> },
          { id: 'telematics', label: 'Fleet Telematics & Security', icon: <Shield size={18} /> },
          { id: 'notifications', label: 'Announcements', icon: <Bell size={18} /> },
        ];
      case 'Parent':
        return [
          { id: 'child-info', label: 'My Child Info', icon: <Users size={18} /> },
          { id: 'today-attendance', label: 'Mark Attendance', icon: <UserCheck size={18} style={{ color: '#10b981' }} /> },
          { id: 'child-attendance', label: 'Attendance Logs', icon: <ClipboardList size={18} /> },
          { id: 'notifications', label: 'Announcements', icon: <Bell size={18} /> },
        ];
      case 'Driver':
        return [
          { id: 'my-schedule', label: 'Daily Route Summary', icon: <Calendar size={18} /> },
          { id: 'student-list', label: 'Student Passengers', icon: <Users size={18} /> },
        ];
      case 'Super Admin':
        return [
          { id: 'users', label: 'User & Roles', icon: <Shield size={18} /> },
          { id: 'students', label: 'Student Directory', icon: <ClipboardList size={18} /> },
          { id: 'attendance', label: 'Attendance Overview', icon: <UserCheck size={18} /> },
          { id: 'analytics', label: 'Analytics dashboard', icon: <Home size={18} /> },
          { id: 'database', label: 'System Control', icon: <Settings size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Avatar initials and color
  const getAvatarInitials = () => {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = () => {
    switch (user.role) {
      case 'Transport Head': return '#2563eb'; // Royal Blue
      case 'Parent': return '#7c3aed'; // Purple
      case 'Driver': return '#10b981'; // Emerald Green
      case 'Super Admin': return '#0f172a'; // Slate Navy
      default: return '#64748b';
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="mobile-top-bar-brand">
          <img src="/transcend-logo.png" alt="Transcend Logo" style={{ height: '36px', objectFit: 'contain' }} />
        </div>
        <div style={{ width: 24 }}></div> {/* spacer */}
      </div>

      {/* Sidebar Backdrop for Mobile */}
      <div 
        className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Sidebar Component */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/transcend-logo.png" alt="Transcend Logo" style={{ maxHeight: '48px', objectFit: 'contain' }} />
        </div>

        <div className="sidebar-profile">
          <div 
            className="profile-avatar" 
            style={{ backgroundColor: getAvatarColor() }}
          >
            {getAvatarInitials()}
          </div>
          <div className="profile-info">
            <span className="profile-name" title={user.name}>{user.name}</span>
            <span className="profile-role">{user.role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
