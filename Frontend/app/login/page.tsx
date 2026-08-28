'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  LogIn,
  ShieldCheck,
  Sparkles,
  Check,
  Lock,
  Mail,
  User,
  Star,
  Award,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [name, setName] = useState('Aarav Mehta');
  const [email, setEmail] = useState('aarav.mehta@stayvilla.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userObj = {
      name: name || 'Aarav Mehta',
      email: email || 'aarav.mehta@stayvilla.in',
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
      }, 800);
    }, 600);
  };

  const handleDemoLogin = () => {
    setName('Aarav Mehta');
    setEmail('aarav.mehta@stayvilla.in');
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
    }, 400);
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
              <ShieldCheck size={14} /> 256-Bit SSL Secure
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT SPLIT LAYOUT */}
      <main className="login-main-container">
        <div className="login-card-wrapper">
          {/* LEFT SIDE: LUXURY BRAND PROMISES */}
          <div className="login-side-showcase">
            <div className="showcase-content">
              <span className="showcase-tag">
                <Sparkles size={13} /> StayVilla Connoisseur Club
              </span>
              <h2>Unlock Exclusive Access to India&apos;s Grandest Sanctuaries</h2>
              <p>
                Experience tailored royal hospitality, private chef arrangements, and verified luxury heritage havelis across India.
              </p>

              <div className="showcase-perks-list">
                <div className="showcase-perk-item">
                  <div className="perk-icon-wrap">
                    <Award size={18} />
                  </div>
                  <div>
                    <strong>Complimentary Concierge</strong>
                    <span>24/7 dedicated butler & travel planner on call</span>
                  </div>
                </div>

                <div className="showcase-perk-item">
                  <div className="perk-icon-wrap">
                    <Star size={18} />
                  </div>
                  <div>
                    <strong>Member-Only Tariffs</strong>
                    <span>Save up to 15% on direct luxury villa reservations</span>
                  </div>
                </div>

                <div className="showcase-perk-item">
                  <div className="perk-icon-wrap">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>100% Verified Properties</strong>
                    <span>Every estate hand-inspected for pristine quality</span>
                  </div>
                </div>
              </div>

              <div className="showcase-quote">
                <p>&quot;The gold standard of luxury holiday living across Rajasthan, Goa, and Kerala.&quot;</p>
                <span>— Condé Nast Traveller India</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: AUTHENTICATION FORM */}
          <div className="login-side-form">
            <div className="login-form-inner">
              <div className="login-header">
                <span className="brand-mark">⌁</span>
                <h2>Sign In to StayVilla</h2>
                <p>Enter your details below to access your account & bookings</p>
              </div>

              {success ? (
                <div className="login-success-state">
                  <div className="success-icon-badge">
                    <Check size={32} />
                  </div>
                  <h3>Welcome Back, {name || 'Aarav'}!</h3>
                  <p>Redirecting you to your luxury experience…</p>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="login-actual-form">
                  <div className="form-field">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Aarav Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        placeholder="aarav.mehta@stayvilla.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Password / Access PIN</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-icon" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="prop-confirm-reservation-btn login-submit-btn"
                    disabled={isLoading}
                  >
                    <LogIn size={17} />
                    <span>{isLoading ? 'Signing In…' : `Log In as ${name || 'Member'}`}</span>
                  </button>

                  <div className="login-divider-row">
                    <span>or fast access</span>
                  </div>

                  <button
                    type="button"
                    className="quick-demo-btn login-demo-btn"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    ⚡ 1-Click Instant Demo Login (Aarav Mehta)
                  </button>

                  <p className="login-terms-note">
                    By continuing, you agree to StayVilla&apos;s{' '}
                    <a href="#">Terms of Hospitality</a> &amp; <a href="#">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
