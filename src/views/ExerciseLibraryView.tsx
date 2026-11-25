import React, { useMemo, useState } from 'react';
import { Dumbbell, Plus, Search } from 'lucide-react';
import { ExerciseVisualFrame } from '../components/ExerciseVisualFrame';
import { HumanAnatomyClip } from '../components/HumanAnatomyClip';
import {
  CREATOR_PHOTO_URL,
  EXERCISE_LIBRARY,
  MUSCLE_FOCUS_META,
  MUSCLE_GROUPS,
} from '../data/exercises';
import { ExerciseDefinition, MuscleGroup } from '../types/fitness';

interface ExerciseLibraryViewProps {
  hasActiveSession: boolean;
  onAddExerciseToWorkout: (exercise: ExerciseDefinition) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  hasActiveSession,
  onAddExerciseToWorkout,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>(
    'All',
  );
  const [selectedSubArea, setSelectedSubArea] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);

  const handleSelectMuscle = (group: MuscleGroup | 'All') => {
    setSelectedMuscle(group);
    setSelectedSubArea('All');
  };

  const activeFocusMeta =
    selectedMuscle === 'All' ? null : MUSCLE_FOCUS_META[selectedMuscle];

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesMuscle =
        selectedMuscle === 'All' ||
        ex.muscleGroup === selectedMuscle ||
        ex.secondaryMuscles.includes(selectedMuscle);
      const matchesSubArea =
        selectedSubArea === 'All' || ex.subArea === selectedSubArea;
      const matchesQuery =
        q.length === 0 ||
        ex.name.toLowerCase().includes(q) ||
        ex.subArea.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.muscleGroup.toLowerCase().includes(q) ||
        ex.targetZone.toLowerCase().includes(q);
      return matchesMuscle && matchesSubArea && matchesQuery;
    });
  }, [selectedMuscle, selectedSubArea, searchQuery]);

  const handleAdd = (exercise: ExerciseDefinition) => {
    onAddExerciseToWorkout(exercise);
    setAddedFeedbackId(exercise.id);
    window.setTimeout(() => {
      setAddedFeedbackId((curr) => (curr === exercise.id ? null : curr));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#182026] sm:text-4xl">
          26-Exercise Body &amp; Muscle Guide
        </h1>
        <p className="mt-1 text-base text-[#475569]">
          Each guide card pairs a clear exercise photo, a realistic red target
          muscle diagram, and easy Step 1, Step 2, Step 3 form directions.
        </p>
      </div>

      {/* 8 Body & Joint Area Cards + All Areas */}
      <section aria-label="Body area selector" className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => handleSelectMuscle('All')}
            className={`flex min-h-[84px] flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-colors ${
              selectedMuscle === 'All'
                ? 'border-[#0f766e] bg-teal-50 text-[#182026] shadow-sm'
                : 'border-[#e5e2dc] bg-[#ffffff] text-[#182026] hover:border-[#0f766e]/40'
            }`}
          >
            <Dumbbell
              className={`h-5 w-5 ${
                selectedMuscle === 'All' ? 'text-[#0f766e]' : 'text-[#64748b]'
              }`}
            />
            <div>
              <div className="text-sm font-bold">All 26 Exercises</div>
              <div className="text-xs text-[#64748b] tabular-nums">
                {EXERCISE_LIBRARY.length} exercises
              </div>
            </div>
          </button>

          {MUSCLE_GROUPS.map((group) => {
            const meta = MUSCLE_FOCUS_META[group];
            const isSelected = selectedMuscle === group;
            const count = EXERCISE_LIBRARY.filter(
              (e) =>
                e.muscleGroup === group || e.secondaryMuscles.includes(group),
            ).length;

            return (
              <button
                key={group}
                type="button"
                onClick={() => handleSelectMuscle(group)}
                className={`group relative min-h-[84px] overflow-hidden rounded-2xl border bg-[#182026] text-left transition-all shadow-sm ${
                  isSelected
                    ? 'border-[#0f766e] ring-2 ring-[#0f766e]/35'
                    : 'border-[#e5e2dc] hover:border-[#0f766e]/50'
                }`}
              >
                <img
                  src={meta.imageUrl}
                  alt={meta.imageAlt}
                  referrerPolicy="no-referrer"
                  style={{ objectPosition: meta.imagePosition || '50% 30%' }}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                    isSelected
                      ? 'opacity-80'
                      : 'opacity-55 group-hover:opacity-70'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182026]/90 via-[#182026]/55 to-[#182026]/15" />
                <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
                  <div
                    className={`text-sm font-bold ${
                      isSelected ? 'text-teal-300' : 'text-white'
                    }`}
                  >
                    {group}
                  </div>
                  <div className="text-xs text-slate-200 tabular-nums">
                    {count} exercises
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Body Focus Summary + 26 Beginner-Friendly Exercise Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Body Focus Card */}
        <div className="lg:col-span-4">
          {activeFocusMeta ? (
            <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-sm lg:sticky lg:top-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f3f1ec]">
                <img
                  src={activeFocusMeta.imageUrl}
                  alt={activeFocusMeta.imageAlt}
                  referrerPolicy="no-referrer"
                  style={{
                    objectPosition: activeFocusMeta.imagePosition || '50% 30%',
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182026]/85 via-[#182026]/25 to-transparent" />
                <div className="absolute bottom-3 left-5 right-5">
                  <div className="text-xs font-semibold text-teal-300">
                    Body Focus
                  </div>
                  <h2 className="font-display text-3xl font-extrabold text-white">
                    {activeFocusMeta.group}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <HumanAnatomyClip
                  targetZone={activeFocusMeta.targetZone}
                  subArea={activeFocusMeta.group}
                  exerciseName={activeFocusMeta.group}
                />

                <div>
                  <div className="text-xs font-semibold text-[#64748b]">
                    Areas Included
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubArea('All')}
                      className={`min-h-[40px] rounded-xl px-3 text-xs font-bold transition-colors ${
                        selectedSubArea === 'All'
                          ? 'bg-[#0f766e] text-white'
                          : 'bg-[#f3f1ec] text-[#475569] hover:text-[#182026]'
                      }`}
                    >
                      All {activeFocusMeta.group}
                    </button>
                    {activeFocusMeta.subAreas.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubArea(sub)}
                        className={`min-h-[40px] rounded-xl px-3 text-xs font-bold transition-colors ${
                          selectedSubArea === sub
                            ? 'bg-[#0f766e] text-white'
                            : 'bg-[#f3f1ec] text-[#475569] hover:text-[#182026]'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[#475569]">
                  {activeFocusMeta.plainSummary}
                </p>

                <p className="border-t border-[#e5e2dc] pt-3 text-sm text-[#475569]">
                  <span className="font-bold text-[#92400e]">Simple Tip: </span>
                  {activeFocusMeta.easyTip}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-sm lg:sticky lg:top-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f3f1ec]">
                <img
                  src={CREATOR_PHOTO_URL}
                  alt="IronLog creator training in the gym"
                  referrerPolicy="no-referrer"
                  style={{ objectPosition: '50% 15%' }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182026]/85 via-[#182026]/20 to-transparent" />
                <div className="absolute bottom-3 left-5 right-5">
                  <div className="text-xs font-semibold text-teal-300">
                    IronLog Complete Guide
                  </div>
                  <h2 className="font-display text-3xl font-extrabold text-white">
                    All 26 Exercises
                  </h2>
                </div>
              </div>
              <div className="space-y-3 p-5 text-sm leading-relaxed text-[#475569]">
                <p>
                  Every exercise card shows a clear workout photo, a realistic
                  red muscle highlight on the human body, and simple Step 1,
                  Step 2, Step 3 instructions so anyone can learn good form
                  fast.
                </p>
                <p className="border-t border-[#e5e2dc] pt-3 text-xs font-semibold text-[#b91c1c]">
                  Red areas on the body diagram show the exact muscle doing the
                  work on every rep.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Search + All 26 Exercise Cards */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-3.5 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any of the 26 exercises (like Bench Press, Curl, Squat)..."
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] pl-10 pr-4 text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {filteredExercises.length === 0 ? (
            <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-8 text-center shadow-sm">
              <Dumbbell className="mx-auto h-8 w-8 text-[#64748b]" />
              <p className="mt-3 text-base text-[#475569]">
                No exercises matched. Try clearing the search box or tapping
                another body area.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredExercises.map((exercise) => {
                const justAdded = addedFeedbackId === exercise.id;

                return (
                  <article
                    key={exercise.id}
                    className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#ffffff] shadow-sm transition-colors hover:border-[#0f766e]/40"
                  >
                    {/* Top Photo + Realistic Human Anatomy Red Highlight */}
                    <div className="grid grid-cols-1 gap-3 border-b border-[#e5e2dc] bg-[#faf9f6] p-4 sm:grid-cols-2">
                      <ExerciseVisualFrame exercise={exercise} />

                      <HumanAnatomyClip
                        exerciseId={exercise.id}
                        targetZone={exercise.targetZone}
                        subArea={exercise.subArea}
                        exerciseName={exercise.name}
                      />
                    </div>

                    {/* Card Body: Clean Metadata, Title, Action & Step 1–3 Guide */}
                    <div className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748b]">
                            <span className="text-[#b91c1c]">
                              Target: {exercise.subArea}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#0f766e]">
                              {exercise.muscleGroup}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{exercise.equipment}</span>
                          </div>
                          <h3 className="font-display text-2xl font-bold text-[#182026]">
                            {exercise.name}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdd(exercise)}
                          className={`flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors whitespace-nowrap ${
                            justAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0f766e] text-white hover:bg-[#0d625b]'
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                          {justAdded
                            ? 'Added!'
                            : hasActiveSession
                              ? 'Add to Workout'
                              : 'Start Lift'}
                        </button>
                      </div>

                      {/* Clear Beginner-Friendly Step 1, Step 2, Step 3 */}
                      <div className="space-y-2.5 border-t border-[#e5e2dc] pt-3.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                          How to Do It (Step by Step)
                        </div>
                        <ol className="space-y-2.5">
                          {exercise.instructions.map((stepText, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm leading-relaxed text-[#182026]"
                            >
                              <span className="mt-0.5 shrink-0 font-bold text-[#0f766e] tabular-nums">
                                Step {idx + 1}:
                              </span>
                              <span>{stepText}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <p className="border-t border-[#e5e2dc] pt-3 text-sm leading-relaxed text-[#475569]">
                        <span className="font-bold text-[#92400e]">
                          Beginner Tip:{' '}
                        </span>
                        {exercise.simpleTip}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
