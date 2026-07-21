// src/pages/driver/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Phone, AlertCircle, MapPin
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import type { Vehicle, Driver, Student, Route, Attendance } from '../../utils/db';

interface DriverDashboardProps {
  activeTab: string;
  user: {
    email: string;
    name: string;
    role: string;
    employeeId?: string;
  };
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ activeTab, user }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // States
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [passengers, setPassengers] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      // Find driver by name matching logged in name or employeeId
      const driversList = await transportApi.getDrivers();
      const driverRecord = driversList.find(
        (d) => d.employeeId === user.employeeId || (user.employeeId === undefined && d.name.toLowerCase() === user.name.toLowerCase())
      );

      if (!driverRecord) {
        toast.warning('No driver record found associated with this user profile.');
        setLoading(false);
        return;
      }
      setDriver(driverRecord);

      // Fetch other resources
      const [vehiclesList, studentsList, routesList, attendanceList] = await Promise.all([
        transportApi.getVehicles(),
        transportApi.getStudents(),
        transportApi.getRoutes(),
        transportApi.getAttendance(),
      ]);

      // Resolve Vehicle
      if (driverRecord.assignedVehicle !== 'None') {
        const dBus = vehiclesList.find((v) => v.vehicleNumber === driverRecord.assignedVehicle);
        if (dBus) setVehicle(dBus);
      }

      // Resolve Route
      if (driverRecord.assignedRoute !== 'None') {
        const dRoute = routesList.find((r) => r.routeName === driverRecord.assignedRoute);
        if (dRoute) setRoute(dRoute);
      }

      // Fetch students allocated to this bus
      const dPassengers = studentsList.filter(
        (s) => s.bus === driverRecord.assignedVehicle
      );
      setPassengers(dPassengers);
      setAttendance(attendanceList);
    } catch (err: any) {
      toast.error('Failed to load driver duty schedules.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassengerStatus = async (student: Student, newStatus: Attendance['status']) => {
    setLoading(true);
    const todayStr = new Date().toISOString().split('T')[0];
    const recordId = `ATT-${student.studentId}-${todayStr}`;

    const existingRec = attendance.find((a) => a.id === recordId);

    const record: Attendance = {
      id: recordId,
      date: todayStr,
      studentId: student.studentId,
      studentName: student.studentName,
      route: student.route,
      bus: student.bus,
      status: newStatus,
      parentDeclaration: existingRec?.parentDeclaration || (newStatus === 'Absent' ? 'Absent' : 'Present'),
      actualBoarding: newStatus === 'Absent' ? undefined : (newStatus as any),
      updatedBy: 'Driver',
      accountabilityStatus: newStatus === 'No-Show' ? (existingRec?.accountabilityStatus || 'Pending') : existingRec?.accountabilityStatus,
      accountabilityNote: existingRec?.accountabilityNote,
    };

    try {
      await transportApi.saveAttendance(record);
      toast.success(`Passenger ${student.studentName} marked as ${newStatus}`);
      // Reload attendance lists
      const updated = await transportApi.getAttendance();
      setAttendance(updated);
    } catch (err) {
      toast.error('Failed to update passenger boarding status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverData();
  }, [user.name]);

  const getStopStatus = (stopName: string): 'absent' | 'coming' => {
    const todayStr = new Date().toISOString().split('T')[0];
    const stopStudents = passengers.filter(
      (s) => s.pickupStop === stopName || s.dropStop === stopName
    );
    const hasAbsent = stopStudents.some((student) => {
      const attRecord = attendance.find(
        (a) => a.studentId === student.studentId && a.date === todayStr
      );
      return attRecord?.status === 'Absent';
    });
    return hasAbsent ? 'absent' : 'coming';
  };

  const getStopStudents = (stopName: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return passengers.filter((s) => s.pickupStop === stopName || s.dropStop === stopName).map((s) => {
      const attRecord = attendance.find(
        (a) => a.studentId === s.studentId && a.date === todayStr
      );
      return {
        ...s,
        status: attRecord?.status || 'No Log',
        dropOffTime: attRecord?.dropOffTime
      };
    });
  };

  if (loading && !driver) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const hasDuty = driver && driver.assignedVehicle !== 'None';

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* ── DAILY DUTY SUMMARY TAB ── */}
      {activeTab === 'my-schedule' && (
        <div className="parent-grid">
          {/* Driver Profile Header */}
          <div className="dashboard-panel" style={{ gridColumn: 'span 2' }}>
            <div className="panel-header">
              <h2 className="panel-title">
                <Calendar size={18} />
                <span>Duty Assignment: {driver?.name} ({driver?.employeeId})</span>
              </h2>
              <span className={`badge ${hasDuty ? 'active' : 'inactive'}`}>
                {hasDuty ? 'On Duty' : 'Off Duty / No Assignment'}
              </span>
            </div>

            {!hasDuty ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                <h3>No Route Assigned Today</h3>
                <p style={{ marginTop: '8px', fontSize: '14px' }}>
                  You currently do not have an active route or vehicle assignment. Please check in with the Transport Head Rajesh Nair for updates.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Vehicle card */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#eab308', display: 'block', marginBottom: '10px', letterSpacing: '0.8px' }}>
                    ASSIGNED VEHICLE DETAILS
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Vehicle Plate</span>
                      <strong style={{ fontSize: '18px', color: '#0f172a' }}>{vehicle?.vehicleNumber}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Model Specification</span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{vehicle?.vehicleModel}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Capacity Limit</span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{vehicle?.seatingCapacity} Seats</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Registration No.</span>
                      <strong style={{ fontSize: '13px', color: '#475569', fontFamily: 'monospace' }}>{vehicle?.registrationNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Route card */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '10px', letterSpacing: '0.8px' }}>
                    ASSIGNED ROUTE DETAILS
                  </span>
                  {route ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Route Name</span>
                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>{route.routeName}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Start Point</span>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{route.startingPoint}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Destination</span>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{route.destination}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Stops Registered</span>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{route.stops.length} Stops</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '20px 0', color: '#64748b', fontSize: '13px' }}>
                      No route linked to your driver profile.
                    </div>
                  )}
                </div>

                {/* Route Stops Timeline */}
                {route && route.stops.length > 0 && (
                  <div style={{ gridColumn: '1 / -1', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '20px', letterSpacing: '0.8px' }}>
                      STOPS TIMELINE & SCHEDULE
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative', paddingLeft: '28px' }}>
                      <div style={{ position: 'absolute', left: '8px', top: '8px', bottom: '8px', width: '2px', background: '#cbd5e1' }}></div>
                      
                      {route.stops.map((stop, idx) => {
                        const status = getStopStatus(stop.stopName);
                        const stopStudentsList = getStopStudents(stop.stopName);
                        
                        let pinColor = '#10b981'; // Green (default / coming)
                        let pinFill = '#d1fae5';
                        
                        if (status === 'absent') {
                          pinColor = '#ef4444'; // Red (absent)
                          pinFill = '#fee2e2';
                        }

                        return (
                          <div key={stop.stopName} style={{ display: 'flex', gap: '16px', marginBottom: idx === route.stops.length - 1 ? 0 : '24px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-28px', top: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <MapPin size={20} style={{ color: pinColor, fill: pinFill }} />
                            </div>
                            <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                              <div>
                                <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>{stop.stopName}</strong>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Stop #{idx + 1}</span>
                                
                                {/* Allocated Students list at this stop */}
                                {stopStudentsList.length > 0 && (
                                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {stopStudentsList.map((stu) => {
                                      const isAbsent = stu.status === 'Absent';
                                      return (
                                        <span 
                                          key={stu.studentId} 
                                          style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            fontSize: '11px', 
                                            fontWeight: 600, 
                                            padding: '2px 8px', 
                                            borderRadius: '12px',
                                            background: isAbsent ? '#fee2e2' : '#d1fae5',
                                            color: isAbsent ? '#991b1b' : '#065f46',
                                            border: isAbsent ? '1px solid #fca5a5' : '1px solid #a7f3d0'
                                          }}
                                        >
                                          {stu.studentName} {isAbsent ? '(Absent)' : stu.dropOffTime ? `(Present - Dropoff: ${stu.dropOffTime})` : '(Present)'}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
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

          {/* Quick numbers */}
          {hasDuty && (
            <>
              <div className="stat-card" style={{ flexGrow: 1 }}>
                <div className="stat-icon success"><Users /></div>
                <div className="stat-details">
                  <span className="stat-label">Allocated Students</span>
                  <span className="stat-value">{passengers.length} Students</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PASSENGER ROSTER TAB ── */}
      {activeTab === 'student-list' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <Users size={18} />
              <span>Assigned Student Passengers Roster ({passengers.length})</span>
            </h2>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Pickup Stop</th>
                  <th>Drop Stop</th>
                  <th>Parent Contact</th>
                  <th>Today's Status</th>
                  <th>Verification Controls</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  if (passengers.length === 0) {
                    return (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                          No students are allocated to your bus today.
                        </td>
                      </tr>
                    );
                  }
                  const todayStr = new Date().toISOString().split('T')[0];
                  return passengers.map((s) => {
                    const todayRec = attendance.find(
                      (a) => a.studentId === s.studentId && a.date === todayStr
                    );
                    const todayStatus = todayRec?.status || 'Not Marked';
                    return (
                      <tr key={s.studentId}>
                        <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                        <td style={{ fontWeight: 500 }}>{s.pickupStop === 'None' ? '-' : s.pickupStop}</td>
                        <td style={{ fontWeight: 500 }}>
                          {s.dropStop === 'None' ? '-' : s.dropStop}
                          {todayRec?.dropOffTime && (
                            <span style={{ display: 'block', fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                              Option: {todayRec.dropOffTime}
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600 }}>
                            <Phone size={14} />
                            <span>{s.parentContact}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              todayStatus === 'Absent' ? 'absent'
                              : todayStatus === 'No-Show' ? 'danger'
                              : todayStatus === 'Dropped' ? 'info'
                              : todayStatus === 'Boarded' ? 'active'
                              : todayStatus === 'Present' ? 'warning'
                              : 'inactive'
                            }`}
                          >
                            {todayStatus === 'Present' ? 'Declared Present' : todayStatus}
                          </span>
                        </td>
                        <td>
                          <div className="btn-action-group" style={{ gap: '6px' }}>
                            {/* Board Button */}
                            {(todayStatus === 'Present' || todayStatus === 'Not Marked' || todayStatus === 'Absent' || todayStatus === 'No-Show') && (
                              <button
                                type="button"
                                className="btn-add"
                                style={{ padding: '6px 12px', fontSize: '11px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                                onClick={() => handleUpdatePassengerStatus(s, 'Boarded')}
                              >
                                Board
                              </button>
                            )}
                            {/* Drop Off Button */}
                            {todayStatus === 'Boarded' && (
                              <button
                                type="button"
                                className="btn-add"
                                style={{ padding: '6px 12px', fontSize: '11px', background: '#2563eb', borderColor: '#2563eb', color: '#fff' }}
                                onClick={() => handleUpdatePassengerStatus(s, 'Dropped')}
                              >
                                Drop Off
                              </button>
                            )}
                            {/* No-Show Button */}
                            {(todayStatus === 'Present' || todayStatus === 'Boarded') && (
                              <button
                                type="button"
                                className="btn-danger"
                                style={{ padding: '6px 12px', fontSize: '11px', color: '#fff' }}
                                onClick={() => handleUpdatePassengerStatus(s, 'No-Show')}
                              >
                                No-Show
                              </button>
                            )}
                            {/* Absent Button */}
                            {todayStatus === 'Not Marked' && (
                              <button
                                type="button"
                                className="btn-cancel"
                                style={{ padding: '6px 12px', fontSize: '11px', background: '#64748b', color: '#fff', border: 'none' }}
                                onClick={() => handleUpdatePassengerStatus(s, 'Absent')}
                              >
                                Absent
                              </button>
                            )}
                            {/* Done label */}
                            {todayStatus === 'Dropped' && (
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981' }}>
                                Journey Completed ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default DriverDashboard;
