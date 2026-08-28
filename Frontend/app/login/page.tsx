'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Check,
  Phone,
  Star,
  Award,
  Mail,
  KeyRound,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Phone + OTP flow
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  // Verify OTP & Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userName = 'Aarav Mehta';
    const userObj = {
      name: userName,
      email: 'aarav.mehta@stayvilla.in',
      phone: phoneNumber || '+91 9167914640',
      country: 'India',
      tier: 'Connoisseur Club',
      memberSince: 'March 2023',
    };

    try {
      localStorage.setItem('stayvilla-user', JSON.stringify(userObj));
      localStorage.setItem('stayvilla-is-logged-in', 'true');
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectTo);
      }, 800);
    }, 700);
  };

  // Alternate sign-in (Google / Email) — mock login
  const handleAlternateLogin = (method: string) => {
    setIsLoading(true);

    const userObj = {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@stayvilla.in',
      phone: '+91 9167914640',
      country: 'India',
      tier: 'Connoisseur Club',
      memberSince: 'March 2023',
    };

    try {
      localStorage.setItem('stayvilla-user', JSON.stringify(userObj));
      localStorage.setItem('stayvilla-is-logged-in', 'true');
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectTo);
      }, 600);
    }, 500);
  };

  return (
    <div className="login-page-root">
      {/* NAVBAR */}
      <header className="prop-navbar">
        <div className="prop-navbar-inner">
          <div className="prop-nav-left">
            <Link href="/" className="prop-back-link">
              <ArrowLeft size={16} />
              <span>Back to StayVilla</span>
            </Link>
          </div>

          <Link href="/" className="prop-brand">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
            </span>
          </Link>

          <div className="prop-nav-right">
            <span className="prop-verified-badge">
              <ShieldCheck size={14} /> 256-Bit SSL Secured
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="login-main-container">
        <div className="login-split-card">
          {/* ==============================
              LEFT SIDE: WELCOME BRANDING
             ============================== */}
          <div className="login-welcome-side">
            <div className="login-welcome-content">
              <span className="login-welcome-tag">
                <Sparkles size={13} /> Connoisseur Club
              </span>
              <h1>Welcome to <br />StayVilla</h1>
              <p>
                India&apos;s most trusted luxury villa platform. Sign in to access handpicked royal estates, private chef experiences, and 24/7 dedicated concierge service.
              </p>

              <div className="login-welcome-perks">
                <div className="login-perk-item">
                  <div className="login-perk-icon">
                    <Award size={18} />
                  </div>
                  <div>
                    <strong>24/7 Dedicated Concierge</strong>
                    <span>Personal butler &amp; travel planner on every trip</span>
                  </div>
                </div>

                <div className="login-perk-item">
                  <div className="login-perk-icon">
                    <Star size={18} />
                  </div>
                  <div>
                    <strong>Member-Only Rates</strong>
                    <span>Save up to 15% on luxury villa bookings</span>
                  </div>
                </div>

                <div className="login-perk-item">
                  <div className="login-perk-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>100% Verified Properties</strong>
                    <span>Every estate personally hand-inspected</span>
                  </div>
                </div>
              </div>

              <div className="login-welcome-quote">
                <p>&quot;The gold standard of luxury holiday living across India.&quot;</p>
                <span>— Condé Nast Traveller India</span>
              </div>
            </div>
          </div>

          {/* ==============================
              RIGHT SIDE: PHONE + OTP LOGIN
             ============================== */}
          <div className="login-form-side">
            <div className="login-form-inner">
              {success ? (
                <div className="login-success-state">
                  <div className="success-icon-badge">
                    <Check size={32} />
                  </div>
                  <h3>Welcome Back!</h3>
                  <p>Redirecting you to your luxury experience…</p>
                </div>
              ) : (
                <>
                  <div className="login-form-header">
                    <span className="brand-mark" style={{ fontSize: '32px', color: 'var(--gold, #c8a46a)' }}>⌁</span>
                    <h2>Sign In to StayVilla</h2>
                    <p>Enter your phone number to receive a one-time verification code</p>
                  </div>

                  {!otpSent ? (
                    /* STEP 1: Enter Phone Number */
                    <form onSubmit={handleSendOtp} className="login-actual-form">
                      <div className="form-field">
                        <label>Mobile Number</label>
                        <div className="input-with-icon">
                          <Phone size={16} className="input-icon" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="prop-confirm-reservation-btn login-submit-btn"
                        disabled={isLoading}
                      >
                        <Phone size={17} />
                        <span>{isLoading ? 'Sending OTP…' : 'Send OTP'}</span>
                      </button>
                    </form>
                  ) : (
                    /* STEP 2: Enter OTP */
                    <form onSubmit={handleVerifyOtp} className="login-actual-form">
                      <div className="otp-sent-notice">
                        <Check size={14} />
                        <span>OTP sent to <strong>{phoneNumber}</strong></span>
                        <button
                          type="button"
                          className="otp-change-btn"
                          onClick={() => { setOtpSent(false); setOtp(''); }}
                        >
                          Change
                        </button>
                      </div>

                      <div className="form-field">
                        <label>Enter 6-Digit OTP</label>
                        <div className="input-with-icon">
                          <KeyRound size={16} className="input-icon" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="• • • • • •"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            maxLength={6}
                            autoFocus
                            className="otp-input-field"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="prop-confirm-reservation-btn login-submit-btn"
                        disabled={isLoading || otp.length < 4}
                      >
                        <Check size={17} />
                        <span>{isLoading ? 'Verifying…' : 'Verify & Sign In'}</span>
                      </button>

                      <button
                        type="button"
                        className="resend-otp-btn"
                        onClick={() => { /* mock resend */ }}
                      >
                        Didn&apos;t receive the code? <strong>Resend OTP</strong>
                      </button>
                    </form>
                  )}

                  {/* DIVIDER */}
                  <div className="login-divider-row">
                    <span>or sign in with</span>
                  </div>

                  {/* ALTERNATE SIGN-IN OPTIONS */}
                  <div className="alt-signin-row">
                    <button
                      type="button"
                      className="alt-signin-btn"
                      onClick={() => handleAlternateLogin('google')}
                      disabled={isLoading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      className="alt-signin-btn"
                      onClick={() => handleAlternateLogin('email')}
                      disabled={isLoading}
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </button>
                  </div>

                  <p className="login-terms-note">
                    By continuing, you agree to StayVilla&apos;s{' '}
                    <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
