import React, { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Dumbbell,
  Flag,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { RestTimerBar } from '../components/RestTimerBar';
import {
  EXERCISE_LIBRARY,
  MUSCLE_GROUPS,
  QUICK_ROUTINES,
} from '../data/exercises';
import {
  ExerciseDefinition,
  MuscleGroup,
  RoutineTemplate,
  UserPreferences,
  WeightUnit,
  WorkoutSession,
} from '../types/fitness';
import {
  displayToKg,
  formatDuration,
  formatVolume,
  getSessionCompletedSets,
  getSessionVolumeKg,
  kgToDisplay,
} from '../utils/units';

interface WorkoutLoggerViewProps {
  activeSession: WorkoutSession | null;
  history: WorkoutSession[];
  preferences: UserPreferences;
  elapsedSeconds: number;
  restRemaining: number;
  restTotal: number;
  restRunning: boolean;
  onToggleUnit: (unit: WeightUnit) => void;
  onStartEmptyWorkout: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onUpdateTitle: (title: string) => void;
  onAddExercise: (exercise: ExerciseDefinition) => void;
  onRemoveExercise: (loggedExerciseId: string) => void;
  onAddSet: (loggedExerciseId: string) => void;
  onRemoveSet: (loggedExerciseId: string, setId: string) => void;
  onUpdateSet: (
    loggedExerciseId: string,
    setId: string,
    patch: { weightKg?: number; reps?: number; completed?: boolean },
  ) => void;
  onFinishWorkout: () => void;
  onDiscardWorkout: () => void;
  onRestToggleRun: () => void;
  onRestReset: () => void;
  onRestAdjust: (delta: number) => void;
  onRestSelectPreset: (seconds: number) => void;
  onToggleSound: () => void;
}

export const WorkoutLoggerView: React.FC<WorkoutLoggerViewProps> = ({
  activeSession,
  history,
  preferences,
  elapsedSeconds,
  restRemaining,
  restTotal,
  restRunning,
  onToggleUnit,
  onStartEmptyWorkout,
  onStartRoutine,
  onUpdateTitle,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onFinishWorkout,
  onDiscardWorkout,
  onRestToggleRun,
  onRestReset,
  onRestAdjust,
  onRestSelectPreset,
  onToggleSound,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'All'>('All');
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const unit = preferences.preferredUnit;

  const previousBestMap = useMemo(() => {
    const map = new Map<string, { weightKg: number; reps: number }>();
    for (const session of history) {
      for (const ex of session.exercises) {
        if (map.has(ex.exerciseId)) continue;
        const completedSets = ex.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          const topSet = completedSets.reduce((best, curr) =>
            curr.weightKg > best.weightKg ? curr : best,
          );
          map.set(ex.exerciseId, {
            weightKg: topSet.weightKg,
            reps: topSet.reps,
          });
        }
      }
    }
    return map;
  }, [history]);

  const filteredLibrary = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesMuscle =
        filterMuscle === 'All' || ex.muscleGroup === filterMuscle;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        ex.name.toLowerCase().includes(q) ||
        ex.subArea.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.muscleGroup.toLowerCase().includes(q);
      return matchesMuscle && matchesQuery;
    });
  }, [filterMuscle, searchQuery]);

  if (!activeSession) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f766e]/10 text-[#0f766e]">
            <Dumbbell className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-[#182026] sm:text-4xl">
            Start a Workout
          </h1>
          <p className="mx-auto mt-2 max-w-md text-base text-[#475569]">
            Begin an open workout and add exercises one by one, or pick a ready
            plan below.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onStartEmptyWorkout}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-7 text-base font-bold text-white transition-colors hover:bg-[#0d625b] whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Start Blank Workout
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#182026]">
            Or Pick an Easy Plan
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ROUTINES.map((routine) => (
              <button
                key={routine.id}
                type="button"
                onClick={() => onStartRoutine(routine)}
                className="flex min-h-[120px] flex-col items-start justify-between rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 text-left shadow-sm transition-colors hover:border-[#0f766e]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#0f766e]">
                    {routine.exercises.length} exercises · ~
                    {routine.estimatedMinutes} min
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#182026]">
                    {routine.name}
                  </div>
                  <div className="mt-1 text-xs text-[#475569]">
                    {routine.targetMuscles.join(' · ')}
                  </div>
                </div>
                <span className="mt-3 text-sm font-bold text-[#0f766e]">
                  Start plan →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedSets = getSessionCompletedSets(activeSession);
  const totalSets = activeSession.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0,
  );
  const currentVolumeKg = getSessionVolumeKg(activeSession);

  return (
    <div className="space-y-5">
      {/* Top Session Control Bar */}
      <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569]">
              <span className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-[#0f766e]">
                <Clock className="h-4 w-4" />
                {formatDuration(elapsedSeconds)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {completedSets} of {totalSets} sets done
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular font-semibold text-amber-700">
                {formatVolume(currentVolumeKg, unit)}
              </span>
            </div>

            <input
              type="text"
              value={activeSession.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              aria-label="Workout name"
              placeholder="Workout name"
              className="-ml-2.5 w-full max-w-md rounded-xl border border-transparent bg-transparent px-2.5 py-1 font-display text-3xl font-bold text-[#182026] transition-colors hover:border-[#d6d1c7] focus:border-[#0f766e] focus:bg-[#faf9f6] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Unit Toggle */}
            <div
              className="flex items-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] p-1"
              role="group"
              aria-label="Weight unit"
            >
              {(['kg', 'lb'] as WeightUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => onToggleUnit(u)}
                  className={`min-h-[38px] rounded-lg px-3.5 text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                    unit === u
                      ? 'bg-[#0f766e] text-white'
                      : 'text-[#475569] hover:text-[#182026]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {!confirmDiscard ? (
              <button
                type="button"
                onClick={() => setConfirmDiscard(true)}
                className="flex min-h-[46px] items-center justify-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-4 text-sm font-semibold text-[#475569] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 whitespace-nowrap"
              >
                Cancel
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDiscard(false);
                    onDiscardWorkout();
                  }}
                  className="min-h-[38px] rounded-lg bg-rose-600 px-3 text-xs font-bold text-white hover:bg-rose-500 whitespace-nowrap"
                >
                  Yes, Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDiscard(false)}
                  className="min-h-[38px] rounded-lg px-3 text-xs font-semibold text-[#182026] hover:bg-white whitespace-nowrap"
                >
                  Keep
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onFinishWorkout}
              className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0d625b] whitespace-nowrap shrink-0"
            >
              <Flag className="h-4 w-4" />
              Finish &amp; Save
            </button>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      <RestTimerBar
        remainingSeconds={restRemaining}
        totalSeconds={restTotal}
        isRunning={restRunning}
        soundEnabled={preferences.soundEnabled}
        onToggleRun={onRestToggleRun}
        onReset={onRestReset}
        onAdjust={onRestAdjust}
        onSelectPreset={onRestSelectPreset}
        onToggleSound={onToggleSound}
      />

      {/* Logged Exercises */}
      {activeSession.exercises.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d6d1c7] bg-[#ffffff] p-8 text-center shadow-sm">
          <p className="text-base text-[#475569]">
            Tap the button below to pick your first exercise.
          </p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="mt-4 inline-flex min-h-[50px] items-center gap-2 rounded-xl bg-[#0f766e] px-6 text-base font-bold text-white hover:bg-[#0d625b]"
          >
            <Plus className="h-5 w-5" />
            Add Exercise
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSession.exercises.map((loggedEx) => {
            const prevBest = previousBestMap.get(loggedEx.exerciseId);

            return (
              <div
                key={loggedEx.id}
                className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                      <span className="font-bold text-[#0f766e]">
                        {loggedEx.muscleGroup}
                      </span>
                      {prevBest && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-medium text-amber-700">
                            Your best:{' '}
                            {kgToDisplay(prevBest.weightKg, unit)} {unit} ×{' '}
                            {prevBest.reps}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#182026]">
                      {loggedEx.exerciseName}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveExercise(loggedEx.id)}
                    aria-label={`Remove ${loggedEx.exerciseName}`}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#64748b] transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Large Friendly Sets Grid */}
                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[300px] space-y-2.5">
                    <div className="grid grid-cols-[44px_1fr_1fr_56px_40px] items-center gap-2 px-1 text-xs font-bold text-[#64748b]">
                      <span>Set</span>
                      <span>Weight ({unit})</span>
                      <span>Reps</span>
                      <span className="text-center">Done</span>
                      <span className="sr-only">Delete</span>
                    </div>

                    {loggedEx.sets.map((set, index) => {
                      const displayWeight = kgToDisplay(set.weightKg, unit);

                      return (
                        <div
                          key={set.id}
                          className={`grid grid-cols-[44px_1fr_1fr_56px_40px] items-center gap-2 rounded-xl p-2 transition-colors ${
                            set.completed
                              ? 'border border-emerald-300 bg-emerald-50'
                              : 'border border-[#e5e2dc] bg-[#faf9f6]'
                          }`}
                        >
                          <div className="flex h-12 items-center justify-center font-mono-tabular text-base font-bold text-[#182026]">
                            {index + 1}
                          </div>

                          <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={unit === 'kg' ? 0.5 : 1}
                            value={displayWeight === 0 ? '' : displayWeight}
                            placeholder="0"
                            onChange={(e) => {
                              const raw = parseFloat(e.target.value);
                              const nextKg = Number.isNaN(raw)
                                ? 0
                                : displayToKg(Math.max(0, raw), unit);
                              onUpdateSet(loggedEx.id, set.id, {
                                weightKg: nextKg,
                              });
                            }}
                            aria-label={`Set ${index + 1} weight in ${unit}`}
                            className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#ffffff] px-2.5 text-center font-mono-tabular text-base font-bold text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:outline-none"
                          />

                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step={1}
                            value={set.reps === 0 ? '' : set.reps}
                            placeholder="0"
                            onChange={(e) => {
                              const raw = parseInt(e.target.value, 10);
                              onUpdateSet(loggedEx.id, set.id, {
                                reps: Number.isNaN(raw)
                                  ? 0
                                  : Math.max(0, raw),
                              });
                            }}
                            aria-label={`Set ${index + 1} reps`}
                            className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#ffffff] px-2.5 text-center font-mono-tabular text-base font-bold text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              onUpdateSet(loggedEx.id, set.id, {
                                completed: !set.completed,
                              })
                            }
                            aria-label={
                              set.completed
                                ? `Mark set ${index + 1} not done`
                                : `Mark set ${index + 1} done`
                            }
                            aria-pressed={set.completed}
                            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                              set.completed
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-[#d6d1c7] bg-[#ffffff] text-[#64748b] hover:border-[#0f766e] hover:text-[#0f766e]'
                            }`}
                          >
                            <Check className="h-6 w-6 stroke-[2.5]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemoveSet(loggedEx.id, set.id)}
                            aria-label={`Remove set ${index + 1}`}
                            disabled={loggedEx.sets.length <= 1}
                            className="flex h-12 w-10 items-center justify-center rounded-xl text-[#64748b] transition-colors hover:text-rose-600 disabled:pointer-events-none disabled:opacity-25"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddSet(loggedEx.id)}
                  className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] text-sm font-bold text-[#182026] transition-colors hover:border-[#0f766e] hover:text-[#0f766e]"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Set
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#0f766e]/50 bg-teal-50 text-base font-bold text-[#0f766e] transition-colors hover:bg-teal-100/70"
          >
            <Plus className="h-5 w-5" />
            Add Exercise
          </button>
        </div>
      )}

      {/* Friendly Exercise Picker Modal */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#182026]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose an exercise"
        >
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e2dc] px-5 py-4">
              <h2 className="font-display text-2xl font-bold text-[#182026]">
                Choose an Exercise
              </h2>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#475569] hover:bg-[#f3f1ec] hover:text-[#182026]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 border-b border-[#e5e2dc] p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercise name..."
                  className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] pl-10 pr-3 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['All', ...MUSCLE_GROUPS] as const).map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setFilterMuscle(group)}
                    className={`min-h-[38px] rounded-xl px-3 text-xs font-bold transition-colors whitespace-nowrap ${
                      filterMuscle === group
                        ? 'bg-[#0f766e] text-white'
                        : 'bg-[#f3f1ec] text-[#475569] hover:text-[#182026]'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 divide-y divide-[#e5e2dc] overflow-y-auto p-2">
              {filteredLibrary.length === 0 ? (
                <div className="p-8 text-center text-base text-[#475569]">
                  No exercises matched your search.
                </div>
              ) : (
                filteredLibrary.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => {
                      onAddExercise(exercise);
                      setPickerOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex min-h-[60px] w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-[#f7f6f2]"
                  >
                    <div>
                      <div className="text-base font-bold text-[#182026]">
                        {exercise.name}
                      </div>
                      <div className="mt-0.5 text-xs text-[#475569]">
                        {exercise.muscleGroup} · {exercise.subArea} ·{' '}
                        {exercise.equipment}
                      </div>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]">
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
