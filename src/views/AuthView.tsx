import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import ironlogLogo from '../assets/ironlog-logo.jpg';
import { CREATOR_PHOTO_URL } from '../data/exercises';
import { AuthUser, StoredAccount } from '../types/fitness';
import {
  generateId,
  hashPassword,
  loadAccounts,
  saveAccounts,
} from '../utils/storage';

interface AuthViewProps {
  onAuthenticated: (user: AuthUser) => void;
}

type AuthMode = 'email-signin' | 'email-signup' | 'phone' | 'google';

export const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('email-signin');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phoneInput, setPhoneInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  const [error, setError] = useState<string | null>(null);

  const savedAccounts = loadAccounts();
  const savedGoogleAccounts = savedAccounts.filter(
    (acc) => acc.provider === 'google',
  );

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Please use at least 6 characters for your password.');
      return;
    }

    const accounts = loadAccounts();

    if (mode === 'email-signup') {
      const cleanName = fullName.trim();
      if (!cleanName) {
        setError('Please enter your name.');
        return;
      }
      const existing = accounts.find(
        (a) => a.provider === 'email' && a.email === normalizedEmail,
      );
      if (existing) {
        setError('This email already has an account. Please sign in instead.');
        return;
      }

      const newAccount: StoredAccount = {
        id: generateId('usr'),
        provider: 'email',
        displayName: cleanName,
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      saveAccounts([...accounts, newAccount]);
      onAuthenticated({
        id: newAccount.id,
        provider: 'email',
        displayName: newAccount.displayName,
        email: newAccount.email,
        createdAt: newAccount.createdAt,
      });
      return;
    }

    const matched = accounts.find(
      (a) => a.provider === 'email' && a.email === normalizedEmail,
    );
    if (!matched) {
      setError(
        'No account found for this email. Tap "Create Free Account" below.',
      );
      return;
    }
    if (matched.passwordHash !== hashPassword(password)) {
      setError('That password did not match. Please try again.');
      return;
    }

    onAuthenticated({
      id: matched.id,
      provider: 'email',
      displayName: matched.displayName,
      email: matched.email,
      createdAt: matched.createdAt,
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digitsOnly = phoneInput.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Please enter a valid phone number (7 to 15 digits).');
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpInput('');
    setResendCooldown(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otpInput.trim() !== generatedOtp) {
      setError(
        'Code did not match. Please check the 6-digit number shown above.',
      );
      return;
    }

    const normalizedPhone = phoneInput.trim();
    const accounts = loadAccounts();
    let matched = accounts.find(
      (a) => a.provider === 'phone' && a.phoneNumber === normalizedPhone,
    );

    if (!matched) {
      matched = {
        id: generateId('phn'),
        provider: 'phone',
        displayName: 'Athlete',
        phoneNumber: normalizedPhone,
        createdAt: new Date().toISOString(),
      };
      saveAccounts([...accounts, matched]);
    }

    onAuthenticated({
      id: matched.id,
      provider: 'phone',
      displayName: matched.displayName,
      phoneNumber: matched.phoneNumber,
      createdAt: matched.createdAt,
    });
  };

  const handleGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = googleEmail.trim().toLowerCase();
    const cleanName =
      googleName.trim() || cleanEmail.split('@')[0] || 'Athlete';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your Google email address.');
      return;
    }

    const accounts = loadAccounts();
    let matched = accounts.find(
      (a) => a.provider === 'google' && a.email === cleanEmail,
    );

    if (!matched) {
      matched = {
        id: generateId('ggl'),
        provider: 'google',
        displayName: cleanName,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      };
      saveAccounts([...accounts, matched]);
    }

    onAuthenticated({
      id: matched.id,
      provider: 'google',
      displayName: matched.displayName,
      email: matched.email,
      createdAt: matched.createdAt,
    });
  };

  const handleContinueExistingGoogle = (acc: StoredAccount) => {
    onAuthenticated({
      id: acc.id,
      provider: 'google',
      displayName: acc.displayName,
      email: acc.email,
      createdAt: acc.createdAt,
    });
  };

  const handleContinueGuest = () => {
    onAuthenticated({
      id: 'guest_local',
      provider: 'guest',
      displayName: 'Guest',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#182026]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-4 py-8 sm:px-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Left: Authentic Editorial Brand & Tayyab Ghafoor Creator Showcase */}
        <div className="space-y-6 lg:col-span-7">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={ironlogLogo}
                alt="IronLog Lion Weightlifting Logo"
                className="h-12 w-12 shrink-0 rounded-xl border border-[#d6d1c7] object-cover shadow-sm"
              />
              <div className="font-display text-4xl font-extrabold tracking-tight text-[#182026]">
                IRON<span className="text-[#0f766e]">LOG</span>
              </div>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#182026] sm:text-5xl [text-wrap:balance]">
              Built for Serious, Consistent Training.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#475569]">
              Track every lift honestly, learn proper technique across 26 guided
              exercises, and build real strength session by session.
            </p>
          </div>

          {/* Medium-Large Creator Portrait + Tayyab Ghafoor Quote Card */}
          <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-72 w-full shrink-0 overflow-hidden rounded-xl border border-[#e5e2dc] bg-[#f3f1ec] sm:h-80 sm:w-60">
                {!heroImgFailed ? (
                  <img
                    src={CREATOR_PHOTO_URL}
                    alt="Tayyab Ghafoor — IronLog Creator"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    style={{ objectPosition: '50% 14%' }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f3f1ec]">
                    <Dumbbell className="h-14 w-14 text-[#0f766e]/40" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                    Founder &amp; Creator
                  </div>
                  <div className="font-display text-3xl font-extrabold tracking-tight text-[#182026]">
                    Tayyab Ghafoor
                  </div>
                </div>

                <blockquote className="text-base leading-relaxed text-[#182026]">
                  &ldquo;I built IronLog for lifters who show up week after week
                  for serious, consistent training—no clutter, no fake numbers,
                  just clear form guidance and honest progress from your first
                  rep.&rdquo;
                </blockquote>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#e5e2dc] pt-3.5 text-xs font-semibold text-[#64748b]">
                  <span className="text-[#0f766e]">26 Exercise Guides</span>
                  <span aria-hidden="true">·</span>
                  <span>Male Muscle Anatomy</span>
                  <span aria-hidden="true">·</span>
                  <span>Rest Timer &amp; History</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured Sign In Flow (1. Email/Password -> 2. Google & Phone -> 3. Guest at Bottom) */}
        <div className="mx-auto w-full max-w-md lg:col-span-5">
          <div className="space-y-5 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#182026]">
                {mode === 'email-signup'
                  ? 'Create Account'
                  : mode === 'phone'
                    ? 'Sign In with Phone'
                    : mode === 'google'
                      ? 'Continue with Google'
                      : 'Sign In'}
              </h2>
              <p className="mt-1 text-sm text-[#475569]">
                {mode === 'email-signup'
                  ? 'Save your profile, stats, and workout logs safely.'
                  : mode === 'phone'
                    ? 'Enter your mobile number to receive a 6-digit verification code.'
                    : mode === 'google'
                      ? 'Use your Google email to sync and save your workouts.'
                      : 'Sign in with your email and password to continue training.'}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
              >
                {error}
              </div>
            )}

            {/* 1. Prominent Email & Password Sign In / Sign Up */}
            {(mode === 'email-signin' || mode === 'email-signup') && (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'email-signup' && (
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#182026]">
                      Full Name
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                    />
                  </label>
                )}

                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#182026]">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#182026]">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete={
                        mode === 'email-signup'
                          ? 'new-password'
                          : 'current-password'
                      }
                      className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] pl-4 pr-12 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748b] hover:text-[#182026]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-base font-bold text-white transition-colors hover:bg-[#0d625b]"
                >
                  <Mail className="h-5 w-5" />
                  {mode === 'email-signup' ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center text-sm text-[#475569]">
                  {mode === 'email-signin' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('email-signup')}
                        className="font-bold text-[#0f766e] underline hover:text-[#0d625b]"
                      >
                        Create Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('email-signin')}
                        className="font-bold text-[#0f766e] underline hover:text-[#0d625b]"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}

            {/* Phone + OTP Flow */}
            {mode === 'phone' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    switchMode('email-signin');
                  }}
                  className="inline-flex min-h-[38px] items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-[#182026]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </button>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-[#182026]">
                        Phone Number
                      </span>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+1 555 234 5678"
                        autoComplete="tel"
                        className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                      />
                    </label>
                    <button
                      type="submit"
                      className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-base font-bold text-white transition-colors hover:bg-[#0d625b]"
                    >
                      <Phone className="h-5 w-5" />
                      Send 6-Digit Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-sm text-emerald-900">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <ShieldCheck className="h-4 w-4" />
                        Your Verification Code
                      </div>
                      <p className="mt-1">
                        Enter this code for{' '}
                        <span className="font-semibold text-[#182026]">
                          {phoneInput}
                        </span>
                        :{' '}
                        <span className="font-mono-tabular text-base font-extrabold tracking-widest text-amber-700">
                          {generatedOtp}
                        </span>
                      </p>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-[#182026]">
                        6-Digit Code
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) =>
                          setOtpInput(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="000000"
                        className="h-13 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-center font-mono-tabular text-xl font-bold tracking-[0.35em] text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                      />
                    </label>

                    <button
                      type="submit"
                      className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-base font-bold text-white transition-colors hover:bg-[#0d625b]"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Verify &amp; Continue
                    </button>

                    <div className="flex items-center justify-between text-sm text-[#475569]">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="hover:text-[#182026]"
                      >
                        Edit number
                      </button>
                      <button
                        type="button"
                        disabled={resendCooldown > 0}
                        onClick={(e) => handleSendOtp(e)}
                        className="font-semibold text-[#0f766e] disabled:text-[#94a3b8]"
                      >
                        {resendCooldown > 0
                          ? `Wait ${resendCooldown}s`
                          : 'Send new code'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Google Account Flow */}
            {mode === 'google' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => switchMode('email-signin')}
                  className="inline-flex min-h-[38px] items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-[#182026]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </button>

                {savedGoogleAccounts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#475569]">
                      Saved Google Accounts
                    </div>
                    {savedGoogleAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleContinueExistingGoogle(acc)}
                        className="flex min-h-[54px] w-full items-center justify-between rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 py-2.5 text-left transition-colors hover:border-[#0f766e]"
                      >
                        <div>
                          <div className="text-sm font-bold text-[#182026]">
                            {acc.displayName}
                          </div>
                          <div className="text-xs text-[#64748b]">
                            {acc.email}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#0f766e]">
                          Open →
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleGoogleSignIn} className="space-y-3.5">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#182026]">
                      Your Name
                    </span>
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Your name"
                      className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#182026]">
                      Google Email
                    </span>
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#182026] px-4 text-base font-bold text-white transition-colors hover:bg-[#293540]"
                  >
                    Continue with Google
                  </button>
                </form>
              </div>
            )}

            {/* 2. Continue with Google + Phone Number */}
            {(mode === 'email-signin' || mode === 'email-signup') && (
              <>
                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-[#e5e2dc]" />
                  <span className="mx-3 shrink-0 text-xs font-medium text-[#64748b]">
                    or
                  </span>
                  <div className="flex-grow border-t border-[#e5e2dc]" />
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => switchMode('google')}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-sm font-bold text-[#182026] transition-colors hover:border-[#0f766e]/50 hover:bg-[#f3f1ec]"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('phone')}
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-4 text-sm font-semibold text-[#182026] transition-colors hover:border-[#0f766e]/50 hover:bg-[#f3f1ec]"
                  >
                    <Phone className="h-4 w-4 text-[#0f766e]" />
                    Sign In with Phone Number
                  </button>
                </div>
              </>
            )}

            {/* 3. Continue as Guest — Secondary Option at the Very Bottom */}
            <div className="border-t border-[#e5e2dc] pt-4">
              <button
                type="button"
                onClick={handleContinueGuest}
                className="flex min-h-[46px] w-full items-center justify-between rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 py-2.5 text-left transition-colors hover:border-[#0f766e]/40 hover:bg-[#efede7]"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[#475569]">
                  <UserCheck className="h-4 w-4 text-[#0f766e]" />
                  Continue as Guest
                </span>
                <span className="text-xs font-semibold text-[#64748b]">
                  Try without account →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
