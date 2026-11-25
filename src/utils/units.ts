import {
  MuscleGroup,
  PersonalRecord,
  WeightUnit,
  WorkoutSession,
} from '../types/fitness';

const KG_TO_LB = 2.20462262;

export function kgToDisplay(kg: number, unit: WeightUnit): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  if (unit === 'kg') {
    return Math.round(kg * 10) / 10;
  }
  return Math.round(kg * KG_TO_LB * 2) / 2;
}

export function displayToKg(displayWeight: number, unit: WeightUnit): number {
  if (!Number.isFinite(displayWeight) || displayWeight <= 0) return 0;
  if (unit === 'kg') {
    return Math.round(displayWeight * 100) / 100;
  }
  return Math.round((displayWeight / KG_TO_LB) * 100) / 100;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  const val = kgToDisplay(kg, unit);
  return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} ${unit}`;
}

export function formatVolume(volumeKg: number, unit: WeightUnit): string {
  const converted = unit === 'kg' ? volumeKg : volumeKg * KG_TO_LB;
  const rounded = Math.round(converted);
  return `${rounded.toLocaleString()} ${unit}`;
}

export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDurationShort(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins} min`;
}

export function getSessionVolumeKg(session: WorkoutSession): number {
  return session.exercises.reduce((sum, ex) => {
    return (
      sum +
      ex.sets.reduce((sSum, set) => {
        if (!set.completed) return sSum;
        return sSum + set.weightKg * set.reps;
      }, 0)
    );
  }, 0);
}

export function getSessionCompletedSets(session: WorkoutSession): number {
  return session.exercises.reduce((sum, ex) => {
    return sum + ex.sets.filter((s) => s.completed).length;
  }, 0);
}

export function estimateOneRepMaxKg(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

export function computePersonalRecords(
  history: WorkoutSession[],
): PersonalRecord[] {
  const map = new Map<string, PersonalRecord>();

  for (const session of history) {
    const dateIso = session.completedAt || session.startedAt;
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (!set.completed || set.reps <= 0) continue;
        const est1RM = estimateOneRepMaxKg(set.weightKg, set.reps);
        const existing = map.get(ex.exerciseId);

        if (!existing) {
          map.set(ex.exerciseId, {
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            muscleGroup: ex.muscleGroup,
            maxWeightKg: set.weightKg,
            repsAtMaxWeight: set.reps,
            estimatedOneRepMaxKg: est1RM,
            achievedAt: dateIso,
          });
        } else {
          const isBetterWeight =
            set.weightKg > existing.maxWeightKg ||
            (set.weightKg === existing.maxWeightKg &&
              set.reps > existing.repsAtMaxWeight);
          const isBetter1RM = est1RM > existing.estimatedOneRepMaxKg;

          if (isBetterWeight || isBetter1RM) {
            map.set(ex.exerciseId, {
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              muscleGroup: ex.muscleGroup,
              maxWeightKg: isBetterWeight ? set.weightKg : existing.maxWeightKg,
              repsAtMaxWeight: isBetterWeight
                ? set.reps
                : existing.repsAtMaxWeight,
              estimatedOneRepMaxKg: Math.max(
                est1RM,
                existing.estimatedOneRepMaxKg,
              ),
              achievedAt: dateIso,
            });
          }
        }
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.estimatedOneRepMaxKg - a.estimatedOneRepMaxKg,
  );
}

export function computeMuscleDistribution(
  history: WorkoutSession[],
): Record<MuscleGroup, number> {
  const counts: Record<MuscleGroup, number> = {
    Chest: 0,
    Back: 0,
    Shoulders: 0,
    Traps: 0,
    Arms: 0,
    'Core & Abs': 0,
    'Glutes & Hips': 0,
    Legs: 0,
  };

  for (const session of history) {
    for (const ex of session.exercises) {
      const completedCount = ex.sets.filter((s) => s.completed).length;
      counts[ex.muscleGroup] = (counts[ex.muscleGroup] || 0) + completedCount;
    }
  }

  return counts;
}

export function countWorkoutsLast7Days(history: WorkoutSession[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return history.filter((s) => {
    const t = new Date(s.completedAt || s.startedAt).getTime();
    return t >= cutoff;
  }).length;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Recent';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
