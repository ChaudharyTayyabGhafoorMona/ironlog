import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { ExerciseDefinition } from '../types/fitness';

interface ExerciseVisualFrameProps {
  exercise: ExerciseDefinition;
}

const IMAGE_FOCUS_BY_ID: Record<string, string> = {
  'calf-ankle-raise': '50% 68%',
  'bicep-curl': '50% 18%',
  'weighted-knee-drive': '50% 38%',
  'side-plank-twist': '50% 45%',
  'glute-bridge-hip-thrust': '50% 45%',
  'seated-leg-curl': '50% 42%',
  'squat-bodyweight-barbell': '50% 35%',
  'barbell-deadlift': '50% 42%',
  'bench-press': '50% 36%',
};

export const ExerciseVisualFrame: React.FC<ExerciseVisualFrameProps> = ({
  exercise,
}) => {
  const [hasError, setHasError] = useState(false);
  const objectPosition = IMAGE_FOCUS_BY_ID[exercise.id] || '50% 28%';

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#e5e2dc] bg-[#182026]">
      {!hasError ? (
        <img
          src={exercise.visualUrl}
          alt={`${exercise.name} workout demonstration`}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          style={{ objectPosition }}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1f2933] to-[#111827] px-4 text-center text-slate-300">
          <Dumbbell className="h-7 w-7 text-teal-400" />
          <span className="text-sm font-semibold text-white">
            {exercise.name}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="pointer-events-none absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-white">
        <span className="truncate">{exercise.equipment} Exercise</span>
        <span className="truncate text-teal-300">{exercise.subArea}</span>
      </div>
    </div>
  );
};
