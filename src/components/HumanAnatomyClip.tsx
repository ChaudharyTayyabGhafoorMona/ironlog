import React, { useId } from 'react';
import { TargetZone } from '../types/fitness';

export type AnatomyMuscleKey =
  | 'upper-chest'
  | 'mid-chest'
  | 'lower-chest'
  | 'lats'
  | 'upper-back'
  | 'lower-back'
  | 'front-shoulders'
  | 'side-shoulders'
  | 'rear-shoulders'
  | 'upper-traps'
  | 'mid-traps'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'upper-abs'
  | 'lower-abs'
  | 'obliques'
  | 'glutes'
  | 'hip-abductors'
  | 'hip-flexors'
  | 'quads'
  | 'hamstrings'
  | 'calves';

type MotionKind =
  | 'press'
  | 'pull'
  | 'raise'
  | 'curl'
  | 'shrug'
  | 'core'
  | 'squat'
  | 'leg-curl'
  | 'calf';

interface ExerciseAnatomyProfile {
  view: 'front' | 'back';
  active: AnatomyMuscleKey[];
  motion: MotionKind;
  targetLabel: string;
}

function getAnatomyProfile(
  exerciseId: string | undefined,
  zone: TargetZone,
  subArea?: string,
): ExerciseAnatomyProfile {
  switch (exerciseId) {
    case 'bench-press':
    case 'cable-chest-squeeze':
      return {
        view: 'front',
        active: ['mid-chest'],
        motion: 'press',
        targetLabel: 'Mid Chest',
      };
    case 'incline-dumbbell-press':
      return {
        view: 'front',
        active: ['upper-chest'],
        motion: 'press',
        targetLabel: 'Upper Chest',
      };
    case 'chest-dips':
      return {
        view: 'front',
        active: ['lower-chest'],
        motion: 'press',
        targetLabel: 'Lower Chest',
      };

    case 'lat-pulldown':
    case 'pull-ups':
      return {
        view: 'back',
        active: ['lats'],
        motion: 'pull',
        targetLabel: 'Lats (Side Back)',
      };
    case 'seated-row':
      return {
        view: 'back',
        active: ['upper-back'],
        motion: 'pull',
        targetLabel: 'Upper Back',
      };
    case 'barbell-deadlift':
      return {
        view: 'back',
        active: ['lower-back'],
        motion: 'squat',
        targetLabel: 'Lower Back',
      };

    case 'seated-shoulder-press':
      return {
        view: 'front',
        active: ['front-shoulders'],
        motion: 'press',
        targetLabel: 'Front Shoulders',
      };
    case 'side-dumbbell-raise':
      return {
        view: 'front',
        active: ['side-shoulders'],
        motion: 'raise',
        targetLabel: 'Side Shoulders',
      };
    case 'face-pull':
      return {
        view: 'back',
        active: ['rear-shoulders'],
        motion: 'pull',
        targetLabel: 'Rear Shoulders',
      };

    case 'dumbbell-shrugs':
      return {
        view: 'back',
        active: ['upper-traps'],
        motion: 'shrug',
        targetLabel: 'Upper Traps',
      };
    case 'farmers-walk-hold':
      return {
        view: 'back',
        active: ['upper-traps'],
        motion: 'shrug',
        targetLabel: 'Upper Traps & Grip',
      };
    case 'mid-back-barbell-row':
      return {
        view: 'back',
        active: ['mid-traps'],
        motion: 'pull',
        targetLabel: 'Mid Traps & Mid Back',
      };

    case 'bicep-curl':
      return {
        view: 'front',
        active: ['biceps'],
        motion: 'curl',
        targetLabel: 'Biceps (Front Arms)',
      };
    case 'triceps-pushdown':
      return {
        view: 'back',
        active: ['triceps'],
        motion: 'curl',
        targetLabel: 'Triceps (Back Arms)',
      };
    case 'seated-wrist-forearm-curl':
      return {
        view: 'front',
        active: ['forearms'],
        motion: 'curl',
        targetLabel: 'Forearms & Wrists',
      };

    case 'kneeling-crunch':
      return {
        view: 'front',
        active: ['upper-abs'],
        motion: 'core',
        targetLabel: 'Upper Abs',
      };
    case 'knee-or-leg-raise':
      return {
        view: 'front',
        active: ['lower-abs'],
        motion: 'core',
        targetLabel: 'Lower Abs',
      };
    case 'side-plank-twist':
      return {
        view: 'front',
        active: ['obliques'],
        motion: 'core',
        targetLabel: 'Side Abs (Obliques)',
      };

    case 'glute-bridge-hip-thrust':
      return {
        view: 'back',
        active: ['glutes'],
        motion: 'squat',
        targetLabel: 'Glutes',
      };
    case 'side-leg-lift-abductor':
      return {
        view: 'back',
        active: ['hip-abductors'],
        motion: 'squat',
        targetLabel: 'Outer Hips',
      };
    case 'weighted-knee-drive':
      return {
        view: 'front',
        active: ['hip-flexors'],
        motion: 'core',
        targetLabel: 'Front Hips (Flexors)',
      };
    case 'squat-bodyweight-barbell':
      return {
        view: 'front',
        active: ['quads'],
        motion: 'squat',
        targetLabel: 'Quads (Front Thighs)',
      };
    case 'seated-leg-curl':
      return {
        view: 'back',
        active: ['hamstrings'],
        motion: 'leg-curl',
        targetLabel: 'Hamstrings (Back Thighs)',
      };
    case 'calf-ankle-raise':
      return {
        view: 'back',
        active: ['calves'],
        motion: 'calf',
        targetLabel: 'Calves & Ankles',
      };

    default: {
      const sub = (subArea || '').toLowerCase();
      if (sub.includes('trap')) {
        return {
          view: 'back',
          active: ['upper-traps', 'mid-traps'],
          motion: 'shrug',
          targetLabel: subArea || 'Traps',
        };
      }
      if (sub.includes('glute')) {
        return {
          view: 'back',
          active: ['glutes', 'hip-abductors'],
          motion: 'squat',
          targetLabel: subArea || 'Glutes & Hips',
        };
      }
      if (zone === 'chest') {
        return {
          view: 'front',
          active: ['upper-chest', 'mid-chest', 'lower-chest'],
          motion: 'press',
          targetLabel: subArea || 'Chest',
        };
      }
      if (zone === 'back') {
        return {
          view: 'back',
          active: ['lats', 'upper-back', 'lower-back'],
          motion: 'pull',
          targetLabel: subArea || 'Back',
        };
      }
      if (zone === 'shoulders') {
        return {
          view: 'front',
          active: ['front-shoulders', 'side-shoulders'],
          motion: 'raise',
          targetLabel: subArea || 'Shoulders',
        };
      }
      if (zone === 'arms') {
        return {
          view: 'front',
          active: ['biceps', 'forearms'],
          motion: 'curl',
          targetLabel: subArea || 'Arms',
        };
      }
      if (zone === 'core') {
        return {
          view: 'front',
          active: ['upper-abs', 'lower-abs', 'obliques'],
          motion: 'core',
          targetLabel: subArea || 'Core & Abs',
        };
      }
      return {
        view: 'front',
        active: ['quads'],
        motion: 'squat',
        targetLabel: subArea || 'Legs (Quads)',
      };
    }
  }
}

