import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Dumbbell,
  Home,
  LogOut,
  Play,
  User,
} from 'lucide-react';
import ironlogLogo from './assets/ironlog-logo.jpg';
import {
  DEFAULT_PREFERENCES,
  EXERCISE_LIBRARY,
} from './data/exercises';
import {
  AppTab,
  AuthUser,
  ExerciseDefinition,
  FitnessGoal,
  IronLogBackupPayload,
  LoggedExercise,
  RoutineTemplate,
  UserPreferences,
  WeightUnit,
  WorkoutSession,
} from './types/fitness';
import {
  generateId,
  loadCurrentAuthUser,
  loadUserActiveSession,
  loadUserHistory,
  loadUserPreferences,
  saveCurrentAuthUser,
  saveUserActiveSession,
  saveUserHistory,
  saveUserPreferences,
} from './utils/storage';
import { formatDuration } from './utils/units';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { ExerciseLibraryView } from './views/ExerciseLibraryView';
import { ProfileView } from './views/ProfileView';
import { ProgressView } from './views/ProgressView';
import { WorkoutLoggerView } from './views/WorkoutLoggerView';

function playRestChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.46);
  } catch {
    // Ignore audio context restrictions
  }
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() =>
    loadCurrentAuthUser(),
  );
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    authUser ? loadUserPreferences(authUser) : DEFAULT_PREFERENCES,
  );
  const [history, setHistory] = useState<WorkoutSession[]>(() =>
    authUser ? loadUserHistory(authUser.id) : [],
  );
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(
    () => (authUser ? loadUserActiveSession(authUser.id) : null),
  );

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [restTotal, setRestTotal] = useState<number>(
    preferences.defaultRestSeconds,
  );
  const [restRemaining, setRestRemaining] = useState<number>(
    preferences.defaultRestSeconds,
  );
  const [restRunning, setRestRunning] = useState<boolean>(false);

  const [pendingRoutine, setPendingRoutine] = useState<RoutineTemplate | null>(
    null,
  );
  const [profileSectionTarget, setProfileSectionTarget] = useState<
    'membership' | 'help' | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const handleAuthenticated = useCallback((user: AuthUser) => {
    saveCurrentAuthUser(user);
    const loadedPrefs = loadUserPreferences(user);
    const loadedHistory = loadUserHistory(user.id);
    const loadedActive = loadUserActiveSession(user.id);

    setAuthUser(user);
    setPreferences(loadedPrefs);
    setHistory(loadedHistory);
    setActiveSession(loadedActive);
    setRestTotal(loadedPrefs.defaultRestSeconds);
    setRestRemaining(loadedPrefs.defaultRestSeconds);
    setRestRunning(false);
    setActiveTab('dashboard');
  }, []);

  const handleSignOut = useCallback(() => {
    saveCurrentAuthUser(null);
    setAuthUser(null);
    setRestRunning(false);
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!authUser) return;
    saveUserPreferences(authUser.id, preferences);
  }, [authUser, preferences]);

  useEffect(() => {
    if (!authUser) return;
    saveUserHistory(authUser.id, history);
  }, [authUser, history]);

  useEffect(() => {
    if (!authUser) return;
    saveUserActiveSession(authUser.id, activeSession);
  }, [authUser, activeSession]);

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }
    const updateElapsed = () => {
      const diff = Math.floor(
        (Date.now() - new Date(activeSession.startedAt).getTime()) / 1000,
      );
      setElapsedSeconds(Math.max(0, diff));
    };
    updateElapsed();
    const id = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(id);
  }, [activeSession]);

  useEffect(() => {
    if (!restRunning) return;
    const id = window.setInterval(() => {
      setRestRemaining((prev) => {
        if (prev <= 1) {
          setRestRunning(false);
          if (preferences.soundEnabled) {
            playRestChime();
          }
          showToast('Rest break done — ready for your next set!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [restRunning, preferences.soundEnabled, showToast]);

  const handleUpdatePreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const next = { ...prev, ...patch };
        if (typeof patch.defaultRestSeconds === 'number' && !restRunning) {
          setRestTotal(patch.defaultRestSeconds);
          setRestRemaining(patch.defaultRestSeconds);
        }
        return next;
      });
    },
    [restRunning],
  );

  const handleApplyBmiGoal = useCallback(
    (goal: FitnessGoal, weeklyWorkouts: number, restSeconds: number) => {
      handleUpdatePreferences({
        fitnessGoal: goal,
        weeklyGoalWorkouts: weeklyWorkouts,
        defaultRestSeconds: restSeconds,
      });
      showToast(
        `Saved BMI plan: ${goal}, ${weeklyWorkouts} days/week, ${restSeconds}s rest.`,
      );
    },
    [handleUpdatePreferences, showToast],
  );

  const handleNavigateTab = useCallback(
    (tab: AppTab, section?: 'membership' | 'help') => {
      setProfileSectionTarget(tab === 'profile' ? section ?? null : null);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  const handleStartEmptyWorkout = useCallback(() => {
    const newSession: WorkoutSession = {
      id: generateId('session'),
      title: 'My Workout',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: [],
    };
    setActiveSession(newSession);
    setActiveTab('workout');
  }, []);

  const launchRoutine = useCallback((routine: RoutineTemplate) => {
    const loggedExercises: LoggedExercise[] = routine.exercises
      .map((spec) => {
        const def = EXERCISE_LIBRARY.find((e) => e.id === spec.exerciseId);
        if (!def) return null;
        return {
          id: generateId('ex'),
          exerciseId: def.id,
          exerciseName: def.name,
          muscleGroup: def.muscleGroup,
          sets: Array.from({ length: spec.defaultSets }, () => ({
            id: generateId('set'),
            weightKg: spec.suggestedWeightKg,
            reps: spec.targetReps,
            completed: false,
          })),
        };
      })
      .filter((item): item is LoggedExercise => item !== null);

    const session: WorkoutSession = {
      id: generateId('session'),
      title: routine.name,
      routineId: routine.id,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: loggedExercises,
    };

    setActiveSession(session);
    setActiveTab('workout');
  }, []);

  const handleStartRoutine = useCallback(
    (routine: RoutineTemplate) => {
      if (activeSession) {
        setPendingRoutine(routine);
        return;
      }
      launchRoutine(routine);
    },
    [activeSession, launchRoutine],
  );

  const handleRepeatSession = useCallback((pastSession: WorkoutSession) => {
    const clonedExercises: LoggedExercise[] = pastSession.exercises.map(
      (ex) => ({
        id: generateId('ex'),
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets.map((s) => ({
          id: generateId('set'),
          weightKg: s.weightKg,
          reps: s.reps,
          completed: false,
        })),
      }),
    );

    const newSession: WorkoutSession = {
      id: generateId('session'),
      title: pastSession.title,
      routineId: pastSession.routineId,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: clonedExercises,
    };
    setActiveSession(newSession);
    setActiveTab('workout');
  }, []);

  const handleAddExerciseToWorkout = useCallback(
    (exercise: ExerciseDefinition) => {
      const newLogged: LoggedExercise = {
        id: generateId('ex'),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: [
          {
            id: generateId('set'),
            weightKg: exercise.equipment === 'Bodyweight' ? 0 : 15,
            reps: 10,
            completed: false,
          },
          {
            id: generateId('set'),
            weightKg: exercise.equipment === 'Bodyweight' ? 0 : 15,
            reps: 10,
            completed: false,
          },
          {
            id: generateId('set'),
            weightKg: exercise.equipment === 'Bodyweight' ? 0 : 15,
            reps: 10,
            completed: false,
          },
        ],
      };

      setActiveSession((prev) => {
        if (!prev) {
          return {
            id: generateId('session'),
            title: `${exercise.muscleGroup} Workout`,
            startedAt: new Date().toISOString(),
            durationSeconds: 0,
            exercises: [newLogged],
          };
        }
        return {
          ...prev,
          exercises: [...prev.exercises, newLogged],
        };
      });
    },
    [],
  );

  const handleRemoveExercise = useCallback((loggedExerciseId: string) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== loggedExerciseId),
      };
    });
  }, []);

  const handleAddSet = useCallback((loggedExerciseId: string) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== loggedExerciseId) return ex;
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: generateId('set'),
                weightKg: lastSet ? lastSet.weightKg : 15,
                reps: lastSet ? lastSet.reps : 10,
                completed: false,
              },
            ],
          };
        }),
      };
    });
  }, []);

  const handleRemoveSet = useCallback(
    (loggedExerciseId: string, setId: string) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          exercises: prev.exercises.map((ex) => {
            if (ex.id !== loggedExerciseId || ex.sets.length <= 1) return ex;
            return {
              ...ex,
              sets: ex.sets.filter((s) => s.id !== setId),
            };
          }),
        };
      });
    },
    [],
  );

  const handleUpdateSet = useCallback(
    (
      loggedExerciseId: string,
      setId: string,
      patch: { weightKg?: number; reps?: number; completed?: boolean },
    ) => {
      if (patch.completed === true && preferences.autoStartRestTimer) {
        setRestTotal(preferences.defaultRestSeconds);
        setRestRemaining(preferences.defaultRestSeconds);
        setRestRunning(true);
      }

      setActiveSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          exercises: prev.exercises.map((ex) => {
            if (ex.id !== loggedExerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, ...patch } : s,
              ),
            };
          }),
        };
      });
    },
    [preferences.autoStartRestTimer, preferences.defaultRestSeconds],
  );

  const handleFinishWorkout = useCallback(() => {
    if (!activeSession) return;
    const completedSession: WorkoutSession = {
      ...activeSession,
      title: activeSession.title.trim() || 'Workout Session',
      completedAt: new Date().toISOString(),
      durationSeconds: Math.max(60, elapsedSeconds),
    };
    setHistory((prev) => [completedSession, ...prev]);
    setActiveSession(null);
    setRestRunning(false);
    setRestRemaining(preferences.defaultRestSeconds);
    setActiveTab('progress');
    showToast(`Great job! Saved "${completedSession.title}".`);
  }, [activeSession, elapsedSeconds, preferences.defaultRestSeconds, showToast]);

  const handleDiscardWorkout = useCallback(() => {
    setActiveSession(null);
    setRestRunning(false);
    setRestRemaining(preferences.defaultRestSeconds);
    setActiveTab('dashboard');
    showToast('Workout cancelled.');
  }, [preferences.defaultRestSeconds, showToast]);

  const handleImportBackup = useCallback((payload: IronLogBackupPayload) => {
    setPreferences(payload.preferences);
    setHistory(payload.history);
    setActiveSession(payload.activeSession);
    setRestTotal(payload.preferences.defaultRestSeconds);
    setRestRemaining(payload.preferences.defaultRestSeconds);
    setRestRunning(false);
  }, []);

  if (!authUser) {
    return <AuthView onAuthenticated={handleAuthenticated} />;
  }

  const navItems: {
    id: AppTab;
    label: string;
    mobileLabel: string;
    icon: typeof Home;
  }[] = [
    { id: 'dashboard', label: 'Home', mobileLabel: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', mobileLabel: 'Workout', icon: Dumbbell },
    {
      id: 'exercises',
      label: 'Body Guide',
      mobileLabel: 'Guide',
      icon: BookOpen,
    },
    {
      id: 'progress',
      label: 'Progress',
      mobileLabel: 'Progress',
      icon: BarChart3,
    },
    {
      id: 'profile',
      label: 'My Profile',
      mobileLabel: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#182026]">
      {/* Desktop Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-[#e5e2dc] bg-[#ffffff] p-5 lg:flex">
        <div className="space-y-8">
          <div className="px-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 font-display text-3xl font-extrabold tracking-tight text-[#182026] whitespace-nowrap"
            >
              <img
                src={ironlogLogo}
                alt="IronLog Lion Weightlifting Logo"
                className="h-10 w-10 shrink-0 rounded-xl border border-[#d6d1c7] object-cover shadow-sm"
              />
              <span>
                IRON<span className="text-[#0f766e]">LOG</span>
              </span>
            </button>
          </div>

          <nav aria-label="Main navigation" className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex min-h-[48px] w-full items-center justify-between rounded-xl px-4 text-sm font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0f766e]/10 text-[#0f766e]'
                      : 'text-[#475569] hover:bg-[#f3f1ec] hover:text-[#182026]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'workout' && activeSession && (
                    <span className="font-mono-tabular text-xs font-bold text-amber-700">
                      {formatDuration(elapsedSeconds)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-[#e5e2dc] pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#f3f1ec]"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#e5e2dc] bg-[#f7f6f2]">
              {preferences.photoDataUrl ? (
                <img
                  src={preferences.photoDataUrl}
                  alt={preferences.displayName}
                  className="h-full w-full object-cover object-[50%_18%]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#0f766e]">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-[#182026]">
                {preferences.displayName || 'Athlete'}
              </div>
              <div className="truncate text-xs text-[#64748b]">
                {preferences.fitnessGoal}
              </div>
            </div>
          </button>

          {activeSession ? (
            <button
              type="button"
              onClick={() => setActiveTab('workout')}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0d625b] whitespace-nowrap"
            >
              <Activity className="h-4 w-4" />
              Resume ({formatDuration(elapsedSeconds)})
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartEmptyWorkout}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0d625b] whitespace-nowrap"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Workout
            </button>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[#e5e2dc] bg-[#faf9f6] px-4 text-xs font-bold text-[#475569] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 whitespace-nowrap"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar (52px) */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#e5e2dc] bg-[#ffffff]/95 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-[#182026] whitespace-nowrap shrink-0"
        >
          <img
            src={ironlogLogo}
            alt="IronLog Lion Weightlifting Logo"
            className="h-8 w-8 shrink-0 rounded-lg border border-[#d6d1c7] object-cover shadow-sm"
          />
          <span>
            IRON<span className="text-[#0f766e]">LOG</span>
          </span>
        </button>

        {activeSession ? (
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className="flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 text-xs font-bold text-white whitespace-nowrap shrink-0"
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="font-mono-tabular">
              {formatDuration(elapsedSeconds)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartEmptyWorkout}
            className="flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 text-xs font-bold text-white whitespace-nowrap shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Start
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:ml-64 lg:px-10 lg:py-8 lg:pb-12">
        {toastMessage && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm"
          >
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
              {toastMessage}
            </span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            preferences={preferences}
            history={history}
            activeSession={activeSession}
            elapsedSeconds={elapsedSeconds}
            onStartEmptyWorkout={handleStartEmptyWorkout}
            onStartRoutine={handleStartRoutine}
            onRepeatSession={handleRepeatSession}
            onResumeWorkout={() => setActiveTab('workout')}
            onNavigateTab={handleNavigateTab}
            onUpdatePreferences={handleUpdatePreferences}
            onApplyBmiGoal={handleApplyBmiGoal}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutLoggerView
            activeSession={activeSession}
            history={history}
            preferences={preferences}
            elapsedSeconds={elapsedSeconds}
            restRemaining={restRemaining}
            restTotal={restTotal}
            restRunning={restRunning}
            onToggleUnit={(u: WeightUnit) =>
              handleUpdatePreferences({ preferredUnit: u })
            }
            onStartEmptyWorkout={handleStartEmptyWorkout}
            onStartRoutine={handleStartRoutine}
            onUpdateTitle={(title: string) =>
              setActiveSession((prev) => (prev ? { ...prev, title } : null))
            }
            onAddExercise={handleAddExerciseToWorkout}
            onRemoveExercise={handleRemoveExercise}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
            onUpdateSet={handleUpdateSet}
            onFinishWorkout={handleFinishWorkout}
            onDiscardWorkout={handleDiscardWorkout}
            onRestToggleRun={() => {
              if (restRemaining === 0) {
                setRestRemaining(restTotal);
              }
              setRestRunning((r) => !r);
            }}
            onRestReset={() => {
              setRestRunning(false);
              setRestRemaining(restTotal);
            }}
            onRestAdjust={(delta) => {
              setRestRemaining((prev) => Math.max(0, prev + delta));
              if (restRemaining + delta > restTotal) {
                setRestTotal(restRemaining + delta);
              }
            }}
            onRestSelectPreset={(sec) => {
              setRestTotal(sec);
              setRestRemaining(sec);
              setRestRunning(true);
            }}
            onToggleSound={() =>
              handleUpdatePreferences({
                soundEnabled: !preferences.soundEnabled,
              })
            }
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibraryView
            hasActiveSession={Boolean(activeSession)}
            onAddExerciseToWorkout={(exercise) => {
              handleAddExerciseToWorkout(exercise);
              showToast(`Added ${exercise.name} to your workout.`);
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            history={history}
            preferences={preferences}
            onStartEmptyWorkout={handleStartEmptyWorkout}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            authUser={authUser}
            preferences={preferences}
            history={history}
            activeSession={activeSession}
            sectionTarget={profileSectionTarget}
            onClearSectionTarget={() => setProfileSectionTarget(null)}
            onUpdatePreferences={handleUpdatePreferences}
            onImportBackup={handleImportBackup}
            onClearAllHistory={() => setHistory([])}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation (64px) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-30 grid h-16 grid-cols-5 items-center border-t border-[#e5e2dc] bg-[#ffffff]/95 backdrop-blur-md pb-safe lg:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigateTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#0f766e]' : 'text-[#64748b] hover:text-[#182026]'
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'bg-[#0f766e]/12 text-[#0f766e]' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`text-[11px] tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#0f766e]' : 'font-medium'
                }`}
              >
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Routine Conflict Modal */}
      {pendingRoutine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#182026]/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Replace current workout"
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-6 shadow-xl">
            <h2 className="font-display text-2xl font-bold text-[#182026]">
              Start {pendingRoutine.name} Instead?
            </h2>
            <p className="text-base leading-relaxed text-[#475569]">
              You already have{' '}
              <span className="font-bold text-[#182026]">
                {activeSession?.title}
              </span>{' '}
              open. Starting{' '}
              <span className="font-bold text-[#0f766e]">
                {pendingRoutine.name}
              </span>{' '}
              will replace it.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setPendingRoutine(null);
                  setActiveTab('workout');
                }}
                className="min-h-[46px] rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-sm font-bold text-[#182026] hover:bg-[#eeebe4]"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={() => {
                  const routine = pendingRoutine;
                  setPendingRoutine(null);
                  launchRoutine(routine);
                }}
                className="min-h-[46px] rounded-xl bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#0d625b]"
              >
                Start {pendingRoutine.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
