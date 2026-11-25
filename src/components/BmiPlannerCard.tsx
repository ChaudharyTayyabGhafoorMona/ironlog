import React from 'react';
import {
  Activity,
  CheckCircle2,
  Lock,
  Play,
  Scale,
  Sparkles,
  Unlock,
} from 'lucide-react';
import {
  BmiCategory,
  FitnessGoal,
  GenderOption,
  RoutineTemplate,
  UserPreferences,
} from '../types/fitness';
import {
  calculateBmi,
  getBmiCategoryDescription,
  getBmiWorkoutRecommendation,
} from '../utils/bmi';
import { displayToKg, kgToDisplay } from '../utils/units';

interface BmiPlannerCardProps {
  preferences: UserPreferences;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onApplyBmiGoal: (goal: FitnessGoal, weeklyWorkouts: number, restSeconds: number) => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onOpenMembership: () => void;
}

const GOALS: FitnessGoal[] = ['Muscle Gain', 'Fat Loss', 'Strength'];
const GENDERS: GenderOption[] = ['Prefer not to say', 'Male', 'Female'];

function categoryBadgeStyle(category: BmiCategory): string {
  switch (category) {
    case 'Underweight':
      return 'border-amber-300 bg-amber-50 text-amber-900';
    case 'Normal':
      return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    case 'Overweight':
      return 'border-orange-300 bg-orange-50 text-orange-900';
    case 'Obese':
      return 'border-rose-300 bg-rose-50 text-rose-900';
  }
}

