import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, AlertTriangle, ShieldAlert, Info, Clock, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Emergency':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700,
            background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5'
          }}>
            <ShieldAlert size={11} /> Emergency
          </span>
        );
      case 'Important':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700,
            background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d'
          }}>
            <AlertTriangle size={11} /> Important
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
            background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe'
          }}>
            <Info size={11} /> Normal
          </span>
        );
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        style={{
          position: 'relative',
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#ef4444',
              color: 'white',
              fontSize: 11,
              fontWeight: 800,
              borderRadius: '50%',
              minWidth: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 0,
            width: 360,
            maxWidth: '90vw',
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.18)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={16} color="var(--primary)" />
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Notifications
              </h4>
            </div>
            {unreadCount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: 'var(--primary)', background: 'var(--primary-glow)',
                padding: '2px 8px', borderRadius: 10
              }}>
                {unreadCount} new
              </span>
            )}
          </div>

          {/* List Body */}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCheck size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>No notifications yet</p>
                <p style={{ margin: '4px 0 0', fontSize: 11 }}>You're all caught up!</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: item.isRead ? 'white' : '#f0f9ff',
                    cursor: item.isRead ? 'default' : 'pointer',
                    transition: 'background 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {!item.isRead && (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                      )}
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: item.isRead ? 600 : 700, color: 'var(--text-primary)' }}>
                        {item.title}
                      </h5>
                    </div>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <p style={{ margin: '4px 0 6px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.body || item.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {formatTime(item.createdAt || item.date)}
                    </span>
                    {!item.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        style={{
                          background: 'none', border: 'none', color: 'var(--primary)',
                          fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                        }}
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
