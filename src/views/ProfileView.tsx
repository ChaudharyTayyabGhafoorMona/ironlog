import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Download,
  LogOut,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { AppRatingAndHelp } from '../components/AppRatingAndHelp';
import { MembershipPlansCard } from '../components/MembershipPlansCard';
import { CREATOR_PHOTO_URL } from '../data/exercises';
import {
  AuthUser,
  FitnessGoal,
  GenderOption,
  IronLogBackupPayload,
  MembershipPlanId,
  UserPreferences,
  WeightUnit,
  WorkoutSession,
} from '../types/fitness';
import {
  buildBackupPayload,
  loadDeviceRatings,
  saveDeviceRating,
  StoredDeviceRating,
  validateBackupPayload,
} from '../utils/storage';
import { displayToKg, kgToDisplay } from '../utils/units';

interface ProfileViewProps {
  authUser: AuthUser;
  preferences: UserPreferences;
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
  sectionTarget?: 'membership' | 'help' | null;
  onClearSectionTarget?: () => void;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onImportBackup: (payload: IronLogBackupPayload) => void;
  onClearAllHistory: () => void;
  onSignOut: () => void;
}

const FITNESS_GOALS: FitnessGoal[] = ['Muscle Gain', 'Fat Loss', 'Strength'];
const GENDER_OPTIONS: GenderOption[] = ['Prefer not to say', 'Male', 'Female'];

