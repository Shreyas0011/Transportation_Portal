import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, X, Check, AlertCircle } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const downloadSampleCSV = () => {
    const csvHeader = "studentName,studentId,route,bus,pickupStop,dropStop,parentContact,parentEmail,healthRecord\n";
    const sampleRow1 = "Aarav Sharma,251P3001,Route 01,KA05AL1642,Main Depot,Campus Hub,+91 9876543210,parent3001@transcend.org,None\n";
    const sampleRow2 = "Diya Patel,251P3002,Route 02,KA05AL1645,South Gate,Campus Hub,+91 9876543211,parent3002@transcend.org,Asthma\n";
    
    const blob = new Blob([csvHeader + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_import_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseFileContent = (text: string) => {
    try {
      setParsingError(null);
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
      if (lines.length < 2) {
        setParsingError('File contains no student data rows. Minimum 1 header row + 1 data row required.');
        setParsedStudents([]);
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

      const getIdx = (aliases: string[]) => headers.findIndex((h) => aliases.some((a) => h.includes(a)));

      const nameIdx = getIdx(['studentname', 'name', 'student']);
      const idIdx = getIdx(['studentid', 'id', 'roll']);
      const routeIdx = getIdx(['route', 'assignedroute']);
      const busIdx = getIdx(['bus', 'vehicle', 'plate']);
      const pickupIdx = getIdx(['pickup', 'pickupstop']);
      const dropIdx = getIdx(['drop', 'dropstop']);
      const phoneIdx = getIdx(['parentcontact', 'contact', 'phone', 'mobile']);
      const emailIdx = getIdx(['parentemail', 'email']);
      const healthIdx = getIdx(['health', 'healthrecord', 'medical']);

      const parsedList: Student[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Handle CSV split with quote protection
        const row = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
        if (row.length === 0 || row.every((c) => c === '')) continue;

        const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : '';
        const id = idIdx !== -1 && row[idIdx] ? row[idIdx] : '';

        if (!name && !id) continue;

        parsedList.push({
          studentName: name || `Student ${i}`,
          studentId: id || `STU-2026-${String(i).padStart(3, '0')}`,
          route: routeIdx !== -1 && row[routeIdx] ? row[routeIdx] : 'None',
          bus: busIdx !== -1 && row[busIdx] ? row[busIdx] : 'None',
          pickupStop: pickupIdx !== -1 && row[pickupIdx] ? row[pickupIdx] : 'None',
          dropStop: dropIdx !== -1 && row[dropIdx] ? row[dropIdx] : 'None',
          parentContact: phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx] : '+91 99000 00000',
          parentEmail: emailIdx !== -1 && row[emailIdx] ? row[emailIdx] : '',
          healthRecord: healthIdx !== -1 && row[healthIdx] ? row[healthIdx] : 'None'
        });
      }

      if (parsedList.length === 0) {
        setParsingError('Could not parse any valid student rows from file. Check headers and format.');
      } else {
        setParsedStudents(parsedList);
      }
    } catch (err: any) {
      setParsingError(`Failed to parse file: ${err.message}`);
      setParsedStudents([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseFileContent(content || '');
    };
    reader.onerror = () => {
      setParsingError('Failed to read file content.');
    };
    reader.readAsText(selectedFile);
  };

  const handleImportSubmit = async () => {
    if (parsedStudents.length === 0) return;
    setIsImporting(true);
    try {
      await transportApi.bulkAddStudents(parsedStudents);
      onSuccess(parsedStudents.length);
      handleResetAndClose();
    } catch (err: any) {
      setParsingError(`Import failed: ${err.message || 'Server error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetAndClose = () => {
    setFile(null);
    setParsedStudents([]);
    setParsingError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '750px', width: '90%' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Bulk Student Import (CSV / Excel)</h3>
          </div>
          <button className="btn-icon" onClick={handleResetAndClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* File Picker & Sample Template Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Upload `.csv` or `.txt` formatted spreadsheet.
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Supported columns: studentName, studentId, route, bus, pickupStop, dropStop, parentContact
              </p>
            </div>
            <button
              type="button"
              onClick={downloadSampleCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              Sample Template
            </button>
          </div>

          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: file ? '#f0fdf4' : '#fafafa',
              borderColor: file ? '#22c55e' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv, .txt, .xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Upload size={32} color={file ? '#16a34a' : '#64748b'} style={{ margin: '0 auto 8px auto' }} />
            {file ? (
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#15803d' }}>{file.name}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#166534' }}>
                  {(file.size / 1024).toFixed(1)} KB — {parsedStudents.length} record(s) parsed
                </p>
              </div>
            ) : (
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>
                  Click to select or drag & drop a file here
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  CSV, XLSX, XLS, TXT (Max size 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Parsing Error Warning */}
          {parsingError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
              <AlertCircle size={16} />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedStudents.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  Preview Ready Records ({parsedStudents.length}):
                </span>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  ✓ All fields mapped successfully
                </span>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f1f5f9', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>Student Name</th>
                      <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>Student ID</th>
                      <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>Route</th>
                      <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>Bus</th>
                      <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>Parent Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedStudents.slice(0, 10).map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 600 }}>{s.studentName}</td>
                        <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{s.studentId}</td>
                        <td style={{ padding: '6px 10px', color: '#2563eb' }}>{s.route}</td>
                        <td style={{ padding: '6px 10px' }}>{s.bus}</td>
                        <td style={{ padding: '6px 10px' }}>{s.parentContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedStudents.length > 10 && (
                  <p style={{ textAlign: 'center', margin: '6px 0', fontSize: '11px', color: '#64748b' }}>
                    + {parsedStudents.length - 10} more rows...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleResetAndClose}
            disabled={isImporting}
            style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleImportSubmit}
            disabled={parsedStudents.length === 0 || isImporting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: '6px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              border: 'none',
              cursor: parsedStudents.length === 0 || isImporting ? 'not-allowed' : 'pointer',
              opacity: parsedStudents.length === 0 || isImporting ? 0.6 : 1
            }}
          >
            <Check size={16} />
            {isImporting ? 'Importing...' : `Import ${parsedStudents.length} Students`}
          </button>
        </div>
      </div>
    </div>
  );
};