export const BmiPlannerCard: React.FC<BmiPlannerCardProps> = ({
  preferences,
  onUpdatePreferences,
  onApplyBmiGoal,
  onStartRoutine,
  onOpenMembership,
}) => {
  const unit = preferences.preferredUnit;
  const isMember = preferences.membershipPlan !== 'free';

  const bmi = calculateBmi(preferences.heightCm, preferences.bodyWeightKg);
  const suggestion = bmi
    ? getBmiWorkoutRecommendation(
        bmi.category,
        preferences.fitnessGoal,
        preferences.age,
      )
    : null;

  const weightDisplay =
    typeof preferences.bodyWeightKg === 'number' && preferences.bodyWeightKg > 0
      ? kgToDisplay(preferences.bodyWeightKg, unit)
      : '';

  const isGoalAlreadyMatched =
    Boolean(suggestion) &&
    preferences.fitnessGoal === suggestion?.recommendedGoal &&
    preferences.weeklyGoalWorkouts === suggestion?.weeklyWorkouts;

  return (
    <section
      id="bmi-planner-section"
      aria-label="BMI Calculator and Workout Plan"
      className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-3 border-b border-[#e5e2dc] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
            <Scale className="h-4 w-4" />
            <span>Step 1 &amp; 2 · Free Body Check &amp; Plan</span>
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#182026]">
            BMI Calculator &amp; Workout Plan
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            Enter your height and weight to check your BMI score and get a
            personalized workout plan right away.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">
          <Unlock className="h-3.5 w-3.5" />
          <span>BMI Check: Free &amp; Unlocked</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Simple Inputs */}
        <div className="space-y-4 lg:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Height (cm)
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={80}
                max={260}
                value={preferences.heightCm ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdatePreferences({
                    heightCm: Number.isNaN(val) ? null : Math.max(0, val),
                  });
                }}
                placeholder="e.g. 175"
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Weight ({unit})
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={20}
                max={350}
                step={0.5}
                value={weightDisplay}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdatePreferences({
                    bodyWeightKg: Number.isNaN(val)
                      ? null
                      : displayToKg(Math.max(0, val), unit),
                  });
                }}
                placeholder={unit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3.5 font-mono-tabular text-base text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#182026]">
                Age (optional)
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
                placeholder="e.g. 24"
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
                className="h-12 w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] px-3 text-sm font-medium text-[#182026] focus:border-[#0f766e] focus:bg-white focus:outline-none"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-1.5">
            <span className="block text-sm font-semibold text-[#182026]">
              Your Main Goal
            </span>
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => onUpdatePreferences({ fitnessGoal: goal })}
                  className={`min-h-[44px] rounded-xl border px-2 text-xs font-bold transition-colors ${
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

          {/* BMI Result Summary Card */}
          {bmi ? (
            <div className="space-y-3 rounded-2xl border border-[#e5e2dc] bg-[#faf9f6] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                    Your BMI Score
                  </div>
                  <div className="mt-0.5 font-mono-tabular text-4xl font-extrabold text-[#182026]">
                    {bmi.score.toFixed(1)}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-bold ${categoryBadgeStyle(
                    bmi.category,
                  )}`}
                >
                  {bmi.category}
                </span>
              </div>

              {/* Clean 4-zone BMI range bar */}
              <div className="space-y-1.5">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#e9e6de]">
                  <div className="grid h-full w-full grid-cols-4">
                    <div className="bg-amber-300" />
                    <div className="bg-emerald-500" />
                    <div className="bg-orange-400" />
                    <div className="bg-rose-500" />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-1.5 -translate-x-1/2 rounded-full bg-[#182026] ring-2 ring-white"
                    style={{ left: `${bmi.markerPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-[#64748b] tabular-nums">
                  <span>Under &lt;18.5</span>
                  <span>Normal 18.5–24.9</span>
                  <span>Over 25+</span>
                  <span>30+</span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#475569]">
                {getBmiCategoryDescription(bmi.category)}
              </p>
              <p className="text-xs font-semibold text-[#0f766e] tabular-nums">
                Healthy weight guide for your height:{' '}
                {kgToDisplay(bmi.healthyMinKg, unit)} –{' '}
                {kgToDisplay(bmi.healthyMaxKg, unit)} {unit}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d6d1c7] bg-[#faf9f6] p-5 text-center">
              <Activity className="mx-auto h-7 w-7 text-[#0f766e]" />
              <p className="mt-2 text-sm font-semibold text-[#182026]">
                Type your height and weight above
              </p>
              <p className="mt-1 text-xs text-[#64748b]">
                Your BMI score and automatic workout plan will appear right
                here.
              </p>
            </div>
          )}
        </div>

        {/* Right: Automatic BMI Workout Recommendation */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e5e2dc] bg-[#faf9f6] p-5 lg:col-span-7">
          {suggestion ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recommended For {suggestion.category} BMI
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[#182026] sm:text-3xl">
                    {suggestion.headline}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                    {suggestion.summary}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e2dc] bg-white px-3.5 py-2 text-right tabular-nums">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Suggested Pace
                  </div>
                  <div className="text-sm font-bold text-[#182026]">
                    {suggestion.weeklyWorkouts} days / week ·{' '}
                    {suggestion.restSeconds}s rest
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-[#e5e2dc] bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                  Why This Fits Your Body
                </div>
                <ul className="space-y-2">
                  {suggestion.dailyFocusPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-[#182026]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#e5e2dc] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-[#64748b]">
                      Ready-To-Start Session ({suggestion.routine.exercises.length}{' '}
                      exercises · ~{suggestion.routine.estimatedMinutes} min)
                    </div>
                    <div className="text-lg font-bold text-[#182026]">
                      {suggestion.routine.name}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#0f766e]">
                    {suggestion.routine.targetMuscles.join(' · ')}
                  </span>
                </div>
              </div>

              {/* Member-only extra weekly progression coaching note */}
              <div className="rounded-xl border border-[#e5e2dc] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#182026]">
                    Weekly Progression Tip
                  </span>
                  {isMember ? (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900">
                      <Unlock className="h-3 w-3" />
                      Member Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900">
                      <Lock className="h-3 w-3" />
                      Membership Extra
                    </span>
                  )}
                </div>

                {isMember ? (
                  <p className="mt-2 text-sm text-[#475569]">
                    {suggestion.premiumSplitTip}
                  </p>
                ) : (
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#64748b]">
                      Unlock week-by-week weight progression tips with our
                      budget-friendly membership starting at $2.99/mo.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenMembership}
                      className="min-h-[40px] shrink-0 rounded-xl border border-[#0f766e] px-3.5 text-xs font-bold text-[#0f766e] hover:bg-teal-50"
                    >
                      View Affordable Plans
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onStartRoutine(suggestion.routine)}
                  className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0d625b]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start {suggestion.routine.name}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApplyBmiGoal(
                      suggestion.recommendedGoal,
                      suggestion.weeklyWorkouts,
                      suggestion.restSeconds,
                    )
                  }
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors ${
                    isGoalAlreadyMatched
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-[#d6d1c7] bg-white text-[#182026] hover:border-[#0f766e]'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isGoalAlreadyMatched
                    ? 'Saved to My Goal'
                    : 'Save Plan to My Goal'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center space-y-4 py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f766e]">
                <Scale className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-2xl font-bold text-[#182026]">
                  Your Personal Workout Plan Waits Here
                </h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-[#475569]">
                  Add your height (for example 175 cm) and weight on the left to
                  automatically build a safe, beginner-friendly workout routine
                  matched to your BMI.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
