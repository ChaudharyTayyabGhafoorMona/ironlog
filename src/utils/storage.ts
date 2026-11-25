import { DEFAULT_PREFERENCES } from '../data/exercises';
import {
  AppRatingRecord,
  AuthUser,
  GenderOption,
  IronLogBackupPayload,
  MembershipPlanId,
  StoredAccount,
  UserPreferences,
  WorkoutSession,
} from '../types/fitness';

const CURRENT_USER_KEY = 'ironlog_current_auth_v3';
const ACCOUNTS_KEY = 'ironlog_accounts_v3';
const APP_RATINGS_KEY = 'ironlog_device_ratings_v1';

function sanitizeGender(val: unknown): GenderOption {
  if (val === 'Male' || val === 'Female') return val;
  return 'Prefer not to say';
}

function sanitizeMembershipPlan(val: unknown): MembershipPlanId {
  if (
    val === 'monthly-starter' ||
    val === 'yearly-value' ||
    val === 'lifetime-pack'
  ) {
    return val;
  }
  return 'free';
}

function sanitizeRating(val: unknown): AppRatingRecord | undefined {
  if (!val || typeof val !== 'object') return undefined;
  const r = val as Partial<AppRatingRecord>;
  if (typeof r.stars !== 'number' || r.stars < 1 || r.stars > 5) {
    return undefined;
  }
  return {
    stars: Math.round(r.stars),
    feedback: typeof r.feedback === 'string' ? r.feedback.slice(0, 500) : '',
    updatedAt:
      typeof r.updatedAt === 'string' ? r.updatedAt : new Date().toISOString(),
  };
}

export interface StoredDeviceRating {
  userId: string;
  stars: number;
  feedback: string;
  updatedAt: string;
}

export function loadDeviceRatings(): StoredDeviceRating[] {
  try {
    const raw = localStorage.getItem(APP_RATINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredDeviceRating =>
        Boolean(
          item &&
            typeof item.userId === 'string' &&
            typeof item.stars === 'number' &&
            item.stars >= 1 &&
            item.stars <= 5,
        ),
    );
  } catch {
    return [];
  }
}

export function saveDeviceRating(
  userId: string,
  record: AppRatingRecord,
): StoredDeviceRating[] {
  const existing = loadDeviceRatings().filter((r) => r.userId !== userId);
  const next: StoredDeviceRating[] = [
    {
      userId,
      stars: record.stars,
      feedback: record.feedback,
      updatedAt: record.updatedAt,
    },
    ...existing,
  ];
  try {
    localStorage.setItem(APP_RATINGS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
  return next;
}

function userKey(userId: string, suffix: string): string {
  return `ironlog_u_${userId}_${suffix}_v3`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function hashPassword(raw: string): string {
  let h = 5381;
  for (let i = 0; i < raw.length; i += 1) {
    h = (h * 33) ^ raw.charCodeAt(i);
  }
  return `il_${(h >>> 0).toString(16)}`;
}

export function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadCurrentAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.id === 'string' && parsed.provider) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCurrentAuthUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore storage errors
  }
}

