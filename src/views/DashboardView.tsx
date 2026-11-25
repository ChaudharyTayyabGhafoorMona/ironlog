import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Dumbbell,
  Heart,
  Play,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
} from 'lucide-react';
import { BmiPlannerCard } from '../components/BmiPlannerCard';
import { CREATOR_PHOTO_URL, QUICK_ROUTINES } from '../data/exercises';
import {
  AppTab,
  FitnessGoal,
  RoutineTemplate,
  UserPreferences,
  WorkoutSession,
} from '../types/fitness';
import { calculateBmi } from '../utils/bmi';
import {
  countWorkoutsLast7Days,
  formatDuration,
  formatDurationShort,
  formatShortDate,
  formatVolume,
  getSessionCompletedSets,
  getSessionVolumeKg,
} from '../utils/units';

interface DashboardViewProps {
  preferences: UserPreferences;
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
  elapsedSeconds: number;
  onStartEmptyWorkout: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onRepeatSession: (session: WorkoutSession) => void;
  onResumeWorkout: () => void;
  onNavigateTab: (tab: AppTab, section?: 'membership' | 'help') => void;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onApplyBmiGoal: (
    goal: FitnessGoal,
    weeklyWorkouts: number,
    restSeconds: number,
  ) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  preferences,
  history,
  activeSession,
  elapsedSeconds,
  onStartEmptyWorkout,
  onStartRoutine,
  onRepeatSession,
  onResumeWorkout,
  onNavigateTab,
  onUpdatePreferences,
  onApplyBmiGoal,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const weeklyCount = countWorkoutsLast7Days(history);
  const weeklyGoal = Math.max(1, preferences.weeklyGoalWorkouts);
  const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyGoal) * 100));

  const totalVolumeKg = history.reduce(
    (sum, s) => sum + getSessionVolumeKg(s),
    0,
  );
  const recentSessions = history.slice(0, 4);

  const activeCompletedSets = activeSession
    ? getSessionCompletedSets(activeSession)
    : 0;
  const activeTotalSets = activeSession
    ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    : 0;

  const hasBmiInputs = Boolean(
    calculateBmi(preferences.heightCm, preferences.bodyWeightKg),
  );

  const scrollToBmi = () => {
    const el = document.getElementById('bmi-planner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const beginnerSteps = [
    {
      stepNumber: 1,
      title: 'Enter Height & Weight / BMI',
      subtitle: hasBmiInputs
        ? 'BMI score ready — tap to edit anytime'
        : 'Type your height & weight to check BMI',
      done: hasBmiInputs,
      icon: Scale,
      onClick: scrollToBmi,
    },
    {
      stepNumber: 2,
      title: 'Get Your BMI Workout Plan',
      subtitle: hasBmiInputs
        ? 'Your tailored plan is ready below'
        : 'Automatic plan unlocks right after Step 1',
      done: hasBmiInputs,
      icon: Sparkles,
      onClick: scrollToBmi,
    },
    {
      stepNumber: 3,
      title: 'Follow Guide & Track Progress',
      subtitle:
        history.length > 0
          ? `${history.length} workout${history.length === 1 ? '' : 's'} saved in Progress`
          : 'Learn form in Body Guide & log sets',
      done: history.length > 0,
      icon: BookOpen,
      onClick: () =>
        onNavigateTab(history.length > 0 ? 'progress' : 'exercises'),
    },
    {
      stepNumber: 4,
      title: 'Profile & Membership',
      subtitle:
        preferences.membershipPlan === 'free'
          ? 'Free plan active · Affordable upgrades'
          : 'Membership active · Rate & Help Center',
      done: preferences.membershipPlan !== 'free',
      icon: Crown,
      onClick: () => onNavigateTab('profile', 'membership'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Active Session Banner */}
      {activeSession && (
        <section
          aria-label="Active workout"
          className="rounded-2xl border border-[#0f766e]/35 bg-teal-50 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0f766e]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0f766e]" />
                <span>Workout Running Now</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#182026] sm:text-3xl">
                {activeSession.title || 'Workout Session'}
              </h2>
              <p className="text-sm text-[#475569] tabular-nums">
                {activeSession.exercises.length} exercises
                <span aria-hidden="true"> · </span>
                {activeCompletedSets} of {activeTotalSets} sets done
              </p>
            </div>

            <button
              type="button"
              onClick={onResumeWorkout}
              className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 text-base font-bold text-white transition-colors hover:bg-[#0d625b] whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4 fill-current" />
              Back to Workout
            </button>
          </div>
        </section>
      )}

      {/* Clean Off-White Welcome Hero + Medium-Large Creator Photo */}
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-6 shadow-sm sm:p-7 lg:col-span-2">
          <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748b]">
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0f766e]">
                    <Award className="h-3.5 w-3.5" />
                    Built by Tayyab Ghafoor
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Hello, {preferences.displayName || 'Athlete'} ·{' '}
                    {preferences.fitnessGoal}
                  </span>
                </div>

                <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#182026] sm:text-5xl [text-wrap:balance]">
                  Ready for Today’s Workout?
                </h1>
                <p className="text-base leading-relaxed text-[#475569]">
                  Follow the 4 simple steps below to check your BMI, get a
                  custom plan, and track every workout cleanly.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={
                    activeSession ? onResumeWorkout : onStartEmptyWorkout
                  }
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#0f766e] px-7 text-base font-bold text-white transition-transform duration-150 hover:bg-[#0d625b] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  <Dumbbell className="h-5 w-5" />
                  {activeSession ? 'Return to Workout' : 'Start Workout'}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('progress')}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-5 text-base font-semibold text-[#182026] transition-colors hover:border-[#0f766e]/50 hover:bg-[#efede7] whitespace-nowrap shrink-0"
                >
                  My Progress
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Medium-Large Crisp Creator Photo Frame */}
            <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#f3f1ec] sm:h-68 sm:w-52">
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
                <div className="flex h-full w-full items-center justify-center">
                  <Dumbbell className="h-14 w-14 text-[#0f766e]/35" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simple Weekly Goal Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#182026]">
                This Week’s Goal
              </span>
              <Target className="h-5 w-5 text-amber-600" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono-tabular text-4xl font-bold text-[#182026]">
                {weeklyCount}
              </span>
              <span className="text-sm text-[#475569] tabular-nums">
                of {weeklyGoal} workouts done
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#e9e6de]">
                <div
                  className="h-full rounded-full bg-[#0f766e] transition-all duration-300"
                  style={{ width: `${weeklyPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-[#475569] tabular-nums">
                <span>{weeklyPct}% complete</span>
                <span>
                  {weeklyCount >= weeklyGoal
                    ? 'Goal reached!'
                    : `${weeklyGoal - weeklyCount} left this week`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#e5e2dc] pt-5">
            <div>
              <div className="text-xs font-medium text-[#64748b]">
                Total Workouts
              </div>
              <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#182026]">
                {history.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#64748b]">
                Weight Lifted
              </div>
              <div className="mt-1 font-mono-tabular text-2xl font-bold text-amber-700">
                {formatVolume(totalVolumeKg, preferences.preferredUnit)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear 4-Step Beginner Flow */}
      <section aria-label="Step-by-Step Guide" className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#182026] sm:text-3xl">
              Step-by-Step Guide
            </h2>
            <p className="text-sm text-[#475569]">
              New here? Follow Steps 1 to 4 in order — tap any step to jump
              right in.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('profile', 'help')}
            className="self-start text-xs font-bold text-[#0f766e] hover:underline whitespace-nowrap"
          >
            Need help or want to rate IronLog? →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {beginnerSteps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={step.onClick}
                className="flex min-h-[104px] flex-col justify-between rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-4 text-left shadow-sm transition-colors hover:border-[#0f766e]/60 hover:bg-[#faf9f6]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                    <Icon className="h-4 w-4" />
                    Step {step.stepNumber}
                  </span>
                  {step.done ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Done
                    </span>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-[#64748b]" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-base font-bold text-[#182026]">
                    {step.title}
                  </div>
                  <p className="mt-0.5 text-xs text-[#64748b]">
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* BMI Calculator & Automatic Workout Plan */}
      <BmiPlannerCard
        preferences={preferences}
        onUpdatePreferences={onUpdatePreferences}
        onApplyBmiGoal={onApplyBmiGoal}
        onStartRoutine={onStartRoutine}
        onOpenMembership={() => onNavigateTab('profile', 'membership')}
      />

      {/* Simple Guided Plans */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#182026]">
            Easy Workout Plans
          </h2>
          <p className="text-sm text-[#475569]">
            Tap any plan below to begin with exercises already picked for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {QUICK_ROUTINES.map((routine) => {
            return (
              <div
                key={routine.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-sm transition-colors hover:border-[#0f766e]/50"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-[#f3f1ec]">
                    <img
                      src={routine.imageUrl}
                      alt={routine.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-[50%_25%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#182026]/80 via-[#182026]/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white tabular-nums">
                      <span>{routine.exercises.length} exercises</span>
                      <span>About {routine.estimatedMinutes} min</span>
                    </div>
                  </div>

                  <div className="p-5 pt-4">
                    <h3 className="font-display text-2xl font-bold text-[#182026]">
                      {routine.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                      {routine.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[#0f766e]">
                      {routine.targetMuscles.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => onStartRoutine(routine)}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-sm font-bold text-[#182026] transition-colors hover:border-[#0f766e] hover:bg-[#0f766e] hover:text-white whitespace-nowrap"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start {routine.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Workouts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#182026]">
            Recent Workouts
          </h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('progress')}
              className="text-sm font-semibold text-[#0f766e] hover:underline whitespace-nowrap"
            >
              See all
            </button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-8 text-center shadow-sm">
            <Heart className="mx-auto h-8 w-8 text-[#0f766e]" />
            <h3 className="mt-3 text-lg font-bold text-[#182026]">
              No workouts yet — start whenever you are ready!
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#475569]">
              Your log starts clean at 0 workouts and 0{' '}
              {preferences.preferredUnit}. Tap Start Workout above to save your
              first session.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e2dc] overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-sm">
            {recentSessions.map((session) => {
              const volKg = getSessionVolumeKg(session);
              const setsCount = getSessionCompletedSets(session);
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatShortDate(
                          session.completedAt || session.startedAt,
                        )}
                      </span>
                      <span aria-hidden="true">·</span>
                      <Clock className="h-3.5 w-3.5" />
                      <span className="tabular-nums">
                        {formatDurationShort(session.durationSeconds)}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-[#182026]">
                      {session.title}
                    </div>
                    <div className="text-sm text-[#475569] tabular-nums">
                      {session.exercises.length} exercises
                      <span aria-hidden="true"> · </span>
                      {setsCount} sets done
                      <span aria-hidden="true"> · </span>
                      <span className="font-semibold text-amber-700">
                        {formatVolume(volKg, preferences.preferredUnit)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRepeatSession(session)}
                    className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-sm font-semibold text-[#182026] transition-colors hover:border-[#0f766e] hover:bg-[#efede7] whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Do Again
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
