export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Traps'
  | 'Arms'
  | 'Core & Abs'
  | 'Glutes & Hips'
  | 'Legs';

export type WeightUnit = 'kg' | 'lb';

export type FitnessGoal = 'Muscle Gain' | 'Fat Loss' | 'Strength';

export type GenderOption = 'Prefer not to say' | 'Male' | 'Female';

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export type MembershipPlanId =
  | 'free'
  | 'monthly-starter'
  | 'yearly-value'
  | 'lifetime-pack';

export interface AppRatingRecord {
  stars: number;
  feedback: string;
  updatedAt: string;
}

export interface BmiPlanSuggestion {
  category: BmiCategory;
  headline: string;
  summary: string;
  recommendedGoal: FitnessGoal;
  weeklyWorkouts: number;
  restSeconds: number;
  dailyFocusPoints: string[];
  routine: RoutineTemplate;
  premiumSplitTip: string;
}

export type AuthProvider = 'email' | 'google' | 'phone' | 'guest';

export interface AuthUser {
  id: string;
  provider: AuthProvider;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface StoredAccount {
  id: string;
  provider: 'email' | 'google' | 'phone';
  displayName: string;
  email?: string;
  passwordHash?: string;
  phoneNumber?: string;
  createdAt: string;
}

export type AppTab =
  | 'dashboard'
  | 'workout'
  | 'exercises'
  | 'progress'
  | 'profile';

export type EquipmentType =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight';

export type ImageQuadrant =
  | 'full'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type TargetZone =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'legs';

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  subArea: string;
  targetZone: TargetZone;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  visualUrl: string;
  gripAndForm: string;
  instructions: string[];
  simpleTip: string;
}

export interface WorkoutSet {
  id: string;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface LoggedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  routineId?: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  exercises: LoggedExercise[];
}

export interface RoutineExerciseSpec {
  exerciseId: string;
  defaultSets: number;
  targetReps: number;
  suggestedWeightKg: number;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  category: 'Push Day' | 'Pull Day' | 'Leg Day' | 'Full Body';
  description: string;
  estimatedMinutes: number;
  imageUrl: string;
  targetMuscles: MuscleGroup[];
  exercises: RoutineExerciseSpec[];
}

export interface UserPreferences {
  displayName: string;
  photoDataUrl?: string;
  email: string;
  phoneNumber: string;
  age: number | null;
  gender: GenderOption;
  heightCm: number | null;
  bodyWeightKg: number | null;
  fitnessGoal: FitnessGoal;
  preferredUnit: WeightUnit;
  weeklyGoalWorkouts: number;
  defaultRestSeconds: number;
  autoStartRestTimer: boolean;
  soundEnabled: boolean;
  membershipPlan: MembershipPlanId;
  appRating?: AppRatingRecord;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  maxWeightKg: number;
  repsAtMaxWeight: number;
  estimatedOneRepMaxKg: number;
  achievedAt: string;
}

export interface IronLogBackupPayload {
  version: number;
  exportedAt: string;
  preferences: UserPreferences;
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
}
