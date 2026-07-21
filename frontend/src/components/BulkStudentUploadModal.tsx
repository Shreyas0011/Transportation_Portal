import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Download, X, Check, AlertCircle, FileCheck2, RefreshCw } from 'lucide-react';
import { transportApi } from '../api/transportApi';
import type { Student } from '../utils/db';

interface BulkStudentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (importedCount: number) => void;
}

export const BulkStudentUploadModal: React.FC<BulkStudentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const downloadSampleCSV = () => {
    const rows = [
      'studentName,studentId,route,bus,pickupStop,dropStop,parentContact,parentEmail,healthRecord',
      'Aarav Sharma,251P3001,Route 01,KA05AL1642,Main Depot,Campus Hub,+91 9876543210,parent3001@transcend.org,None',
      'Diya Patel,251P3002,Route 02,KA05AL1645,South Gate,Campus Hub,+91 9876543211,parent3002@transcend.org,Asthma',
    ].join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseText = (text: string) => {
    setParsingError(null);
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      setParsingError('File must have at least 1 header row and 1 data row.');
      setParsedStudents([]);
      return;
    }

    const headers = lines[0]
      .split(',')
      .map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

    const find = (aliases: string[]) =>
      headers.findIndex((h) => aliases.some((a) => h.includes(a)));

    const col = {
      name: find(['studentname', 'name', 'student']),
      id: find(['studentid', 'id', 'roll']),
      route: find(['route', 'assignedroute']),
      bus: find(['bus', 'vehicle', 'plate']),
      pickup: find(['pickup', 'pickupstop']),
      drop: find(['drop', 'dropstop']),
      phone: find(['parentcontact', 'contact', 'phone', 'mobile']),
      email: find(['parentemail', 'email']),
      health: find(['health', 'healthrecord', 'medical']),
    };

    const get = (row: string[], idx: number) =>
      idx !== -1 && row[idx] ? row[idx].trim().replace(/^["']|["']$/g, '') : '';

    const result: Student[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      if (row.every((c) => c.trim() === '')) continue;

      const name = get(row, col.name);
      const id = get(row, col.id);
      if (!name && !id) continue;

      result.push({
        studentName: name || `Student ${i}`,
        studentId: id || `STU-2026-${String(i).padStart(3, '0')}`,
        route: get(row, col.route) || 'None',
        bus: get(row, col.bus) || 'None',
        pickupStop: get(row, col.pickup) || 'None',
        dropStop: get(row, col.drop) || 'None',
        parentContact: get(row, col.phone) || '+91 99000 00000',
        parentEmail: get(row, col.email) || '',
        healthRecord: get(row, col.health) || 'None',
      });
    }

    if (result.length === 0) {
      setParsingError('No valid rows found. Please check your file headers and data.');
    } else {
      setParsedStudents(result);
    }
  };

  const processFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => parseText((e.target?.result as string) || '');
    reader.onerror = () => setParsingError('Failed to read file.');
    reader.readAsText(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, []);

  const handleImport = async () => {
    if (parsedStudents.length === 0) return;
    setIsImporting(true);
    try {
      await transportApi.bulkAddStudents(parsedStudents);
      onSuccess(parsedStudents.length);
      handleClose();
    } catch (err: any) {
      setParsingError(`Import failed: ${err.message || 'Server error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedStudents([]);
    setParsingError(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div
        className="modal"
        style={{ maxWidth: '680px', width: '92%', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--primary-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileText size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Bulk Student Import</h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                Upload a CSV or plain text file to import multiple students at once
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Info bar + template download */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, padding: '10px 14px',
            background: 'var(--primary-glow)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Supported formats: <code style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.csv</code>{' '}
                <code style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.txt</code>
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                Columns: studentName · studentId · route · bus · pickupStop · dropStop · parentContact
              </p>
            </div>
            <button
              type="button"
              onClick={downloadSampleCSV}
              style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 13px', borderRadius: 'var(--radius-sm)',
                fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                background: 'white', color: 'var(--primary)',
                border: '1px solid var(--primary)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Download size={13} />
              Sample Template
            </button>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${file ? 'var(--success)' : isDragging ? 'var(--primary)' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-md)',
              padding: '28px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: file ? 'var(--success-glow)' : isDragging ? 'var(--primary-glow)' : 'var(--bg-input)',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--success-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileCheck2 size={22} color="var(--success)" />
                </div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--success)' }}>
                  {file.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                  {(file.size / 1024).toFixed(1)} KB — Click to change file
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: isDragging ? 'var(--primary-glow)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  <Upload size={22} color={isDragging ? 'var(--primary)' : 'var(--text-muted)'} />
                </div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: isDragging ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {isDragging ? 'Drop your file here' : 'Click to browse or drag & drop'}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                  CSV or TXT files only · Max 5 MB
                </p>
              </div>
            )}
          </div>

          {/* Error banner */}
          {parsingError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'var(--danger-glow)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#b91c1c',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: 13, lineHeight: 1.5,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Preview table */}
          {parsedStudents.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Preview — {parsedStudents.length} record{parsedStudents.length !== 1 ? 's' : ''} ready to import
                </p>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--success)',
                  background: 'var(--success-glow)',
                  padding: '2px 10px', borderRadius: 20,
                  border: '1px solid rgba(16,185,129,0.2)'
                }}>
                  ✓ Parsed
                </span>
              </div>
              <div style={{
                maxHeight: 170, overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', position: 'sticky', top: 0 }}>
                      {['#', 'Student Name', 'Student ID', 'Route', 'Bus', 'Parent Contact'].map((h) => (
                        <th key={h} style={{
                          padding: '8px 10px', fontWeight: 600,
                          color: 'var(--text-secondary)', fontSize: 11,
                          borderBottom: '1px solid var(--border-color)',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedStudents.slice(0, 8).map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '6px 10px', color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
                        <td style={{ padding: '6px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.studentName}</td>
                        <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{s.studentId}</td>
                        <td style={{ padding: '6px 10px', color: 'var(--primary)', fontWeight: 500 }}>{s.route}</td>
                        <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{s.bus}</td>
                        <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{s.parentContact}</td>
                      </tr>
                    ))}
                    {parsedStudents.length > 8 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '7px 10px', textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          + {parsedStudents.length - 8} more rows not shown
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 10, padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
        }}>
          <button
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={isImporting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleImport}
            disabled={parsedStudents.length === 0 || isImporting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              opacity: parsedStudents.length === 0 || isImporting ? 0.55 : 1,
              cursor: parsedStudents.length === 0 || isImporting ? 'not-allowed' : 'pointer',
            }}
          >
            {isImporting ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Importing…
              </>
            ) : (
              <>
                <Check size={15} />
                {parsedStudents.length > 0
                  ? `Import ${parsedStudents.length} Student${parsedStudents.length !== 1 ? 's' : ''}`
                  : 'Select a file first'}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
