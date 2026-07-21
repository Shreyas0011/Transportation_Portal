// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { Mail, LogIn, Lock } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { transportApi } from '../../api/transportApi';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const tempErrors: { email?: string; password?: string } = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await transportApi.login({ email, password });
      toast.success(`Welcome back, ${data.user.name}!`);
      onLoginSuccess(data.user, data.accessToken);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to auto-fill and login
  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    let psw = 'parent123';
    if (roleEmail.startsWith('head')) psw = 'head123';
    else if (roleEmail.startsWith('driver')) psw = 'driver123';
    else if (roleEmail.startsWith('super')) psw = 'super123';
    setPassword(psw);
    setLoading(true);
    transportApi.login({ email: roleEmail, password: psw })
      .then((data) => {
        toast.success(`Welcome back, ${data.user.name}!`);
        onLoginSuccess(data.user, data.accessToken);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Login failed';
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="modern-login-container">
      <div className="bg-gradient-glow"></div>
      <div className="bg-gradient-glow-2"></div>

      <div className="modern-login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/transcend-logo.png" alt="Transcend Logo" style={{ maxHeight: '60px', objectFit: 'contain' }} />
        </div>

        <h1 className="modern-login-title">Transport Management Portal</h1>
        <p className="modern-login-subtitle">Sign in to your transport operator portal</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input */}
          <div>
            <label className="modern-input-label" htmlFor="login-email">
              EMAIL ADDRESS
            </label>
            <div className="modern-input-wrapper">
              <span className="modern-input-icon-left">
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                className={`modern-input ${errors.email ? 'error' : ''}`}
                placeholder="operator@transcend.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: 500 }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="modern-input-label" htmlFor="login-password">
              PASSWORD
            </label>
            <div className="modern-input-wrapper">
              <span className="modern-input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type="password"
                className={`modern-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={loading}
              />
            </div>
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: 500 }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="modern-btn-primary" 
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Console */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: '12px', letterSpacing: '0.5px' }}>
            DEMO LOGIN PANELS (CLICK TO ENTER)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              className="modern-btn-secondary"
              style={{ fontSize: '11px', padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => handleQuickLogin('head@transcend.org')}
              disabled={loading}
            >
              <span style={{ fontWeight: 700, color: '#2563eb' }}>Transport Head</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>head@transcend.org</span>
            </button>
            <button
              className="modern-btn-secondary"
              style={{ fontSize: '11px', padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => handleQuickLogin('parent.251p2474@transcend.org')}
              disabled={loading}
            >
              <span style={{ fontWeight: 700, color: '#7c3aed' }}>Parent (Triveni)</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>parent.251p2474@transcend.org</span>
            </button>
            <button
              className="modern-btn-secondary"
              style={{ fontSize: '11px', padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => handleQuickLogin('driver001@transcend.org')}
              disabled={loading}
            >
              <span style={{ fontWeight: 700, color: '#10b981' }}>Driver (Manjunath)</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>driver001@transcend.org</span>
            </button>
            <button
              className="modern-btn-secondary"
              style={{ fontSize: '11px', padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => handleQuickLogin('superadmin@transcend.org')}
              disabled={loading}
            >
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Super Admin</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>superadmin@transcend.org</span>
            </button>
          </div>
        </div>

        {/* Development Watermark */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0', fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>
          TRANSCEND PORTAL v1.0.0
        </div>
      </div>
    </div>
  );
};