interface HumanAnatomyClipProps {
  exerciseId?: string;
  targetZone: TargetZone;
  subArea?: string;
  exerciseName: string;
}

export const HumanAnatomyClip: React.FC<HumanAnatomyClipProps> = ({
  exerciseId,
  targetZone,
  subArea,
  exerciseName,
}) => {
  const uid = useId().replace(/:/g, '');
  const glowId = `glow-${uid}`;
  const skinGradId = `skin-${uid}`;
  const muscleGradId = `muscle-${uid}`;
  const redGradId = `red-${uid}`;

  const profile = getAnatomyProfile(exerciseId, targetZone, subArea);
  const isActive = (key: AnatomyMuscleKey) => profile.active.includes(key);

  const muscleProps = (key: AnatomyMuscleKey) =>
    isActive(key)
      ? {
          className: 'anatomy-red-pulse',
          fill: `url(#${redGradId})`,
          stroke: '#991b1b',
          strokeWidth: 1.15,
          filter: `url(#${glowId})`,
        }
      : {
          fill: `url(#${muscleGradId})`,
          stroke: '#94a3b8',
          strokeOpacity: 0.72,
          strokeWidth: 0.75,
        };

  const baseBodyStyle: React.CSSProperties =
    profile.motion === 'squat'
      ? { animation: 'anatomyBodyDip 2.2s ease-in-out infinite' }
      : profile.motion === 'calf' || profile.motion === 'shrug'
        ? { animation: 'anatomyBodyLift 2s ease-in-out infinite' }
        : {};

  const leftArmStyle: React.CSSProperties =
    profile.motion === 'press'
      ? {
          transformOrigin: '80px 76px',
          animation: 'anatomyArmPressL 2.2s ease-in-out infinite',
        }
      : profile.motion === 'raise'
        ? {
            transformOrigin: '80px 76px',
            animation: 'anatomyArmRaiseL 2.2s ease-in-out infinite',
          }
        : profile.motion === 'pull'
          ? {
              transformOrigin: '80px 76px',
              animation: 'anatomyArmPullL 2.2s ease-in-out infinite',
            }
          : {};

  const rightArmStyle: React.CSSProperties =
    profile.motion === 'press'
      ? {
          transformOrigin: '160px 76px',
          animation: 'anatomyArmPressR 2.2s ease-in-out infinite',
        }
      : profile.motion === 'raise'
        ? {
            transformOrigin: '160px 76px',
            animation: 'anatomyArmRaiseR 2.2s ease-in-out infinite',
          }
        : profile.motion === 'pull'
          ? {
              transformOrigin: '160px 76px',
              animation: 'anatomyArmPullR 2.2s ease-in-out infinite',
            }
          : {};

  const leftForearmStyle: React.CSSProperties =
    profile.motion === 'curl'
      ? {
          transformOrigin: '72px 128px',
          animation: 'anatomyCurlForearmL 2.1s ease-in-out infinite',
        }
      : {};

  const rightForearmStyle: React.CSSProperties =
    profile.motion === 'curl'
      ? {
          transformOrigin: '168px 128px',
          animation: 'anatomyCurlForearmR 2.1s ease-in-out infinite',
        }
      : {};

  const legMotionStyle: React.CSSProperties =
    profile.motion === 'core' || profile.motion === 'leg-curl'
      ? { animation: 'anatomyLegLift 2.1s ease-in-out infinite' }
      : {};

  return (
    <div
      className="relative flex h-48 w-full items-center justify-between overflow-hidden rounded-xl border border-[#e5e2dc] bg-[#faf9f6] px-4 py-3"
      aria-label={`Human anatomy diagram showing ${profile.targetLabel} highlighted in red for ${exerciseName}`}
    >
      {/* Left Readable Labels */}
      <div className="z-10 flex h-full max-w-[52%] flex-col justify-between py-0.5">
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
            Red Target
          </div>
          <div className="text-base font-extrabold leading-snug text-[#182026]">
            {profile.targetLabel}
          </div>
          <div className="text-xs font-medium text-[#64748b]">
            {profile.view === 'front' ? 'Male Front Anatomy' : 'Male Back Anatomy'}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-medium text-[#64748b]">
            Active Muscle Highlight
          </div>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#e5e2dc]">
            <div className="anatomy-progress-bar h-full w-full rounded-full bg-[#ef4444]" />
          </div>
        </div>
      </div>

      {/* Realistic Athletic Male Physique SVG (Head to Feet) */}
      <svg
        viewBox="0 0 240 340"
        className="h-full w-auto shrink-0 select-none"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3.2"
              floodColor="#ef4444"
              floodOpacity="0.65"
            />
          </filter>

          <linearGradient id={skinGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#edf1f5" />
            <stop offset="55%" stopColor="#dde4ec" />
            <stop offset="100%" stopColor="#c7d2df" />
          </linearGradient>

          <linearGradient id={muscleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dce3ec" />
            <stop offset="100%" stopColor="#c3cedc" />
          </linearGradient>

          <linearGradient id={redGradId} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* Soft Studio Shadow */}
        <ellipse cx="120" cy="331" rx="44" ry="5" fill="#e5e2dc" />

        <g style={baseBodyStyle}>
          {/* Sculpted Athletic Male Head & Square Jawline */}
          <path
            d="M120 12 C109 12 103 19 104 31 C104.5 38 107 45 111 49 L115 52 L125 52 L129 49 C133 45 135.5 38 136 31 C137 19 131 12 120 12 Z"
            fill={`url(#${skinGradId})`}
            stroke="#8a97a8"
            strokeWidth="1"
          />
          {/* Subtle Ears */}
          <path
            d="M104 28 C101.5 28 101 35 104 37 M136 28 C138.5 28 139 35 136 37"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Short Athletic Hairline Contour */}
          <path
            d="M105 23 C106 14 112 11 120 11 C128 11 134 14 135 23 C131 18 126 16 120 16 C114 16 109 18 105 23 Z"
            fill="#8a97a8"
          />

          {/* Anatomical Neck & Sternocleidomastoid */}
          <path
            d="M112 50 L108 66 L132 66 L128 50 Z"
            fill={`url(#${skinGradId})`}
            stroke="#94a3b8"
            strokeWidth="0.9"
          />
          {profile.view === 'front' && (
            <path
              d="M112 52 L118 67 M128 52 L122 67"
              stroke="#94a3b8"
              strokeOpacity="0.45"
              strokeWidth="0.8"
              fill="none"
            />
          )}

          {/* Upper Trapezius Sweep */}
          <path
            d="M109 59 C99 63 89 67 80 71 L96 76 L120 69 L144 76 L160 71 C151 67 141 63 131 59 Z"
            {...muscleProps('upper-traps')}
          />

          {/* Cohesive Athletic Torso Silhouette (Shoulders to Pelvis) */}
          <path
            d="M82 70 C95 65 145 65 158 70 C158 84 154 98 148 114 C144 128 141 144 141 158 C142 167 146 176 147 185 L93 185 C94 176 98 167 99 158 C99 144 96 128 92 114 C86 98 82 84 82 70 Z"
            fill={`url(#${skinGradId})`}
            stroke="#8a97a8"
            strokeWidth="1"
          />

          {profile.view === 'front' ? (
            <>
              {/* Upper Chest (Clavicular Pectorals) */}
              <path
                d="M88 73 C98 70 110 71 119 77 L119 85 C106 84 94 83 87 82 Z"
                {...muscleProps('upper-chest')}
              />
              <path
                d="M152 73 C142 70 130 71 121 77 L121 85 C134 84 146 83 153 82 Z"
                {...muscleProps('upper-chest')}
              />

              {/* Mid Chest (Sternal Pectorals) */}
              <path
                d="M87 82 C98 83 109 84 119 85 L119 95 C106 96 93 95 88 92 Z"
                {...muscleProps('mid-chest')}
              />
              <path
                d="M153 82 C142 83 131 84 121 85 L121 95 C134 96 147 95 152 92 Z"
                {...muscleProps('mid-chest')}
              />

              {/* Lower Chest (Costal Border) */}
              <path
                d="M88 92 C96 95 108 96 119 95 L119 101 C107 105 94 103 89 97 Z"
                {...muscleProps('lower-chest')}
              />
              <path
                d="M152 92 C144 95 132 96 121 95 L121 101 C133 105 146 103 151 97 Z"
                {...muscleProps('lower-chest')}
              />

              {/* Upper Abs (4 Sculpted Abdominal Blocks) */}
              <path
                d="M107 105 C115 103 125 103 133 105 L131 136 L109 136 Z"
                {...muscleProps('upper-abs')}
              />

              {/* Lower Abs (Tapered V-Line) */}
              <path
                d="M109 136 L131 136 L128 168 C124 174 116 174 112 168 Z"
                {...muscleProps('lower-abs')}
              />

              {/* Subtle Linea Alba & Tendinous Intersections */}
              <path
                d="M120 105 L120 169 M108 119 L132 119 M109 136 L131 136 M110 151 L130 151"
                stroke="#94a3b8"
                strokeOpacity="0.48"
                strokeWidth="0.8"
                fill="none"
              />

              {/* External Obliques */}
              <path
                d="M93 103 C97 122 101 144 102 164 L109 164 L106 106 Z"
                {...muscleProps('obliques')}
              />
              <path
                d="M147 103 C143 122 139 144 138 164 L131 164 L134 106 Z"
                {...muscleProps('obliques')}
              />

              {/* Front Hip Flexors (Iliopsoas / TFL Wedge) */}
              <path
                d="M95 166 L105 167 L102 186 L93 182 Z"
                {...muscleProps('hip-flexors')}
              />
              <path
                d="M145 166 L135 167 L138 186 L147 182 Z"
                {...muscleProps('hip-flexors')}
              />
            </>
          ) : (
            <>
              {/* Posterior Mid Traps Diamond */}
              <path
                d="M103 70 L137 70 L131 94 L120 105 L109 94 Z"
                {...muscleProps('mid-traps')}
              />

              {/* Posterior Upper Back / Rhomboids & Infraspinatus */}
              <path
                d="M93 77 L109 94 L120 105 L131 94 L147 77 L142 110 L98 110 Z"
                {...muscleProps('upper-back')}
              />

              {/* Sculpted Latissimus Dorsi Wings */}
              <path
                d="M86 84 C85 107 92 128 103 144 L114 136 L104 98 Z"
                {...muscleProps('lats')}
              />
              <path
                d="M154 84 C155 107 148 128 137 144 L126 136 L136 98 Z"
                {...muscleProps('lats')}
              />

              {/* Erector Spinae (Lower Back Columns) */}
              <path
                d="M107 114 L133 114 L130 156 L110 156 Z"
                {...muscleProps('lower-back')}
              />
              <path
                d="M120 112 L120 156"
                stroke="#94a3b8"
                strokeOpacity="0.45"
                strokeWidth="0.8"
                fill="none"
              />

              {/* Rounded Gluteus Maximus */}
              <path
                d="M98 158 C105 153 114 155 119 162 L118 189 C107 192 96 184 95 172 Z"
                {...muscleProps('glutes')}
              />
              <path
                d="M142 158 C135 153 126 155 121 162 L122 189 C133 192 144 184 145 172 Z"
                {...muscleProps('glutes')}
              />

              {/* Outer Hip Abductors (Gluteus Medius) */}
              <path
                d="M93 159 L99 160 L96 184 L89 178 Z"
                {...muscleProps('hip-abductors')}
              />
              <path
                d="M147 159 L141 160 L144 184 L151 178 Z"
                {...muscleProps('hip-abductors')}
              />
            </>
          )}

          {/* Anchored Anatomical Deltoid Caps */}
          {profile.view === 'front' ? (
            <>
              <path
                d="M84 70 C76 72 72 80 74 91 C78 94 83 92 86 85 Z"
                {...muscleProps('front-shoulders')}
              />
              <path
                d="M77 72 C69 77 67 87 70 97 C74 98 78 94 78 86 Z"
                {...muscleProps('side-shoulders')}
              />
              <path
                d="M156 70 C164 72 168 80 166 91 C162 94 157 92 154 85 Z"
                {...muscleProps('front-shoulders')}
              />
              <path
                d="M163 72 C171 77 173 87 170 97 C166 98 162 94 162 86 Z"
                {...muscleProps('side-shoulders')}
              />
            </>
          ) : (
            <>
              <path
                d="M84 70 C73 72 67 81 69 95 C74 99 81 97 86 88 Z"
                {...muscleProps('rear-shoulders')}
              />
              <path
                d="M156 70 C167 72 173 81 171 95 C166 99 159 97 154 88 Z"
                {...muscleProps('rear-shoulders')}
              />
            </>
          )}

          {/* Articulated Left Arm (Upper Arm, Forearm & Anatomical Hand) */}
          <g style={leftArmStyle}>
            <path
              d="M70 94 C64 106 64 119 68 129 L78 129 C81 118 82 104 81 92 Z"
              {...muscleProps(
                profile.view === 'front' ? 'biceps' : 'triceps',
              )}
            />
            <g style={leftForearmStyle}>
              <path
                d="M68 129 C62 143 62 158 65 174 L73 174 C76 158 78 143 78 129 Z"
                {...muscleProps('forearms')}
              />
              <path
                d="M65 174 C63 181 64 189 68 191 C71 192 73 187 74 181 L75 174 Z"
                fill={`url(#${skinGradId})`}
                stroke="#8a97a8"
                strokeWidth="0.9"
              />
            </g>
          </g>

          {/* Articulated Right Arm */}
          <g style={rightArmStyle}>
            <path
              d="M170 94 C176 106 176 119 172 129 L162 129 C159 118 158 104 159 92 Z"
              {...muscleProps(
                profile.view === 'front' ? 'biceps' : 'triceps',
              )}
            />
            <g style={rightForearmStyle}>
              <path
                d="M172 129 C178 143 178 158 175 174 L167 174 C164 158 162 143 162 129 Z"
                {...muscleProps('forearms')}
              />
              <path
                d="M175 174 C177 181 176 189 172 191 C169 192 167 187 166 181 L165 174 Z"
                fill={`url(#${skinGradId})`}
                stroke="#8a97a8"
                strokeWidth="0.9"
              />
            </g>
          </g>

          {/* Articulated Lower Body (Seamless Thighs, Knees, Calves & Feet) */}
          <g style={legMotionStyle}>
            {/* Left & Right Thighs (Quads Sweep vs Hamstring Bellies) */}
            <path
              d="M93 183 C87 205 88 234 95 256 L112 256 C116 234 117 206 116 185 Z"
              {...muscleProps(
                profile.view === 'front' ? 'quads' : 'hamstrings',
              )}
            />
            <path
              d="M147 183 C153 205 152 234 145 256 L128 256 C124 234 123 206 124 185 Z"
              {...muscleProps(
                profile.view === 'front' ? 'quads' : 'hamstrings',
              )}
            />

            {/* Subtle Quad Teardrop / Hamstring Seam */}
            <path
              d="M104 195 Q102 224 105 249 M136 195 Q138 224 135 249"
              stroke="#94a3b8"
              strokeOpacity="0.4"
              strokeWidth="0.8"
              fill="none"
            />

            {/* Anatomical Knees */}
            <path
              d="M95 256 C94 263 95 268 97 272 L111 272 C113 268 113 262 112 256 Z"
              fill={`url(#${skinGradId})`}
              stroke="#94a3b8"
              strokeWidth="0.85"
            />
            <path
              d="M145 256 C146 263 145 268 143 272 L129 272 C127 268 127 262 128 256 Z"
              fill={`url(#${skinGradId})`}
              stroke="#94a3b8"
              strokeWidth="0.85"
            />

            {/* Sculpted Gastrocnemius Calves & Shins */}
            <path
              d="M97 272 C90 286 91 304 97 319 L107 319 C112 304 113 286 111 272 Z"
              {...muscleProps('calves')}
            />
            <path
              d="M143 272 C150 286 149 304 143 319 L133 319 C128 304 127 286 129 272 Z"
              {...muscleProps('calves')}
            />

            {/* Ankles & Natural Feet */}
            <path
              d="M97 319 L91 329 C94 333 104 333 109 329 L107 319 Z"
              fill={`url(#${skinGradId})`}
              stroke="#8a97a8"
              strokeWidth="0.9"
            />
            <path
              d="M143 319 L149 329 C146 333 136 333 131 329 L133 319 Z"
              fill={`url(#${skinGradId})`}
              stroke="#8a97a8"
              strokeWidth="0.9"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
