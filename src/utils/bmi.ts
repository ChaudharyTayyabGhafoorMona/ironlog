import maleBarbellDeadliftImg from '../assets/images/male_barbell_deadlift_1795617280061.jpg';
import chestFocusImg from '../assets/images/muscle_chest_focus_1795547646131.jpg';
import backFocusImg from '../assets/images/muscle_back_focus_1795547646547.jpg';
import legsFocusImg from '../assets/images/muscle_legs_focus_1795547648977.jpg';
import {
  BmiCategory,
  BmiPlanSuggestion,
  FitnessGoal,
} from '../types/fitness';

export interface BmiResult {
  score: number;
  category: BmiCategory;
  healthyMinKg: number;
  healthyMaxKg: number;
  markerPercent: number;
}

export function calculateBmi(
  heightCm: number | null,
  weightKg: number | null,
): BmiResult | null {
  if (
    typeof heightCm !== 'number' ||
    typeof weightKg !== 'number' ||
    heightCm < 80 ||
    heightCm > 260 ||
    weightKg < 20 ||
    weightKg > 350
  ) {
    return null;
  }

  const heightMeters = heightCm / 100;
  const rawScore = weightKg / (heightMeters * heightMeters);
  const score = Math.round(rawScore * 10) / 10;

  let category: BmiCategory = 'Normal';
  if (score < 18.5) {
    category = 'Underweight';
  } else if (score < 25) {
    category = 'Normal';
  } else if (score < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  const healthyMinKg = Math.round(18.5 * heightMeters * heightMeters * 10) / 10;
  const healthyMaxKg = Math.round(24.9 * heightMeters * heightMeters * 10) / 10;

  // Map BMI 14..38 onto 0..100% scale cleanly
  const clamped = Math.min(38, Math.max(14, score));
  const markerPercent = Math.round(((clamped - 14) / (38 - 14)) * 100);

  return {
    score,
    category,
    healthyMinKg,
    healthyMaxKg,
    markerPercent,
  };
}

export function getBmiCategoryDescription(category: BmiCategory): string {
  switch (category) {
    case 'Underweight':
      return 'Under 18.5 — Focus on steady strength building and healthy muscle mass.';
    case 'Normal':
      return '18.5 to 24.9 — Balanced range. Great spot to build strength or lean muscle.';
    case 'Overweight':
      return '25.0 to 29.9 — Combine full-body strength with brisk pacing to burn extra energy.';
    case 'Obese':
      return '30.0 or higher — Low-impact, joint-friendly strength moves build momentum safely.';
  }
}

export function getBmiWorkoutRecommendation(
  category: BmiCategory,
  selectedGoal: FitnessGoal,
  age: number | null,
): BmiPlanSuggestion {
  const isOlderOrYoungerStarter =
    typeof age === 'number' && (age < 17 || age >= 55);

  if (category === 'Underweight') {
    return {
      category,
      headline: 'Lean Strength & Muscle Builder',
      summary: isOlderOrYoungerStarter
        ? 'Focus on controlled compound lifts 3 days a week with generous rest between sets.'
        : 'Build solid muscle and healthy weight using big compound lifts 3–4 days a week.',
      recommendedGoal: 'Muscle Gain',
      weeklyWorkouts: 3,
      restSeconds: 120,
      dailyFocusPoints: [
        '3 strength sessions per week so your body has time to grow',
        '8 to 10 smooth reps per set using manageable weights',
        'Rest 90–120 seconds between sets to lift with clean form',
      ],
      premiumSplitTip:
        'Rotate Push Day and Pull Day weekly while adding 1 kg / 2.5 lb only when all 3 sets feel steady.',
      routine: {
        id: 'bmi-plan-underweight',
        name: 'Strength Builder Plan',
        category: 'Full Body',
        description:
          'Balanced chest, back, legs, and shoulder exercises designed to add healthy muscle.',
        estimatedMinutes: 40,
        imageUrl: chestFocusImg,
        targetMuscles: ['Chest', 'Back', 'Legs', 'Shoulders'],
        exercises: [
          {
            exerciseId: 'squat-bodyweight-barbell',
            defaultSets: 3,
            targetReps: 8,
            suggestedWeightKg: 25,
          },
          {
            exerciseId: 'bench-press',
            defaultSets: 3,
            targetReps: 8,
            suggestedWeightKg: 25,
          },
          {
            exerciseId: 'lat-pulldown',
            defaultSets: 3,
            targetReps: 10,
            suggestedWeightKg: 30,
          },
          {
            exerciseId: 'seated-shoulder-press',
            defaultSets: 3,
            targetReps: 10,
            suggestedWeightKg: 10,
          },
          {
            exerciseId: 'bicep-curl',
            defaultSets: 2,
            targetReps: 10,
            suggestedWeightKg: 8,
          },
        ],
      },
    };
  }

  if (category === 'Normal') {
    const goalToUse: FitnessGoal = selectedGoal;
    const isStrength = goalToUse === 'Strength';
    const isFatLoss = goalToUse === 'Fat Loss';
    return {
      category,
      headline: isStrength
        ? 'Athletic Strength Split'
        : isFatLoss
          ? 'Lean Tone & Conditioning Split'
          : 'Balanced Push / Pull / Legs Split',
      summary:
        'Your BMI is in the healthy range. Follow a steady 4-day mix of upper and lower body lifts.',
      recommendedGoal: goalToUse,
      weeklyWorkouts: 4,
      restSeconds: isFatLoss ? 60 : isStrength ? 120 : 90,
      dailyFocusPoints: [
        '4 workouts per week alternating Push, Pull, and Leg days',
        isStrength
          ? '6 to 8 focused reps on main exercises with steady form'
          : '10 to 12 steady reps per set with controlled tempo',
        isFatLoss
          ? 'Keep rest breaks brisk around 60 seconds'
          : 'Rest 90 seconds between sets for strong performance',
      ],
      premiumSplitTip:
        'Track weekly total weight lifted in Progress and aim to beat one exercise by 1 rep each week.',
      routine: {
        id: 'bmi-plan-normal',
        name: isFatLoss ? 'Lean Full Body Mix' : 'Balanced Upper & Lower',
        category: 'Full Body',
        description:
          'Well-rounded plan hitting chest, back, shoulders, legs, and core cleanly.',
        estimatedMinutes: 45,
        imageUrl: backFocusImg,
        targetMuscles: ['Chest', 'Back', 'Shoulders', 'Legs', 'Core & Abs'],
        exercises: [
          {
            exerciseId: 'incline-dumbbell-press',
            defaultSets: 3,
            targetReps: 10,
            suggestedWeightKg: 14,
          },
          {
            exerciseId: 'seated-row',
            defaultSets: 3,
            targetReps: 10,
            suggestedWeightKg: 35,
          },
          {
            exerciseId: 'squat-bodyweight-barbell',
            defaultSets: 3,
            targetReps: 10,
            suggestedWeightKg: 35,
          },
          {
            exerciseId: 'side-dumbbell-raise',
            defaultSets: 3,
            targetReps: 12,
            suggestedWeightKg: 6,
          },
          {
            exerciseId: 'kneeling-crunch',
            defaultSets: 3,
            targetReps: 12,
            suggestedWeightKg: 20,
          },
        ],
      },
    };
  }

  if (category === 'Overweight') {
    return {
      category,
      headline: 'Active Fat Loss & Lean Muscle Plan',
      summary:
        'Keep your heart rate moving with big full-body exercises and shorter 60-second breaks.',
      recommendedGoal: 'Fat Loss',
      weeklyWorkouts: 4,
      restSeconds: 60,
      dailyFocusPoints: [
        '4 active full-body sessions per week at a comfortable pace',
        '10 to 15 smooth reps per set to burn energy while protecting joints',
        'Short 60-second rest timer between sets to stay moving',
      ],
      premiumSplitTip:
        'Pair your 4 gym sessions with a 20-minute brisk walk on rest days for faster, sustainable progress.',
      routine: {
        id: 'bmi-plan-overweight',
        name: 'Active Full Body Burn',
        category: 'Full Body',
        description:
          'Full-body calorie-burning routine using beginner-friendly compound movements.',
        estimatedMinutes: 35,
        imageUrl: maleBarbellDeadliftImg,
        targetMuscles: ['Legs', 'Back', 'Chest', 'Core & Abs'],
        exercises: [
          {
            exerciseId: 'squat-bodyweight-barbell',
            defaultSets: 3,
            targetReps: 12,
            suggestedWeightKg: 20,
          },
          {
            exerciseId: 'lat-pulldown',
            defaultSets: 3,
            targetReps: 12,
            suggestedWeightKg: 30,
          },
          {
            exerciseId: 'incline-dumbbell-press',
            defaultSets: 3,
            targetReps: 12,
            suggestedWeightKg: 12,
          },
          {
            exerciseId: 'face-pull',
            defaultSets: 3,
            targetReps: 15,
            suggestedWeightKg: 10,
          },
          {
            exerciseId: 'side-plank-twist',
            defaultSets: 2,
            targetReps: 16,
            suggestedWeightKg: 0,
          },
        ],
      },
    };
  }

  // Obese
  return {
    category,
    headline: 'Joint-Friendly Starter Conditioning',
    summary:
      'Low-impact seated and controlled exercises designed to build stamina and confidence safely.',
    recommendedGoal: 'Fat Loss',
    weeklyWorkouts: 3,
    restSeconds: 75,
    dailyFocusPoints: [
      '3 gentle, consistent workouts per week — consistency beats speed',
      'Seated machines and bodyweight moves to protect knees and lower back',
      '75-second rest timer so you catch your breath comfortably',
    ],
    premiumSplitTip:
      'Start with light weights you can lift for 12 easy reps and focus on steady breathing every set.',
    routine: {
      id: 'bmi-plan-starter-care',
      name: 'Gentle Joint-Safe Starter',
      category: 'Leg Day',
      description:
        'Supported machine and bodyweight movements for comfortable full-body strength.',
      estimatedMinutes: 30,
      imageUrl: legsFocusImg,
      targetMuscles: ['Legs', 'Back', 'Shoulders', 'Core & Abs'],
      exercises: [
        {
          exerciseId: 'seated-leg-curl',
          defaultSets: 3,
          targetReps: 12,
          suggestedWeightKg: 20,
        },
        {
          exerciseId: 'glute-bridge-hip-thrust',
          defaultSets: 3,
          targetReps: 12,
          suggestedWeightKg: 15,
        },
        {
          exerciseId: 'seated-row',
          defaultSets: 3,
          targetReps: 12,
          suggestedWeightKg: 25,
        },
        {
          exerciseId: 'seated-shoulder-press',
          defaultSets: 3,
          targetReps: 12,
          suggestedWeightKg: 8,
        },
        {
          exerciseId: 'calf-ankle-raise',
          defaultSets: 2,
          targetReps: 15,
          suggestedWeightKg: 0,
        },
      ],
    },
  };
}
