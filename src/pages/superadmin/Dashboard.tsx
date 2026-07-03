// src/pages/superadmin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Shield, RefreshCw, ShieldAlert, PieChart, X, BarChart3, ClipboardList, UserCheck
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { User, Vehicle, Route, Student, Attendance } from '../../utils/db';

interface SuperAdminDashboardProps {
  activeTab: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // States
  const [usersList, setUsersList] = useState<Omit<User, 'password'>[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Attendance filter state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceBusFilter, setAttendanceBusFilter] = useState('');
  const [attendanceRouteFilter, setAttendanceRouteFilter] = useState('');

  // Dialog & Modal state
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; email: string }>({
    open: false,
    email: '',
  });

  const [modalOpen, setModalOpen] = useState<{ open: boolean; type: 'user'; email?: string }>({
    open: false,
    type: 'user',
  });

  // Role selections for parent mapping
  const [selectedRole, setSelectedRole] = useState<'Transport Head' | 'Parent' | 'Driver' | 'Super Admin'>('Parent');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uData, vData, rData, sData, aData] = await Promise.all([
        transportApi.getUsers(),
        transportApi.getVehicles(),
        transportApi.getRoutes(),
        transportApi.getStudents(),
        transportApi.getAttendance(),
      ]);
      setUsersList(uData);
      setVehicles(vData);
      setRoutes(rData);
      setStudents(sData);
      setAttendance(aData);
    } catch (err: any) {
      toast.error('Failed to retrieve system database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  // Actions: User creation
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as User['role'];
    const employeeId = formData.get('employeeId') as string;
    const studentId = formData.get('studentId') as string;

    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }

    const payload: User = {
      name,
      email,
      role,
      isActive: true,
      employeeId: role !== 'Parent' ? employeeId : undefined,
      studentId: role === 'Parent' ? studentId : undefined,
    };

    setLoading(true);
    try {
      await transportApi.createUser(payload);
      toast.success(`User account for ${name} registered successfully`);
      setModalOpen({ open: false, type: 'user' });
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actions: Toggle status
  const handleToggleUserStatus = async (email: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      await transportApi.toggleUserStatus(email, !currentStatus);
      toast.success(`Account status for ${email} modified`);
      fetchAdminData();
    } catch (err: any) {
      toast.error('Failed to change user status');
    } finally {
      setLoading(false);
    }
  };

  // Actions: Deletion trigger
  const executeUserDelete = async () => {
    const email = confirmDelete.email;
    setConfirmDelete({ open: false, email: '' });
    setLoading(true);
    try {
      await transportApi.deleteUser(email);
      toast.success(`User ${email} deleted from database`);
      fetchAdminData();
    } catch (err: any) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Action: Hard reset database
  const executeReseed = () => {
    setLoading(true);
    localStorage.removeItem('transport_db_version');
    localStorage.removeItem('transport_users');
    localStorage.removeItem('transport_vehicles');
    localStorage.removeItem('transport_drivers');
    localStorage.removeItem('transport_routes');
    localStorage.removeItem('transport_students');
    localStorage.removeItem('transport_notifications');
    localStorage.removeItem('transport_attendance');
    
    toast.success('Database reseeded to defaults');
    setTimeout(() => {
      fetchAdminData();
      setLoading(false);
    }, 500);
  };

  const filteredUsers = usersList.filter((u) => {
    return u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- ANALYTICS CALCULATIONS ---
  // 1. Vehicle status counts
  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'Under Maintenance').length;
  const inactiveVehicles = vehicles.filter((v) => v.status === 'Inactive').length;
  const totalVehiclesCount = vehicles.length || 1; // avoid divide by zero

  // SVG pie/donut segments coordinates
  // Circle perimeter = 2 * PI * r = 2 * 3.14159 * 50 = 314
  const activePct = (activeVehicles / totalVehiclesCount) * 314;
  const maintPct = (maintenanceVehicles / totalVehiclesCount) * 314;
  const inactivePct = (inactiveVehicles / totalVehiclesCount) * 314;

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the user account (${confirmDelete.email})? This action cannot be undone.`}
        onConfirm={executeUserDelete}
        onCancel={() => setConfirmDelete({ open: false, email: '' })}
      />

      {/* ── USER MANAGEMENT TAB ── */}
      {activeTab === 'users' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-add"
              onClick={() => {
                setSelectedRole('Parent');
                setModalOpen({ open: true, type: 'user' });
              }}
            >
              <Plus size={18} />
              <span>Create User</span>
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User Profile Name</th>
                  <th>Registered Email</th>
                  <th>Assigned Role</th>
                  <th>Staff / Parent ID</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No user accounts found matching parameters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.email}>
                      <td style={{ fontWeight: 700 }}>{u.name}</td>
                      <td style={{ fontWeight: 500 }}>{u.email}</td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>
                        {u.role === 'Parent' ? u.studentId : u.employeeId || '-'}
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'Active' : 'Inactive'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-action-group">

                          <button
                            className={`btn-icon ${u.isActive ? 'delete' : 'edit'}`}
                            title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                            onClick={() => handleToggleUserStatus(u.email, u.isActive)}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            className="btn-icon delete"
                            title="Delete Account"
                            onClick={() => setConfirmDelete({ open: true, email: u.email })}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* User Form Modal */}
          {modalOpen.open && modalOpen.type === 'user' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create User Account</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: 'user' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleUserSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          name="name"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Ramesh Nair"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          name="email"
                          type="email"
                          className="form-input"
                          placeholder="e.g. ramesh@transcend.org"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assigned Role</label>
                        <select
                          name="role"
                          className="form-select"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as any)}
                        >
                          <option value="Parent">Parent</option>
                          <option value="Driver">Driver</option>
                          <option value="Transport Head">Transport Head</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>

                      {/* Staff Specific Fields */}
                      {selectedRole !== 'Parent' && (
                        <div className="form-group form-group-full">
                          <label className="form-label">Employee ID</label>
                          <input
                            name="employeeId"
                            type="text"
                            className="form-input"
                            placeholder="e.g. EMP-DRV-101"
                          />
                        </div>
                      )}

                      {/* Parent Specific Fields */}
                      {selectedRole === 'Parent' && (
                        <div className="form-group form-group-full">
                          <label className="form-label">Linked Student ID</label>
                          <input
                            name="studentId"
                            type="text"
                            className="form-input"
                            placeholder="e.g. STU001"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: 'user' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ANALYTICS DASHBOARD TAB ── */}
      {activeTab === 'analytics' && (() => {
        // Calculate route utilization: students per route
        const routeUtilization = routes.map((r) => {
          const studentCount = students.filter((s) => s.route === r.routeName).length;
          return {
            routeName: r.routeName,
            count: studentCount,
          };
        });
        const maxRouteCount = Math.max(...routeUtilization.map((u) => u.count), 1);

        return (
          <div className="analytics-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Pie chart */}
            <div className="chart-card" style={{ width: '100%', margin: '0' }}>
              <h3 className="chart-header">
                <PieChart size={18} />
                <span>Vehicle Fleet Operations status</span>
              </h3>
              <div className="chart-body">
                <svg className="visual-pie-chart" viewBox="0 0 120 120">
                  {/* Active Vehicles circle segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray={`${activePct} 314`}
                    strokeDashoffset="0"
                  />
                  {/* Maintenance Vehicles circle segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray={`${maintPct} 314`}
                    strokeDashoffset={`-${activePct}`}
                  />
                  {/* Inactive circle segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="14"
                    strokeDasharray={`${inactivePct} 314`}
                    strokeDashoffset={`-${activePct + maintPct}`}
                  />
                </svg>
                
                <div className="pie-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                    <span>Active ({activeVehicles})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span>Maintenance ({maintenanceVehicles})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                    <span>Inactive ({inactiveVehicles})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Utilization Bar Chart */}
            <div className="chart-card" style={{ width: '100%', margin: '0' }}>
              <h3 className="chart-header">
                <BarChart3 size={18} />
                <span>Institutional Route Utilization</span>
              </h3>
              <div className="chart-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                {routeUtilization.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No routes registered in the system.</div>
                ) : (
                  routeUtilization.map((item) => {
                    const percentage = (item.count / maxRouteCount) * 100;
                    return (
                      <div key={item.routeName} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                          <span style={{ color: '#334155' }}>{item.routeName}</span>
                          <span style={{ color: '#2563eb' }}>{item.count} Wards Allocated</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '5px', transition: 'width 0.5s ease-out' }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── STUDENT DIRECTORY TAB ── */}
      {activeTab === 'students' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <ClipboardList size={18} />
              <span>Student Passengers Directory ({students.length})</span>
            </h2>
          </div>
          
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Assigned Route</th>
                  <th>Assigned Bus</th>
                  <th>Pickup Stop</th>
                  <th>Drop Stop</th>
                  <th>Parent Contact</th>
                  <th>Health & Medical Info</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = students.filter(s => 
                    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                          No student records found matching search.
                        </td>
                      </tr>
                    );
                  }
                  return filtered.map((s) => (
                    <tr key={s.studentId}>
                      <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{s.route === 'None' ? '-' : s.route}</td>
                      <td style={{ fontWeight: 600 }}>{s.bus === 'None' ? '-' : s.bus}</td>
                      <td>{s.pickupStop === 'None' ? '-' : s.pickupStop}</td>
                      <td>{s.dropStop === 'None' ? '-' : s.dropStop}</td>
                      <td>{s.parentContact}</td>
                      <td>
                        {s.healthRecord || 'None'}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SYSTEM-WIDE HEALTH RECORDS TAB ── */}
      {activeTab === 'health' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>Student Health Records</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div className="search-filter-container">
              <div style={{ flexGrow: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                  This dashboard consolidates medical records and health complications across all student users in the database.
                </p>
              </div>
              <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Assigned Route</th>
                    <th>Assigned Bus</th>
                    <th>Pickup Stop</th>
                    <th>Drop Stop</th>
                    <th>Parent Contact</th>
                    <th>Medical Complication Record</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const complications = students.filter(
                      (s) => s.healthRecord && s.healthRecord.trim() !== '' && s.healthRecord.toLowerCase() !== 'none'
                    );
                    const filtered = complications.filter(
                      (s) =>
                        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                            No active health complications found in the system matching search.
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((s) => (
                      <tr key={s.studentId}>
                        <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                        <td style={{ fontWeight: 600, color: '#2563eb' }}>{s.route === 'None' ? '-' : s.route}</td>
                        <td style={{ fontWeight: 600 }}>{s.bus === 'None' ? '-' : s.bus}</td>
                        <td>{s.pickupStop === 'None' ? '-' : s.pickupStop}</td>
                        <td>{s.dropStop === 'None' ? '-' : s.dropStop}</td>
                        <td>{s.parentContact}</td>
                        <td style={{ color: '#991b1b', fontWeight: 600 }}>
                          {s.healthRecord}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE OVERVIEW TAB ── */}
      {activeTab === 'attendance' && (() => {
        const filteredAttendance = attendance.filter((a) => {
          const matchDate = attendanceDate ? a.date === attendanceDate : true;
          const matchBus = attendanceBusFilter ? a.bus === attendanceBusFilter : true;
          const matchRoute = attendanceRouteFilter ? a.route === attendanceRouteFilter : true;
          return matchDate && matchBus && matchRoute;
        });

        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecords = attendance.filter(a => a.date === attendanceDate);
        const presentCount = todayRecords.filter(a => a.status !== 'Absent').length;
        const absentCount = todayRecords.filter(a => a.status === 'Absent').length;

        return (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="stat-card">
                <div className="stat-icon success"><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Present Today</span>
                  <span className="stat-value">{presentCount} Students</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Absent Today</span>
                  <span className="stat-value">{absentCount} Students</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Total Logged</span>
                  <span className="stat-value">{todayRecords.length} Records</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="search-filter-container" style={{ marginBottom: '12px' }}>
              <div className="filters-group" style={{ flexGrow: 1, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Date</label>
                  <input
                    type="date"
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Route</label>
                  <select className="filter-select" style={{ width: '100%' }} value={attendanceRouteFilter} onChange={(e) => setAttendanceRouteFilter(e.target.value)}>
                    <option value="">All Routes</option>
                    {routes.map((r) => <option key={r.routeName} value={r.routeName}>{r.routeName}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Bus</label>
                  <select className="filter-select" style={{ width: '100%' }} value={attendanceBusFilter} onChange={(e) => setAttendanceBusFilter(e.target.value)}>
                    <option value="">All Buses</option>
                    {vehicles.map((v) => <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Route</th>
                    <th>Bus Plate</th>
                    <th>Parent-Set Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                        No attendance records found for the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((a) => (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 600 }}>{a.date}</td>
                          <td style={{ fontWeight: 700 }}>{a.studentName}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.studentId}</td>
                          <td style={{ fontWeight: 600, color: '#2563eb' }}>{a.route || '-'}</td>
                          <td style={{ fontWeight: 600 }}>{a.bus}</td>
                          <td>
                            <span className={`badge ${a.status === 'Absent' ? 'absent' : a.status === 'Dropped' ? 'info' : 'active'}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* ── DATABASE SYSTEM CONTROL TAB ── */}
      {activeTab === 'database' && (
        <div className="dashboard-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="panel-header" style={{ borderBottomColor: '#fca5a5' }}>
            <h2 className="panel-title" style={{ color: '#ef4444' }}>
              <ShieldAlert size={20} />
              <span>System Integrity & Storage Control</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              Warning: Resetting the database will restore all users, routes, buses, and student assignments to their default seeded state. This will erase any new records added during this test session.
            </p>
            <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldAlert size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', display: 'block' }}>DANGER ZONE</span>
                <span style={{ fontSize: '12px', color: '#b91c1c' }}>This operation will flush and re-initialize localStorage tables immediately.</span>
              </div>
            </div>
            <button 
              className="btn-danger" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              onClick={executeReseed}
            >
              <RefreshCw size={16} />
              <span>Reseed LocalStorage Database</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SuperAdminDashboard;
