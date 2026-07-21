import React, { useState, useEffect } from 'react';
import { Send, Bell, ShieldAlert, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { dbService } from '../../utils/db';
import { useToast } from '../../components/Toast';

export const AdminNotifications: React.FC = () => {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipientType, setRecipientType] = useState<'All' | 'Students' | 'Parents' | 'User' | 'Route' | 'Bus'>('All');
  const [recipientId, setRecipientId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [busId, setBusId] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Emergency'>('Normal');
  const [type, setType] = useState<string>('General');
  const [sending, setSending] = useState(false);

  // Dropdown option data from DB/API
  const [routes, setRoutes] = useState<{ id: string; routeName: string }[]>([]);
  const [buses, setBuses] = useState<{ id: string; vehicleNumber: string }[]>([]);

  useEffect(() => {
    try {
      const fetchedRoutes = dbService.getRoutes();
      const fetchedVehicles = dbService.getVehicles();
      setRoutes(fetchedRoutes.map((r) => ({ id: r.routeName, routeName: r.routeName })));
      setBuses(fetchedVehicles.map((v) => ({ id: v.vehicleNumber, vehicleNumber: v.vehicleNumber })));
    } catch (err) {
      console.warn('[AdminNotifications] Error loading routes/vehicles:', err);
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error('Please enter both Title and Notification Message.');
      return;
    }

    setSending(true);

    try {
      const payload = {
        title,
        body,
        recipientType,
        recipientId: recipientType === 'User' ? recipientId : undefined,
        routeId: recipientType === 'Route' ? routeId : undefined,
        busId: recipientType === 'Bus' ? busId : undefined,
        priority,
        type
      };

      await transportApi.sendNotification(payload);

      toast.success(`Push notification sent successfully to ${recipientType}!`);
      setTitle('');
      setBody('');
    } catch (err: any) {
      toast.error(`Failed to send push notification: ${err.message || 'Server error'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Bell size={20} color="var(--primary)" />
          <span>FCM Push Notification Broadcast Center</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Real-time FCM Push & In-App Alerts
        </span>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="form-grid">
          {/* Notification Title */}
          <div className="form-group">
            <label className="form-label">Notification Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Route 04 Bus Delay Notice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Notification Type */}
          <div className="form-group">
            <label className="form-label">Notification Category</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="General">General Announcement</option>
              <option value="Bus Delay">Bus Delay Notice</option>
              <option value="Arrival">Bus Arrival Alert</option>
              <option value="Departure">Bus Departure Alert</option>
              <option value="Fee Reminder">Transport Fee Reminder</option>
              <option value="Emergency">Emergency Safety Alert</option>
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="form-group">
          <label className="form-label">Broadcast Priority</label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { val: 'Normal', label: 'Normal', icon: <Info size={16} />, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
              { val: 'Important', label: 'Important', icon: <AlertTriangle size={16} />, color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
              { val: 'Emergency', label: 'Emergency', icon: <ShieldAlert size={16} />, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setPriority(p.val as any)}
                style={{
                  flex: 1, minWidth: 120,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: priority === p.val ? p.bg : 'white',
                  color: priority === p.val ? p.color : 'var(--text-secondary)',
                  border: `2px solid ${priority === p.val ? p.color : '#cbd5e1'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Recipient Selector */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Target Audience / Recipient</label>
            <select
              className="form-select"
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as any)}
            >
              <option value="All">All Users (Broadcast)</option>
              <option value="Students">All Students</option>
              <option value="Parents">All Parents</option>
              <option value="Route">Specific Route</option>
              <option value="Bus">Specific Vehicle / Bus</option>
              <option value="User">Specific User Email / ID</option>
            </select>
          </div>

          {/* Conditional Recipient Inputs */}
          {recipientType === 'Route' && (
            <div className="form-group">
              <label className="form-label">Select Route</label>
              <select className="form-select" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                <option value="">-- Select Route --</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>{r.routeName}</option>
                ))}
              </select>
            </div>
          )}

          {recipientType === 'Bus' && (
            <div className="form-group">
              <label className="form-label">Select Bus / Vehicle</label>
              <select className="form-select" value={busId} onChange={(e) => setBusId(e.target.value)}>
                <option value="">-- Select Bus --</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>{b.vehicleNumber}</option>
                ))}
              </select>
            </div>
          )}

          {recipientType === 'User' && (
            <div className="form-group">
              <label className="form-label">User Email / Student ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. parent3001@transcend.org or 251P3001"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notification Body Message */}
        <div className="form-group">
          <label className="form-label">Notification Message Body *</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Type your push notification message details here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        {/* Submit Actions */}
        <div className="form-actions" style={{ marginTop: 8 }}>
          <button
            type="submit"
            className="btn-submit"
            disabled={sending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', fontSize: 14, fontWeight: 700
            }}
          >
            {sending ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Sending FCM Push...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Push Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
