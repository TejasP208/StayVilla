'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  KeyRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Authorized Supabase admin emails
const ALLOWED_ADMIN_EMAILS = [
  'stayvilla12@gmail.com',
  'tejasvilla@gmail.com',
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    // Verify against allowed admin emails
    if (!ALLOWED_ADMIN_EMAILS.includes(trimmedEmail)) {
      setErrorMessage('Access denied: This email is not registered as an authorized administrator.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid admin credentials.');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const userEmail = (data.user.email || trimmedEmail).toLowerCase();

        if (!ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
          await supabase.auth.signOut();
          setErrorMessage('Access denied: Unauthorized account.');
          setIsLoading(false);
          return;
        }

        const adminProfile = {
          id: data.user.id,
          email: userEmail,
          role: 'admin',
          loggedInAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem('stayvilla-admin', JSON.stringify(adminProfile));
          localStorage.setItem('stayvilla-is-admin', 'true');
        } catch {
          // ignore storage error
        }

        setAdminUser({ email: userEmail });
        setIsAuthenticated(true);
        setIsLoading(false);
        router.push('/admin/dashboard');
      } else {
        setErrorMessage('Authentication succeeded but user session could not be established.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('stayvilla-admin');
      localStorage.removeItem('stayvilla-is-admin');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fdfbf7',
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(200, 164, 106, 0.08) 0%, transparent 35%), radial-gradient(circle at 90% 80%, rgba(26, 60, 52, 0.04) 0%, transparent 40%)',
        color: '#1a221f',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      }}
    >
      {/* TOP NAVBAR */}
      <header
        style={{
          borderBottom: '1px solid #e6ded2',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(26, 60, 52, 0.03)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1a3c34',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: 600,
            transition: 'opacity 0.2s',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to StayVilla</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '20px',
              color: '#c8a46a',
              fontFamily: 'serif',
            }}
          >
            ⌁
          </span>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: '16px',
              letterSpacing: '2px',
              color: '#1a3c34',
            }}
          >
            STAY<span style={{ color: '#c8a46a' }}>VILLA</span>
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '3px 8px',
              backgroundColor: 'rgba(200, 164, 106, 0.15)',
              border: '1px solid rgba(200, 164, 106, 0.3)',
              borderRadius: '6px',
              color: '#8c6827',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginLeft: '6px',
            }}
          >
            Admin Portal
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#62726d',
            backgroundColor: '#f5f0e8',
            padding: '5px 10px',
            borderRadius: '20px',
            border: '1px solid #e6ded2',
          }}
        >
          <ShieldCheck size={14} color="#16a34a" />
          <span>256-Bit SSL Secured</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            border: '1px solid #e6ded2',
            borderRadius: '24px',
            padding: '42px 36px',
            boxShadow:
              '0 20px 50px rgba(26, 60, 52, 0.08), 0 2px 8px rgba(26, 60, 52, 0.04)',
          }}
        >
          {isAuthenticated ? (
            /* AUTHENTICATED STATE */
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#16a34a',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 20px rgba(22, 163, 74, 0.15)',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <h2
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1a3c34',
                  marginBottom: '8px',
                }}
              >
                Admin Authenticated
              </h2>

              <p
                style={{
                  fontSize: '13.5px',
                  color: '#62726d',
                  marginBottom: '24px',
                  lineHeight: 1.6,
                }}
              >
                Signed in with verified credentials as:
                <br />
                <strong style={{ color: '#8c6827' }}>{adminUser?.email}</strong>
              </p>

              <div
                style={{
                  backgroundColor: '#fdfbf7',
                  border: '1px solid #e6ded2',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: '#1a3c34',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  <Building2 size={16} color="#c8a46a" />
                  <span>StayVilla Management Console</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#16a34a',
                  }}
                >
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>Live Database Connected</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/admin/dashboard"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#1a3c34',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(26, 60, 52, 0.2)',
                    transition: 'all 0.2s',
                  }}
                >
                  Manage Properties & Destinations →
                </Link>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '11px',
                      borderRadius: '12px',
                      backgroundColor: '#f5f0e8',
                      color: '#1a3c34',
                      fontWeight: 600,
                      fontSize: '13px',
                      textDecoration: 'none',
                      border: '1px solid #e6ded2',
                    }}
                  >
                    View Main Site
                  </Link>

                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    style={{
                      padding: '11px 18px',
                      borderRadius: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LOGIN FORM */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: '#fdfbf7',
                    border: '1px solid #e6ded2',
                    color: '#c8a46a',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 12px rgba(200, 164, 106, 0.15)',
                  }}
                >
                  <Lock size={24} />
                </div>

                <h1
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '26px',
                    fontWeight: 700,
                    color: '#1a3c34',
                    margin: '0 0 6px',
                  }}
                >
                  Admin Portal
                </h1>
                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#62726d',
                    margin: 0,
                  }}
                >
                  Enter your admin email and password
                </p>
              </div>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '20px',
                    color: '#dc2626',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                {/* EMAIL INPUT */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    htmlFor="admin-email"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: '#8c6827',
                      marginBottom: '8px',
                    }}
                  >
                    Admin Email Address
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Mail
                      size={17}
                      color="#8c6827"
                      style={{
                        position: 'absolute',
                        left: '14px',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="stayvilla12@gmail.com"
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 42px',
                        backgroundColor: '#fdfbf7',
                        border: '1px solid #e6ded2',
                        borderRadius: '12px',
                        color: '#1a221f',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div style={{ marginBottom: '26px' }}>
                  <label
                    htmlFor="admin-password"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: '#8c6827',
                      marginBottom: '8px',
                    }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <KeyRound
                      size={17}
                      color="#8c6827"
                      style={{
                        position: 'absolute',
                        left: '14px',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      required
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 42px',
                        backgroundColor: '#fdfbf7',
                        border: '1px solid #e6ded2',
                        borderRadius: '12px',
                        color: '#1a221f',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#62726d',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isLoading
                      ? '#62726d'
                      : 'linear-gradient(135deg, #1a3c34, #2a5c4a)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(26, 60, 52, 0.2)',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Authenticating…</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Sign In as Admin</span>
                    </>
                  )}
                </button>
              </form>

              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e6ded2',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '11.5px',
                    color: '#62726d',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  🔒 Authorized personnel only.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