async function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 256;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  authUser,
  preferences,
  history,
  activeSession,
  sectionTarget,
  onClearSectionTarget,
  onUpdatePreferences,
  onImportBackup,
  onClearAllHistory,
  onSignOut,
}) => {
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [deviceRatings, setDeviceRatings] = useState<StoredDeviceRating[]>(() =>
    loadDeviceRatings(),
  );

  const backupInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const unit = preferences.preferredUnit;

  useEffect(() => {
    if (!sectionTarget) return;
    const targetId =
      sectionTarget === 'membership'
        ? 'membership-plans-section'
        : 'help-center-section';
    const timer = window.setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onClearSectionTarget?.();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [sectionTarget, onClearSectionTarget]);

  const accountLabel =
    authUser.provider === 'google'
      ? 'Google Account'
      : authUser.provider === 'phone'
        ? 'Phone Account'
        : authUser.provider === 'email'
          ? 'Email Account'
          : 'Guest Session';

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      onUpdatePreferences({ photoDataUrl: dataUrl });
      setFeedback({
        type: 'success',
        message: 'Profile photo saved.',
      });
    } catch {
      setFeedback({
        type: 'error',
        message: 'Could not open that image. Please try another photo.',
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleExportJson = () => {
    const payload = buildBackupPayload(preferences, history, activeSession);
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().slice(0, 10);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ironlog-backup-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedback({
      type: 'success',
      message: `Backup saved (${history.length} workouts exported).`,
    });
  };

  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = validateBackupPayload(text);
      if (result.ok === false) {
        setFeedback({ type: 'error', message: result.error });
      } else {
        onImportBackup(result.data);
        setFeedback({
          type: 'success',
          message: `Loaded ${result.data.history.length} workouts into your profile.`,
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Could not read that file.',
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleSelectPlan = (planId: MembershipPlanId) => {
    onUpdatePreferences({ membershipPlan: planId });
    setFeedback({
      type: 'success',
      message:
        planId === 'free'
          ? 'Switched to the Free Starter plan.'
          : 'Membership features are now unlocked on your account.',
    });
  };

  const handleSubmitRating = (stars: number, comment: string) => {
    const record = {
      stars,
      feedback: comment,
      updatedAt: new Date().toISOString(),
    };
    onUpdatePreferences({ appRating: record });
    const updated = saveDeviceRating(authUser.id, record);
    setDeviceRatings(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#182026] sm:text-4xl">
            My Profile &amp; Membership
          </h1>
          <p className="mt-1 text-base text-[#475569]">
            Update your details, manage your plan, rate the app, or get help.
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-rose-300 bg-[#ffffff] px-5 text-sm font-bold text-rose-700 shadow-sm transition-colors hover:bg-rose-50 whitespace-nowrap shrink-0"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-rose-300 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Close
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Profile Details */}
        <section className="space-y-6 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6 lg:col-span-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#f7f6f2]">
                {preferences.photoDataUrl ? (
                  <img
                    src={preferences.photoDataUrl}
                    alt="Profile"
                    className="h-full w-full object-cover object-[50%_18%]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#0f766e]">
                    <User className="h-9 w-9" />
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[#182026]">
                  {preferences.displayName || 'Athlete'}
                </h2>
                <p className="text-sm text-[#475569]">
                  {accountLabel} ·{' '}
                  <span className="tabular-nums">
                    {history.length} workouts
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-xs font-bold text-[#182026] transition-colors hover:border-[#0f766e]"
              >
                <Camera className="h-4 w-4 text-[#0f766e]" />
                {preferences.photoDataUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdatePreferences({
                    photoDataUrl: CREATOR_PHOTO_URL,
                  })
                }
                className="min-h-[44px] rounded-xl border border-[#d6d1c7] bg-[#ffffff] px-3 text-xs font-semibold text-[#475569] hover:text-[#182026]"
              >
                Use Gym Avatar
              </button>
              {preferences.photoDataUrl && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({ photoDataUrl: undefined })
                  }
                  className="min-h-[44px] rounded-xl px-2.5 text-xs font-semibold text-[#64748b] hover:text-rose-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Full Name
              </span>
              <input
                type="text"
                value={preferences.displayName}
                onChange={(e) =>
                  onUpdatePreferences({ displayName: e.target.value })
                }
                placeholder="Your full name"
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Email
              </span>
              <input
                type="email"
                value={preferences.email}
                onChange={(e) => onUpdatePreferences({ email: e.target.value })}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Phone Number
              </span>
              <input
                type="tel"
                value={preferences.phoneNumber}
                onChange={(e) =>
                  onUpdatePreferences({ phoneNumber: e.target.value })
                }
                placeholder="+1 555 000 0000"
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="block text-sm font-semibold text-[#182026]">
                  Age
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={105}
                  value={preferences.age ?? ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdatePreferences({
                      age: Number.isNaN(val) ? null : Math.max(10, val),
                    });
                  }}
                  placeholder="28"
                  className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="block text-sm font-semibold text-[#182026]">
                  Height (cm)
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={90}
                  max={250}
                  value={preferences.heightCm ?? ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdatePreferences({
                      heightCm: Number.isNaN(val) ? null : Math.max(0, val),
                    });
                  }}
                  placeholder="175"
                  className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                />
              </label>
            </div>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Bodyweight ({unit})
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={20}
                max={350}
                step={0.5}
                value={
                  preferences.bodyWeightKg
                    ? kgToDisplay(preferences.bodyWeightKg, unit)
                    : ''
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdatePreferences({
                    bodyWeightKg: Number.isNaN(val)
                      ? null
                      : displayToKg(Math.max(0, val), unit),
                  });
                }}
                placeholder={unit === 'kg' ? '70' : '155'}
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Gender (optional)
              </span>
              <select
                value={preferences.gender}
                onChange={(e) =>
                  onUpdatePreferences({
                    gender: e.target.value as GenderOption,
                  })
                }
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 text-base text-[#182026] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Weight Unit
              </span>
              <div
                className="grid grid-cols-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] p-1"
                role="group"
                aria-label="Preferred weight unit"
              >
                {(['kg', 'lb'] as WeightUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => onUpdatePreferences({ preferredUnit: u })}
                    className={`min-h-[40px] rounded-lg text-xs font-bold uppercase transition-colors ${
                      preferences.preferredUnit === u
                        ? 'bg-[#0f766e] text-white'
                        : 'text-[#475569] hover:text-[#182026]'
                    }`}
                  >
                    {u === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-semibold text-[#182026]">
              My Fitness Goal
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {FITNESS_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => onUpdatePreferences({ fitnessGoal: goal })}
                  className={`min-h-[46px] rounded-xl border px-3 text-sm font-bold transition-colors ${
                    preferences.fitnessGoal === goal
                      ? 'border-[#0f766e] bg-teal-50 text-[#0f766e]'
                      : 'border-[#d6d1c7] bg-[#faf9f6] text-[#475569] hover:text-[#182026]'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Weekly Workout Target
              </span>
              <select
                value={preferences.weeklyGoalWorkouts}
                onChange={(e) =>
                  onUpdatePreferences({
                    weeklyGoalWorkouts: Number(e.target.value),
                  })
                }
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 text-base text-[#182026] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'workout' : 'workouts'} per week
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Default Rest Time
              </span>
              <select
                value={preferences.defaultRestSeconds}
                onChange={(e) =>
                  onUpdatePreferences({
                    defaultRestSeconds: Number(e.target.value),
                  })
                }
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 text-base text-[#182026] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              >
                {[45, 60, 90, 120, 150, 180].map((sec) => (
                  <option key={sec} value={sec}>
                    {sec} seconds
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3 border-t border-[#e5e2dc] pt-4">
            <label className="flex min-h-[46px] cursor-pointer items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#182026]">
                  Auto-Start Rest Timer
                </div>
                <div className="text-xs text-[#64748b]">
                  Starts counting down automatically after you mark a set done
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoStartRestTimer}
                onChange={(e) =>
                  onUpdatePreferences({ autoStartRestTimer: e.target.checked })
                }
                className="h-5 w-5 accent-[#0f766e]"
              />
            </label>

            <label className="flex min-h-[46px] cursor-pointer items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#182026]">
                  Rest Finish Sound
                </div>
                <div className="text-xs text-[#64748b]">
                  Plays a gentle chime when your rest break ends
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.soundEnabled}
                onChange={(e) =>
                  onUpdatePreferences({ soundEnabled: e.target.checked })
                }
                className="h-5 w-5 accent-[#0f766e]"
              />
            </label>
          </div>
        </section>

        {/* Save or Move Your Data */}
        <section className="flex flex-col justify-between space-y-6 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6 lg:col-span-5">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#182026]">
                Save or Move Your Data
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#475569]">
                Everything you log stays saved safely on this device under your
                account. You can also download a backup file anytime.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-base font-bold text-white transition-colors hover:bg-[#0d625b]"
              >
                <Download className="h-5 w-5" />
                Save Backup File (JSON)
              </button>

              <input
                ref={backupInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleBackupImport}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => backupInputRef.current?.click()}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-base font-semibold text-[#182026] transition-colors hover:border-[#0f766e]"
              >
                <Upload className="h-5 w-5" />
                Load Backup File
              </button>
            </div>
          </div>

          <div className="space-y-3 border-t border-[#e5e2dc] pt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Clear Data
            </div>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
                Erase Workout History
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllHistory();
                    setConfirmClear(false);
                    setFeedback({
                      type: 'success',
                      message: 'All workout history erased.',
                    });
                  }}
                  className="min-h-[42px] flex-1 rounded-lg bg-rose-600 px-3 text-xs font-bold text-white hover:bg-rose-500"
                >
                  Yes, Erase All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-[42px] rounded-lg px-3 text-xs font-semibold text-[#182026] hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Free vs Affordable Membership Plans */}
      <MembershipPlansCard
        currentPlan={preferences.membershipPlan}
        onSelectPlan={handleSelectPlan}
      />

      {/* App Rating & Help Center */}
      <AppRatingAndHelp
        currentRating={preferences.appRating}
        deviceRatings={deviceRatings}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
};
