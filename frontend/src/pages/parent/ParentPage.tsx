// src/pages/parent/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bus, Calendar, Phone, AlertCircle, Edit2, Shield, FileText, Activity, UserCheck, Clock
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import type { Vehicle, Driver, Student, Attendance, Notification, Route } from '../../utils/db';

interface ParentDashboardProps {
  activeTab: string;
  user: {
    email: string;
    name: string;
    role: string;
    studentId?: string;
    employeeId?: string;
  };
}

const parseHealthRecord = (record: string) => {
  const lines = record.split('\n');
  let conditions = '';
  let instructions = '';
  let contact = '';
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('Conditions:')) {
      conditions = line.substring('Conditions:'.length).trim();
      currentSection = 'conditions';
    } else if (line.startsWith('Instructions:')) {
      instructions = line.substring('Instructions:'.length).trim();
      currentSection = 'instructions';
    } else if (line.startsWith('Emergency Contact:')) {
      contact = line.substring('Emergency Contact:'.length).trim();
      currentSection = 'contact';
    } else {
      if (currentSection === 'conditions') {
        conditions += (conditions ? '\n' : '') + line;
      } else if (currentSection === 'instructions') {
        instructions += (instructions ? '\n' : '') + line;
      } else if (currentSection === 'contact') {
        contact += (contact ? '\n' : '') + line;
      } else {
        conditions += (conditions ? '\n' : '') + line;
      }
    }
  }

  // Fallback for simple raw string records
  if (!conditions && !instructions && !contact && record.trim()) {
    conditions = record.trim();
  }

  return { conditions, instructions, contact };
};

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ activeTab, user }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // States
  const [student, setStudent] = useState<Student | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthConditions, setHealthConditions] = useState('');
  const [healthInstructions, setHealthInstructions] = useState('');
  const [healthContact, setHealthContact] = useState('');

  // Attendance marking state
  const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  const handleSaveHealth = async () => {
    if (!student) return;
    setLoading(true);
    const combinedText = [
      healthConditions.trim() ? `Conditions: ${healthConditions.trim()}` : '',
      healthInstructions.trim() ? `Instructions: ${healthInstructions.trim()}` : '',
      healthContact.trim() ? `Emergency Contact: ${healthContact.trim()}` : ''
    ].filter(Boolean).join('\n');

    try {
      const updated = await transportApi.updateStudent({
        ...student,
        healthRecord: combinedText,
      });
      setStudent(updated);
      setIsEditingHealth(false);
      toast.success('Student health records updated successfully.');
    } catch (err) {
      toast.error('Failed to update student health records.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendanceForDate = async (dateStr: string, status: 'Present' | 'Absent', customDropTime?: string) => {
    if (!student) return;
    setSubmittingAttendance(true);
    const recordId = `ATT-${student.studentId}-${dateStr}`;

    const existingRec = attendance.find((a) => a.id === recordId);
    
    let dropTimeVal = undefined;
    if (status === 'Present') {
      if (customDropTime) {
        dropTimeVal = customDropTime;
      } else {
        const targetDate = new Date(dateStr + 'T00:00:00');
        const dayOfWeek = targetDate.getDay();
        dropTimeVal = existingRec?.dropOffTime || (dayOfWeek === 6 ? '12:30 PM' : '3:30 PM');
      }
    }

    const record: Attendance = {
      id: recordId,
      date: dateStr,
      studentId: student.studentId,
      studentName: student.studentName,
      route: student.route,
      bus: student.bus,
      status: status === 'Absent' ? 'Absent' : 'Present',
      parentDeclaration: status,
      updatedBy: 'Parent',
      accountabilityStatus: existingRec?.accountabilityStatus || undefined,
      accountabilityNote: existingRec?.accountabilityNote || undefined,
      dropOffTime: dropTimeVal
    };

    try {
      await transportApi.saveAttendance(record);
      // Refresh attendance list
      const updated = await transportApi.getAttendance();
      const childAtt = updated.filter((a) => a.studentId === student.studentId);
      childAtt.sort((a, b) => b.date.localeCompare(a.date));
      setAttendance(childAtt);
      
      // Update todayRecord if this was today's attendance
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateStr === todayStr) {
        setTodayRecord(record);
      }
      
      toast.success(`Ward attendance updated successfully.`);
    } catch (err) {
      toast.error('Failed to update attendance. Please try again.');
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const handleSelectDropTimeForDate = async (dateStr: string, time: string) => {
    await handleMarkAttendanceForDate(dateStr, 'Present', time);
  };

  const getDropTimeOptions = (day: number) => {
    if (day === 6) {
      return ['12:30 PM', '3:30 PM', '5:30 PM'];
    }
    return ['3:30 PM', '5:30 PM'];
  };

  const getWeekDays = () => {
    const current = new Date();
    const day = current.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    
    // Find Monday's date
    const distanceToMonday = day === 0 ? 1 : 1 - day;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);
    
    const days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayName: dayNames[i],
        dayOfWeek: i + 1, // 1 = Mon, ..., 6 = Sat
        displayDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
    return days;
  };

  const loadParentData = async () => {
    if (!user.studentId) {
      toast.error('No linked student found for this parent account.');
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch Students
      const studentsList = await transportApi.getStudents();
      const child = studentsList.find((s) => s.studentId === user.studentId);
      if (!child) {
        toast.warning('Your child is not registered in the student directory.');
        setLoading(false);
        return;
      }
      setStudent(child);
      
      const parsed = parseHealthRecord(child.healthRecord || '');
      setHealthConditions(parsed.conditions);
      setHealthInstructions(parsed.instructions);
      setHealthContact(parsed.contact);

      // Fetch other resources in parallel
      const [vehiclesList, driversList, attendanceList, notificationsList, routesList] = await Promise.all([
        transportApi.getVehicles(),
        transportApi.getDrivers(),
        transportApi.getAttendance(),
        transportApi.getNotifications(),
        transportApi.getRoutes(),
      ]);

      // Resolve Route
      if (child.route !== 'None') {
        const childRoute = routesList.find((r) => r.routeName === child.route);
        if (childRoute) setRoute(childRoute);
      }

      // Filter child's attendance
      const childAttendance = attendanceList.filter((a) => a.studentId === child.studentId);
      // Sort attendance by date desc
      childAttendance.sort((a, b) => b.date.localeCompare(a.date));
      setAttendance(childAttendance);

      // Detect today's attendance status set by parent
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = childAttendance.find((a) => a.date === todayStr);
      setTodayRecord(todayRec || null);

      // Set notifications
      setNotifications(notificationsList);

      if (child.bus !== 'None') {
        const childBus = vehiclesList.find((v) => v.vehicleNumber === child.bus);
        if (childBus) {
          setVehicle(childBus);
          
          // Match driver assigned to this vehicle
          const busDriver = driversList.find((d) => d.name === childBus.driverAssigned);
          if (busDriver) setDriver(busDriver);
        }
      }
    } catch (err: any) {
      toast.error('Failed to load child transit information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParentData();
  }, [user.studentId]);

  if (loading && !student) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* ── CHILD TRANSIT INFORMATION TAB ── */}
      {activeTab === 'child-info' && (
        <div className="parent-grid">
          {/* Main details card */}
          <div className="dashboard-panel" style={{ gridColumn: 'span 2' }}>
            <div className="panel-header">
              <h2 className="panel-title">
                <Bus size={18} />
                <span>Student Ward: {student?.studentName} ({student?.studentId})</span>
              </h2>
              <span className={`badge ${student?.bus !== 'None' ? 'active' : 'inactive'}`}>
                {student?.bus !== 'None' ? 'Transport Active' : 'No Allocation'}
              </span>
            </div>

          {student?.bus === 'None' ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
              <h3>No Bus Allocation Found</h3>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                Your ward is currently not allocated to any bus. Please contact the Transport Department (head@transcend.org) to request a bus allocation.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Bus and Driver detail */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#eab308', display: 'block', marginBottom: '16px', letterSpacing: '0.8px' }}>
                  VEHICLE & OPERATOR
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Assigned Vehicle</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{vehicle?.vehicleNumber}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{vehicle?.vehicleModel}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Driver Name</span>
                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{driver?.name || 'Assigned Operator'}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>ID: {driver?.employeeId}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Driver Contact Number</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>
                      <Phone size={16} />
                      <span>{driver?.phone || '+91 99000 11000'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route & Stop Assignments */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '16px', letterSpacing: '0.8px' }}>
                  ROUTE & STOP DETAILS
                </span>
                {route ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Assigned Route</span>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{route.routeName}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{route.startingPoint} → {route.destination}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Pickup Stop</span>
                      <strong style={{ fontSize: '15px', color: '#10b981' }}>{student?.pickupStop || 'Main Depot'}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                        Estimated Arrival: {route.stops.find(s => s.stopName.trim().toLowerCase() === (student?.pickupStop || '').trim().toLowerCase() || s.stopName.toLowerCase().includes((student?.pickupStop || '').toLowerCase()))?.arrivalTime || '07:40 AM'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Dropoff Stop</span>
                      <strong style={{ fontSize: '15px', color: '#2563eb' }}>{student?.dropStop || 'Main Depot'}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                        Estimated Return: {route.stops.find(s => s.stopName.trim().toLowerCase() === (student?.dropStop || '').trim().toLowerCase() || s.stopName.toLowerCase().includes((student?.dropStop || '').toLowerCase()))?.dropTime || '04:45 PM'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '20px 0', color: '#64748b', fontSize: '13px' }}>
                    No route assignments found.
                  </div>
                )}
              </div>

              {/* Visual Stops Timeline */}
              {route && route.stops.length > 0 && (
                <div style={{ gridColumn: '1 / -1', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '20px', letterSpacing: '0.8px' }}>
                    DAILY ROUTE TIMELINE & STOPS
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative', paddingLeft: '24px' }}>
                    <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', background: '#cbd5e1' }}></div>
                    
                    {route.stops.map((stop, idx) => {
                      const cleanName = stop.stopName.trim().toLowerCase();
                      const cleanPickup = (student?.pickupStop || '').trim().toLowerCase();
                      const cleanDrop = (student?.dropStop || '').trim().toLowerCase();
                      const isPickup = cleanPickup !== '' && (cleanName === cleanPickup || cleanName.includes(cleanPickup) || cleanPickup.includes(cleanName));
                      const isDrop = cleanDrop !== '' && (cleanName === cleanDrop || cleanName.includes(cleanDrop) || cleanDrop.includes(cleanName));
                      const isTarget = isPickup || isDrop;
                      
                      return (
                        <div key={stop.stopName} style={{ display: 'flex', gap: '16px', marginBottom: idx === route.stops.length - 1 ? 0 : '20px', position: 'relative' }}>
                          <div style={{ 
                            position: 'absolute', 
                            left: '-23px', 
                            top: '5px', 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: isPickup ? '#10b981' : isDrop ? '#2563eb' : '#94a3b8', 
                            border: '2px solid white', 
                            boxShadow: isTarget ? `0 0 0 3px ${isPickup ? '#10b981' : '#2563eb'}` : '0 0 0 2px #cbd5e1'
                          }}></div>
                          
                          <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                                {stop.stopName}
                              </strong>
                              {isPickup && <span className="badge active" style={{ marginLeft: '8px', fontSize: '9px', padding: '2px 6px' }}>Pickup Stop</span>}
                              {isDrop && <span className="badge info" style={{ marginLeft: '8px', fontSize: '9px', padding: '2px 6px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>Drop Stop</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                              <div>
                                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: 700 }}>AM PICKUP</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>{stop.arrivalTime}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: 700 }}>PM DROPOFF</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>{stop.dropTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      )}

      {/* ── STUDENT HEALTH & MEDICAL DETAILS TAB ── */}
      {activeTab === 'health' && (
        <div className="dashboard-panel" style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0', padding: '30px' }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Student Safety
                </span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={10} style={{ fill: '#16a34a' }} /> Secured
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                Medical & Health Profile
              </h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                Ensure your ward's health records are up-to-date. This profile is immediately synced with driver logs.
              </p>
            </div>
            {!isEditingHealth && (
              <button
                onClick={() => {
                  setIsEditingHealth(true);
                  const parsed = parseHealthRecord(student?.healthRecord || '');
                  setHealthConditions(parsed.conditions);
                  setHealthInstructions(parsed.instructions);
                  setHealthContact(parsed.contact);
                }}
                className="btn-edit"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 16px', 
                  fontSize: '13px', 
                  fontWeight: 600,
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            )}
          </div>

          {isEditingHealth ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Conditions Form Card */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ background: '#fee2e2', color: '#ef4444', borderRadius: '8px', display: 'flex', padding: '6px' }}>
                        <Activity size={16} />
                      </div>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>1. Medical Conditions & Allergies</label>
                    </div>
                    <textarea
                      value={healthConditions}
                      onChange={(e) => setHealthConditions(e.target.value)}
                      placeholder="e.g. Asthma, Peanut allergy, Penicillin sensitivity. Write 'None' if none."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        lineHeight: 1.5
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                      List active diagnoses, allergies, or long-term chronic conditions.
                    </span>
                  </div>

                  {/* Contact Form Card */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ background: '#d1fae5', color: '#10b981', borderRadius: '8px', display: 'flex', padding: '6px' }}>
                        <Phone size={16} />
                      </div>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>3. Primary Physician / Emergency Contact</label>
                    </div>
                    <input
                      type="text"
                      value={healthContact}
                      onChange={(e) => setHealthContact(e.target.value)}
                      placeholder="e.g. Dr. Verma: +91 98800 12345"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                      Primary pediatrician or alternative family doctor.
                    </span>
                  </div>

                </div>

                {/* Instructions Form Card */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', display: 'flex', padding: '6px' }}>
                      <FileText size={16} />
                    </div>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>2. Emergency Action Plan / Instructions</label>
                  </div>
                  <textarea
                    value={healthInstructions}
                    onChange={(e) => setHealthInstructions(e.target.value)}
                    placeholder="e.g. Keep inhaler in side pocket of backpack. Help student take 2 puffs if short of breath."
                    style={{
                      width: '100%',
                      flexGrow: 1,
                      minHeight: '180px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit',
                      resize: 'none',
                      outline: 'none',
                      lineHeight: 1.5
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                    Actionable instructions for the bus driver and route supervisors.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button
                  onClick={() => {
                    setIsEditingHealth(false);
                    const parsed = parseHealthRecord(student?.healthRecord || '');
                    setHealthConditions(parsed.conditions);
                    setHealthInstructions(parsed.instructions);
                    setHealthContact(parsed.contact);
                  }}
                  className="btn-cancel"
                  style={{ padding: '10px 20px', fontSize: '13.5px', borderRadius: '8px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHealth}
                  className="btn-submit"
                  style={{ padding: '10px 20px', fontSize: '13.5px', borderRadius: '8px', fontWeight: 600, backgroundColor: '#10b981', color: '#ffffff', border: 'none' }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Left column details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: 'span 2' }}>
                
                {/* Conditions Preview Card */}
                <div style={{ background: '#ffffff', borderLeft: '4px solid #ef4444', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Activity size={16} style={{ color: '#ef4444' }} />
                    <strong style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Medical Conditions & Allergies
                    </strong>
                  </div>
                  <p style={{ fontSize: '15px', color: '#0f172a', margin: 0, fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {healthConditions || 'None reported'}
                  </p>
                </div>

                {/* Instructions Preview Card */}
                <div style={{ background: '#ffffff', borderLeft: '4px solid #3b82f6', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <FileText size={16} style={{ color: '#3b82f6' }} />
                    <strong style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Emergency Transit Instructions
                    </strong>
                  </div>
                  <p style={{ fontSize: '15px', color: '#0f172a', margin: 0, fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {healthInstructions || 'No custom emergency action plan / transit instructions provided.'}
                  </p>
                </div>

              </div>

              {/* Right column details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Doctor Preview Card */}
                <div style={{ background: '#ffffff', borderLeft: '4px solid #10b981', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Phone size={16} style={{ color: '#10b981' }} />
                    <strong style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Primary Pediatrician / Doctor
                    </strong>
                  </div>
                  <p style={{ fontSize: '15px', color: '#0f172a', margin: 0, fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {healthContact || 'None specified'}
                  </p>
                </div>

                {/* Info Disclaimer Card */}
                <div style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b' }}>
                    <Shield size={16} />
                    <strong style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Privacy & Security</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    This medical information is strictly confidential. It is only accessible to the assigned bus driver, transport staff, and school admins for safety reasons.
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* ── ATTENDANCE LOGS TAB ── */}
      {activeTab === 'child-attendance' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <Calendar size={18} />
              <span>Transit Attendance Log ({student?.studentName})</span>
            </h2>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Bus Number</th>
                  <th>Drop-off Option</th>
                  <th>Attendance status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No attendance entries logged.
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 700 }}>{record.date}</td>
                      <td style={{ fontWeight: 500 }}>{record.route}</td>
                      <td style={{ fontWeight: 600 }}>{record.bus}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{record.dropOffTime || '-'}</td>
                      <td>
                        <span className={`badge ${
                          record.status === 'Absent' ? 'absent'
                          : record.status === 'No-Show' ? 'danger'
                          : record.status === 'Boarded' ? 'active'
                          : record.status === 'Dropped' ? 'info'
                          : 'active'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── WEEK'S ATTENDANCE MARKING TAB ── */}
      {activeTab === 'today-attendance' && (() => {
        return (
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-panel" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>Mark Week's Attendance</h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Monday to Saturday Console</p>
                </div>
              </div>
            </div>

            {student?.bus === 'None' ? (
              <div className="dashboard-panel" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <AlertCircle size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                <h3>No Bus Allocation</h3>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Your ward must be allocated to a bus before attendance can be marked.</p>
              </div>
            ) : (
              <>
                {/* Student Info Card */}
                <div className="dashboard-panel" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>Student Ward</span>
                      <strong style={{ fontSize: '18px', color: '#0f172a' }}>{student?.studentName}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>ID: {student?.studentId} · Bus: {student?.bus}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>Today's Status</span>
                      {todayRecord ? (
                        <span className={`badge ${todayRecord.status === 'Absent' ? 'absent' : 'active'}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                          {todayRecord.status === 'Absent' ? '✕ Absent' 
                           : todayRecord.updatedBy === 'System (Auto-Accepted)' ? '✓ Present (Auto-Accepted)'
                           : '✓ Present'}
                        </span>
                      ) : (
                        <span className="badge inactive" style={{ fontSize: '13px', padding: '4px 12px' }}>Not Marked</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Weekly Attendance Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                  {getWeekDays().map((day) => {
                    const dayRecord = attendance.find((a) => a.date === day.dateStr);
                    const statusIsPresent = dayRecord ? dayRecord.status !== 'Absent' : false;
                    const statusIsAbsent = dayRecord ? dayRecord.status === 'Absent' : false;
                    const selectedDropTimeForDay = dayRecord?.dropOffTime || (day.dayOfWeek === 6 ? '12:30 PM' : '3:30 PM');
                    
                    return (
                      <div key={day.dateStr} style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        {/* Day & Date Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '16px', color: '#0f172a' }}>{day.dayName}</strong>
                            <span style={{ fontSize: '12.5px', color: '#64748b', marginLeft: '8px' }}>{day.displayDate}</span>
                          </div>
                          <div>
                            {dayRecord ? (
                              <span 
                                className={`badge ${
                                  dayRecord.status === 'Absent' ? 'absent'
                                  : dayRecord.status === 'No-Show' ? 'danger'
                                  : dayRecord.status === 'Boarded' ? 'active'
                                  : dayRecord.status === 'Dropped' ? 'info'
                                  : 'active'
                                }`} 
                                style={{ fontSize: '12px', padding: '4px 12px' }}
                              >
                                {dayRecord.status === 'Absent' ? '✕ Absent' 
                                 : dayRecord.status === 'No-Show' ? '✕ No-Show' 
                                 : dayRecord.status === 'Boarded' ? '✓ Boarded' 
                                 : dayRecord.status === 'Dropped' ? '✓ Dropped' 
                                 : dayRecord.updatedBy === 'System (Auto-Accepted)' ? '✓ Present (Auto-Accepted)'
                                 : '✓ Present'}
                              </span>
                            ) : (
                              <span className="badge inactive" style={{ fontSize: '12px', padding: '4px 12px' }}>Not Marked</span>
                            )}
                          </div>
                        </div>

                        {/* Controls (Attendance Toggle + Drop-off Selection) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                          {/* Attendance Status Selector */}
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                              Attendance Status
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => handleMarkAttendanceForDate(day.dateStr, 'Present')}
                                disabled={submittingAttendance}
                                style={{
                                  flex: 1,
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  border: '2px solid',
                                  borderColor: statusIsPresent ? '#10b981' : '#e2e8f0',
                                  backgroundColor: statusIsPresent ? '#d1fae5' : '#f8fafc',
                                  color: statusIsPresent ? '#065f46' : '#475569',
                                  fontWeight: 600,
                                  fontSize: '13px',
                                  cursor: submittingAttendance ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease',
                                  opacity: submittingAttendance ? 0.7 : 1
                                }}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarkAttendanceForDate(day.dateStr, 'Absent')}
                                disabled={submittingAttendance}
                                style={{
                                  flex: 1,
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  border: '2px solid',
                                  borderColor: statusIsAbsent ? '#ef4444' : '#e2e8f0',
                                  backgroundColor: statusIsAbsent ? '#fee2e2' : '#f8fafc',
                                  color: statusIsAbsent ? '#7f1d1d' : '#475569',
                                  fontWeight: 600,
                                  fontSize: '13px',
                                  cursor: submittingAttendance ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease',
                                  opacity: submittingAttendance ? 0.7 : 1
                                }}
                              >
                                Absent
                              </button>
                            </div>
                          </div>

                          {/* Drop-off Option Selector */}
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                              Preferred Drop-off Time
                            </span>
                            {statusIsPresent ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {getDropTimeOptions(day.dayOfWeek).map((time) => {
                                  const isSelected = selectedDropTimeForDay === time;
                                  return (
                                    <button
                                      key={time}
                                      type="button"
                                      onClick={() => handleSelectDropTimeForDate(day.dateStr, time)}
                                      disabled={submittingAttendance}
                                      style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        border: '2px solid',
                                        borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                                        color: isSelected ? '#1e40af' : '#64748b',
                                        fontWeight: 600,
                                        fontSize: '12.5px',
                                        cursor: submittingAttendance ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                      }}
                                    >
                                      <Clock size={14} style={{ color: isSelected ? '#2563eb' : '#94a3b8' }} />
                                      <span>{time}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ 
                                background: '#f1f5f9', 
                                color: '#94a3b8', 
                                fontSize: '13px', 
                                padding: '10px 14px', 
                                borderRadius: '10px', 
                                textAlign: 'center',
                                border: '1px dashed #cbd5e1',
                                fontWeight: 500
                              }}>
                                Not riding (Absent)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Notice */}
                <div style={{ background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '20px' }}>
                  <Shield size={16} style={{ color: '#2563eb', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#1e40af', lineHeight: 1.6 }}>
                    Your weekly attendance choices are visible to the driver, Transport Head, and System Administrator in real time. Default drop-offs are set dynamically by day.
                  </p>
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* ── ANNOUNCEMENTS / ALERTS TAB ── */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {notifications.length === 0 ? (
            <div className="dashboard-panel" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No announcements sent.
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="dashboard-panel" style={{ borderLeft: '5px solid #ca8a04' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{notif.title}</h3>
                    <span className="badge warning" style={{ marginTop: '6px', fontSize: '9px', textTransform: 'uppercase' }}>
                      {notif.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{notif.date}</span>
                </div>
                <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                  Broadcaster: {notif.sentBy}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default ParentDashboard;