export function loadUserPreferences(user: AuthUser): UserPreferences {
  try {
    const raw = localStorage.getItem(userKey(user.id, 'prefs'));
    if (!raw) {
      return {
        ...DEFAULT_PREFERENCES,
        displayName: user.displayName || DEFAULT_PREFERENCES.displayName,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      };
    }
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      displayName: user.displayName || DEFAULT_PREFERENCES.displayName,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      ...parsed,
      gender: sanitizeGender(parsed.gender),
      membershipPlan: sanitizeMembershipPlan(parsed.membershipPlan),
      appRating: sanitizeRating(parsed.appRating),
      preferredUnit: parsed.preferredUnit === 'lb' ? 'lb' : 'kg',
      fitnessGoal:
        parsed.fitnessGoal === 'Fat Loss' || parsed.fitnessGoal === 'Strength'
          ? parsed.fitnessGoal
          : 'Muscle Gain',
      weeklyGoalWorkouts:
        typeof parsed.weeklyGoalWorkouts === 'number' &&
        parsed.weeklyGoalWorkouts >= 1 &&
        parsed.weeklyGoalWorkouts <= 7
          ? parsed.weeklyGoalWorkouts
          : DEFAULT_PREFERENCES.weeklyGoalWorkouts,
      defaultRestSeconds:
        typeof parsed.defaultRestSeconds === 'number' &&
        parsed.defaultRestSeconds >= 15 &&
        parsed.defaultRestSeconds <= 600
          ? parsed.defaultRestSeconds
          : DEFAULT_PREFERENCES.defaultRestSeconds,
    };
  } catch {
    return {
      ...DEFAULT_PREFERENCES,
      displayName: user.displayName || DEFAULT_PREFERENCES.displayName,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    };
  }
}

export function saveUserPreferences(
  userId: string,
  prefs: UserPreferences,
): void {
  try {
    localStorage.setItem(userKey(userId, 'prefs'), JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadUserHistory(userId: string): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(userKey(userId, 'history'));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserHistory(
  userId: string,
  history: WorkoutSession[],
): void {
  try {
    localStorage.setItem(userKey(userId, 'history'), JSON.stringify(history));
  } catch {
    // Ignore storage errors
  }
}

export function loadUserActiveSession(
  userId: string,
): WorkoutSession | null {
  try {
    const raw = localStorage.getItem(userKey(userId, 'active'));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.exercises)
    ) {
      return parsed as WorkoutSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUserActiveSession(
  userId: string,
  session: WorkoutSession | null,
): void {
  try {
    if (!session) {
      localStorage.removeItem(userKey(userId, 'active'));
    } else {
      localStorage.setItem(
        userKey(userId, 'active'),
        JSON.stringify(session),
      );
    }
  } catch {
    // Ignore storage errors
  }
}

export function buildBackupPayload(
  preferences: UserPreferences,
  history: WorkoutSession[],
  activeSession: WorkoutSession | null,
): IronLogBackupPayload {
  return {
    version: 3,
    exportedAt: new Date().toISOString(),
    preferences,
    history,
    activeSession,
  };
}

export function validateBackupPayload(
  rawText: string,
): { ok: true; data: IronLogBackupPayload } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(rawText) as Partial<IronLogBackupPayload>;
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'That file does not look like a valid backup.' };
    }
    if (!Array.isArray(parsed.history)) {
      return {
        ok: false,
        error: 'The backup file is missing your workout list.',
      };
    }

    const sanitizedHistory: WorkoutSession[] = parsed.history.filter(
      (item): item is WorkoutSession =>
        Boolean(
          item &&
            typeof item.id === 'string' &&
            typeof item.title === 'string' &&
            Array.isArray(item.exercises),
        ),
    );

    const prefs: UserPreferences = {
      ...DEFAULT_PREFERENCES,
      ...(parsed.preferences || {}),
      gender: sanitizeGender(parsed.preferences?.gender),
      membershipPlan: sanitizeMembershipPlan(
        parsed.preferences?.membershipPlan,
      ),
      appRating: sanitizeRating(parsed.preferences?.appRating),
      preferredUnit:
        parsed.preferences?.preferredUnit === 'lb' ? 'lb' : 'kg',
    };

    const active =
      parsed.activeSession &&
      typeof parsed.activeSession.id === 'string' &&
      Array.isArray(parsed.activeSession.exercises)
        ? parsed.activeSession
        : null;

    return {
      ok: true,
      data: {
        version: typeof parsed.version === 'number' ? parsed.version : 3,
        exportedAt: parsed.exportedAt || new Date().toISOString(),
        preferences: prefs,
        history: sanitizedHistory,
        activeSession: active,
      },
    };
  } catch {
    return {
      ok: false,
      error: 'Could not open that file. Please choose a valid IronLog backup file.',
    };
  }
}
