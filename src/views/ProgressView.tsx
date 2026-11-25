import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Dumbbell,
  TrendingUp,
} from 'lucide-react';
import { MUSCLE_GROUPS } from '../data/exercises';
import {
  MuscleGroup,
  UserPreferences,
  WorkoutSession,
} from '../types/fitness';
import {
  computeMuscleDistribution,
  computePersonalRecords,
  formatShortDate,
  formatVolume,
  getSessionCompletedSets,
  getSessionVolumeKg,
  kgToDisplay,
} from '../utils/units';

interface ProgressViewProps {
  history: WorkoutSession[];
  preferences: UserPreferences;
  onStartEmptyWorkout: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  history,
  preferences,
  onStartEmptyWorkout,
}) => {
  const [prFilter, setPrFilter] = useState<MuscleGroup | 'All'>('All');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const unit = preferences.preferredUnit;

  const stats = useMemo(() => {
    const totalWorkouts = history.length;
    const totalVolumeKg = history.reduce(
      (sum, s) => sum + getSessionVolumeKg(s),
      0,
    );
    const totalSets = history.reduce(
      (sum, s) => sum + getSessionCompletedSets(s),
      0,
    );
    const records = computePersonalRecords(history);
    const muscleCounts = computeMuscleDistribution(history);
    return { totalWorkouts, totalVolumeKg, totalSets, records, muscleCounts };
  }, [history]);

  const chartSessions = useMemo(() => {
    return [...history]
      .slice(0, 8)
      .reverse()
      .map((s) => {
        const volKg = getSessionVolumeKg(s);
        const displayVol =
          unit === 'kg' ? Math.round(volKg) : Math.round(volKg * 2.20462262);
        return {
          id: s.id,
          title: s.title,
          date: formatShortDate(s.completedAt || s.startedAt),
          volume: displayVol,
          sets: getSessionCompletedSets(s),
        };
      });
  }, [history, unit]);

  const maxChartVolume = useMemo(() => {
    return Math.max(...chartSessions.map((d) => d.volume), 100);
  }, [chartSessions]);

  const maxMuscleSets = useMemo(() => {
    return Math.max(
      ...MUSCLE_GROUPS.map((m) => stats.muscleCounts[m] || 0),
      1,
    );
  }, [stats.muscleCounts]);

  const filteredRecords = useMemo(() => {
    if (prFilter === 'All') return stats.records;
    return stats.records.filter((r) => r.muscleGroup === prFilter);
  }, [prFilter, stats.records]);

  const activeSessionDetail =
    selectedBarIndex !== null && chartSessions[selectedBarIndex]
      ? chartSessions[selectedBarIndex]
      : chartSessions[chartSessions.length - 1] || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#182026] sm:text-4xl">
          Your Progress &amp; Best Lifts
        </h1>
        <p className="mt-1 text-base text-[#475569]">
          See how many workouts you have finished and celebrate your strongest
          lifts.
        </p>
      </div>

      {/* 4 Big Simple Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
            <span>Workouts Done</span>
            <Dumbbell className="h-5 w-5 text-[#0f766e]" />
          </div>
          <div className="mt-2 font-mono-tabular text-3xl font-bold text-[#182026]">
            {stats.totalWorkouts}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
            <span>Weight Lifted</span>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <div className="mt-2 font-mono-tabular text-3xl font-bold text-amber-700">
            {formatVolume(stats.totalVolumeKg, unit)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
            <span>Sets Completed</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 font-mono-tabular text-3xl font-bold text-[#182026]">
            {stats.totalSets.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
            <span>Best Lifts</span>
            <Award className="h-5 w-5 text-[#0f766e]" />
          </div>
          <div className="mt-2 font-mono-tabular text-3xl font-bold text-[#182026]">
            {stats.records.length}
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-10 text-center shadow-sm">
          <Activity className="mx-auto h-10 w-10 text-[#0f766e]" />
          <h2 className="mt-3 font-display text-2xl font-bold text-[#182026]">
            No Progress Data Yet
          </h2>
          <p className="mx-auto mt-1 max-w-md text-base text-[#475569]">
            Finish your first workout to see your charts, body areas trained,
            and best lifts appear here.
          </p>
          <button
            type="button"
            onClick={onStartEmptyWorkout}
            className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#0f766e] px-6 text-base font-bold text-white hover:bg-[#0d625b]"
          >
            Start First Workout
          </button>
        </div>
      ) : (
        <>
          {/* Simple Visual Bars */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm lg:col-span-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#182026]">
                    Recent Workout Totals ({unit})
                  </h2>
                  <p className="text-sm text-[#475569]">
                    Tap any bar to see that workout’s total
                  </p>
                </div>

                {activeSessionDetail && (
                  <div className="rounded-xl border border-[#e5e2dc] bg-[#faf9f6] px-3.5 py-2 text-right">
                    <div className="text-xs font-medium text-[#475569]">
                      {activeSessionDetail.title} · {activeSessionDetail.date}
                    </div>
                    <div className="font-mono-tabular text-sm font-bold text-[#0f766e]">
                      {activeSessionDetail.volume.toLocaleString()} {unit} (
                      {activeSessionDetail.sets} sets)
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex h-48 items-end gap-2.5 sm:gap-3">
                {chartSessions.map((item, idx) => {
                  const heightPct = Math.max(
                    10,
                    Math.round((item.volume / maxChartVolume) * 100),
                  );
                  const isSelected =
                    selectedBarIndex === idx ||
                    (selectedBarIndex === null &&
                      idx === chartSessions.length - 1);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedBarIndex(idx)}
                      className="group flex h-full flex-1 flex-col items-center justify-end gap-2 focus:outline-none"
                      aria-label={`${item.title} on ${item.date}: ${item.volume} ${unit}`}
                    >
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div
                          className={`w-full max-w-[44px] rounded-t-lg transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#0f766e]'
                              : 'bg-[#dcd7cd] group-hover:bg-[#0f766e]/65'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="max-w-full truncate text-xs font-medium text-[#475569] tabular-nums">
                        {item.date}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body Areas Worked */}
            <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm lg:col-span-5">
              <h2 className="font-display text-2xl font-bold text-[#182026]">
                Body Areas Trained
              </h2>
              <p className="text-sm text-[#475569]">
                Total sets finished for each area
              </p>

              <div className="mt-4 space-y-3">
                {MUSCLE_GROUPS.map((muscle) => {
                  const count = stats.muscleCounts[muscle] || 0;
                  const pct = Math.round((count / maxMuscleSets) * 100);
                  return (
                    <div key={muscle} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#182026]">{muscle}</span>
                        <span className="font-mono-tabular text-[#475569]">
                          {count} sets
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e9e6de]">
                        <div
                          className="h-full rounded-full bg-[#0f766e] transition-all duration-300"
                          style={{
                            width: `${count === 0 ? 0 : Math.max(4, pct)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Simple Best Lifts Cards */}
          <div className="space-y-4 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#182026]">
                  Your Best Lifts
                </h2>
                <p className="text-sm text-[#475569]">
                  Your heaviest weight recorded for each exercise
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['All', ...MUSCLE_GROUPS] as const).map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setPrFilter(group)}
                    className={`min-h-[38px] rounded-xl px-3 text-xs font-bold transition-colors whitespace-nowrap ${
                      prFilter === group
                        ? 'bg-[#0f766e] text-white'
                        : 'bg-[#f3f1ec] text-[#475569] hover:text-[#182026]'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-base text-[#475569]">
                No best lifts saved for this body area yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((pr) => (
                  <div
                    key={pr.exerciseId}
                    className="flex flex-col justify-between rounded-xl border border-[#e5e2dc] bg-[#faf9f6] p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0f766e]">
                          {pr.muscleGroup}
                        </span>
                        <span className="text-[#64748b] tabular-nums">
                          {formatShortDate(pr.achievedAt)}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-[#182026]">
                        {pr.exerciseName}
                      </h3>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-[#e5e2dc] pt-3">
                      <span className="text-xs text-[#64748b]">Best Set</span>
                      <span className="font-mono-tabular text-lg font-bold text-amber-700">
                        {pr.maxWeightKg > 0
                          ? `${kgToDisplay(pr.maxWeightKg, unit)} ${unit} × ${pr.repsAtMaxWeight}`
                          : `Bodyweight × ${pr.repsAtMaxWeight}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
