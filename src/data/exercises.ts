import backFocusImg from '../assets/images/muscle_back_focus_1795547646547.jpg';
import bentBarbellRowImg from '../assets/images/bent_barbell_row_1795615440789.jpg';
import cableChestFlyImg from '../assets/images/cable_chest_fly_1795615438708.jpg';
import cableTricepsPushdownImg from '../assets/images/cable_triceps_pushdown_1795615440648.jpg';
import chestDipsImg from '../assets/images/chest_dips_exercise_1795615438633.jpg';
import chestFocusImg from '../assets/images/muscle_chest_focus_1795547646131.jpg';
import coreFocusImg from '../assets/images/muscle_core_focus_1795547647309.jpg';
import dumbbellShrugsImg from '../assets/images/dumbbell_shrugs_exercise_1795615440579.jpg';
import inclineDumbbellPressImg from '../assets/images/incline_dumbbell_press_1795615438489.jpg';
import latPulldownImg from '../assets/images/lat_pulldown_exercise_1795615438631.jpg';
import legsFocusImg from '../assets/images/muscle_legs_focus_1795547648977.jpg';
import maleBarbellDeadliftImg from '../assets/images/male_barbell_deadlift_1795617280061.jpg';
import maleFacePullImg from '../assets/images/male_face_pull_1795617281165.jpg';
import maleFarmersWalkImg from '../assets/images/male_farmers_walk_1795617279552.jpg';
import maleHipAbductorImg from '../assets/images/male_hip_abductor_1795617282534.jpg';
import maleHipThrustImg from '../assets/images/male_hip_thrust_1795617283045.jpg';
import maleKneeDriveImg from '../assets/images/male_knee_drive_1795617282821.jpg';
import maleKneelingCrunchImg from '../assets/images/male_kneeling_crunch_1795617281235.jpg';
import maleLegCurlImg from '../assets/images/male_leg_curl_1795617283330.jpg';
import maleSidePlankImg from '../assets/images/male_side_plank_1795617281737.jpg';
import seatedCableRowImg from '../assets/images/seated_cable_row_1795615439645.jpg';
import seatedShoulderPressImg from '../assets/images/seated_shoulder_press_1795615440226.jpg';
import seatedWristCurlImg from '../assets/images/seated_wrist_curl_1795615441222.jpg';
import shouldersFocusImg from '../assets/images/muscle_shoulders_focus_1795547646673.jpg';
import standingCalfRaiseImg from '../assets/images/standing_calf_raise_1795615673741.jpg';
import {
  ExerciseDefinition,
  MuscleGroup,
  RoutineTemplate,
  TargetZone,
  UserPreferences,
} from '../types/fitness';

export const CREATOR_PHOTO_URL =
  '/assets/aistudio/WhatsApp_Image_2026-11-25_at_5.42.55_PM_f3717d7b.jpeg';

export const PHOTO_BLUE_CURLS =
  '/assets/aistudio/WhatsApp_Image_2026-11-25_at_4.11.27_PM_aa815e9a.jpeg';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Traps',
  'Arms',
  'Core & Abs',
  'Glutes & Hips',
  'Legs',
];

export interface ExerciseGuideItem {
  id: string;
  name: string;
  muscleGroup: string;
  targetZone: TargetZone;
  gripAndForm: string;
  visualUrl: string;
}

export interface MuscleFocusMetadata {
  group: MuscleGroup;
  targetZone: TargetZone;
  imageUrl: string;
  imagePosition?: string;
  imageAlt: string;
  subAreas: string[];
  plainSummary: string;
  easyTip: string;
}

export const MUSCLE_FOCUS_META: Record<MuscleGroup, MuscleFocusMetadata> = {
  Chest: {
    group: 'Chest',
    targetZone: 'chest',
    imageUrl: chestFocusImg,
    imagePosition: '50% 35%',
    imageAlt: 'Barbell bench press for chest strength',
    subAreas: ['Upper Chest', 'Mid Chest', 'Lower Chest'],
    plainSummary:
      'Pushing exercises strengthen your upper, middle, and lower chest along with the front of your arms.',
    easyTip:
      'Keep your shoulders resting back on the bench and breathe out as you push up.',
  },
  Back: {
    group: 'Back',
    targetZone: 'back',
    imageUrl: backFocusImg,
    imagePosition: '50% 30%',
    imageAlt: 'Pull-up bar exercise targeting lats and upper back',
    subAreas: ['Lats', 'Upper Back', 'Lower Back'],
    plainSummary:
      'Pulling moves build a strong back, better posture, and protect your spine during daily lifting.',
    easyTip: 'Pull your elbows back smoothly and keep your chest lifted.',
  },
  Shoulders: {
    group: 'Shoulders',
    targetZone: 'shoulders',
    imageUrl: shouldersFocusImg,
    imagePosition: '50% 25%',
    imageAlt: 'Dumbbell lateral raise for shoulder muscles',
    subAreas: ['Front Shoulders', 'Side Shoulders', 'Rear Shoulders'],
    plainSummary:
      'Overhead presses and gentle raises keep your shoulder joints strong, balanced, and pain-free.',
    easyTip: 'Use light to medium weight and move slowly without swinging.',
  },
  Traps: {
    group: 'Traps',
    targetZone: 'shoulders',
    imageUrl: maleFarmersWalkImg,
    imagePosition: '50% 25%',
    imageAlt: 'Male athlete performing dumbbell carries for upper traps',
    subAreas: ['Upper Traps', 'Mid Traps'],
    plainSummary:
      'These muscles support your neck, upper back, and shoulder blades when carrying heavy items.',
    easyTip:
      'Lift your shoulders straight up toward your ears, pause, and lower slowly.',
  },
  Arms: {
    group: 'Arms',
    targetZone: 'arms',
    imageUrl: PHOTO_BLUE_CURLS,
    imagePosition: '50% 20%',
    imageAlt: 'Dumbbell bicep curl for arm strength',
    subAreas: ['Biceps', 'Triceps', 'Forearms & Wrists'],
    plainSummary:
      'Arm exercises strengthen your biceps, the back of your arms (triceps), and your grip and wrists.',
    easyTip: 'Keep your elbows tucked near your ribs so your arms do the work.',
  },
  'Core & Abs': {
    group: 'Core & Abs',
    targetZone: 'core',
    imageUrl: coreFocusImg,
    imagePosition: '50% 35%',
    imageAlt: 'Hanging leg raise targeting core and abdominal muscles',
    subAreas: ['Upper Abs', 'Lower Abs', 'Obliques'],
    plainSummary:
      'A steady core protects your lower back and improves balance for walking, running, and lifting.',
    easyTip:
      'Breathe steadily and keep your belly tight—never pull on your neck.',
  },
  'Glutes & Hips': {
    group: 'Glutes & Hips',
    targetZone: 'legs',
    imageUrl: maleBarbellDeadliftImg,
    imagePosition: '50% 32%',
    imageAlt: 'Male athlete performing barbell deadlift for glutes and posterior chain',
    subAreas: ['Glutes', 'Hip Abductors', 'Hip Flexors'],
    plainSummary:
      'Strong glutes and hips power standing up, climbing stairs, and keep your knees and back comfortable.',
    easyTip:
      'Push through your heels and squeeze your glutes gently at the top.',
  },
  Legs: {
    group: 'Legs',
    targetZone: 'legs',
    imageUrl: legsFocusImg,
    imagePosition: '50% 35%',
    imageAlt: 'Barbell back squat for quads, hamstrings, and calves',
    subAreas: ['Quads', 'Hamstrings', 'Calves & Ankles'],
    plainSummary:
      'Leg training strengthens your thighs, calves, and ankles for everyday energy and stability.',
    easyTip:
      'Keep your feet flat on the floor and move down and up at an easy pace.',
  },
};

export const TWENTY_SIX_EXERCISES: ExerciseGuideItem[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Mid Chest',
    targetZone: 'chest',
    gripAndForm:
      'Hold the bar slightly wider than your shoulders, lower smoothly to mid-chest, and press straight up.',
    visualUrl: chestFocusImg,
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Upper Chest',
    targetZone: 'chest',
    gripAndForm:
      'Sit on an angled bench holding dumbbells at upper chest level and press smoothly overhead.',
    visualUrl: inclineDumbbellPressImg,
  },
  {
    id: 'chest-dips',
    name: 'Chest Dips (or Assisted Dips)',
    muscleGroup: 'Lower Chest',
    targetZone: 'chest',
    gripAndForm:
      'Grip both dip bars, lean your chest slightly forward, lower calmly, and push back up.',
    visualUrl: chestDipsImg,
  },
  {
    id: 'cable-chest-squeeze',
    name: 'Cable Chest Squeeze (Fly)',
    muscleGroup: 'Mid Chest',
    targetZone: 'chest',
    gripAndForm:
      'Hold one cable handle in each hand with soft elbows and bring both hands together in front of your chest.',
    visualUrl: cableChestFlyImg,
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Lats',
    targetZone: 'back',
    gripAndForm:
      'Grip the wide overhead bar, sit tall with knees tucked under the pad, and pull down to your upper chest.',
    visualUrl: latPulldownImg,
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    muscleGroup: 'Lats',
    targetZone: 'back',
    gripAndForm:
      'Grip the bar palms facing away, pull your chest toward the bar, and lower down calmly.',
    visualUrl: backFocusImg,
  },
  {
    id: 'seated-row',
    name: 'Seated Row',
    muscleGroup: 'Upper Back',
    targetZone: 'back',
    gripAndForm:
      'Sit upright with chest tall, pull the handle smoothly toward your belly, and squeeze your shoulder blades.',
    visualUrl: seatedCableRowImg,
  },
  {
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    muscleGroup: 'Lower Back',
    targetZone: 'back',
    gripAndForm:
      'Stand close to the bar, keep your back flat, and push through your legs to stand tall.',
    visualUrl: maleBarbellDeadliftImg,
  },
  {
    id: 'seated-shoulder-press',
    name: 'Seated Shoulder Press',
    muscleGroup: 'Front Shoulders',
    targetZone: 'shoulders',
    gripAndForm:
      'Sit upright with dumbbells at ear level and press smoothly straight overhead.',
    visualUrl: seatedShoulderPressImg,
  },
  {
    id: 'side-dumbbell-raise',
    name: 'Side Dumbbell Raise',
    muscleGroup: 'Side Shoulders',
    targetZone: 'shoulders',
    gripAndForm:
      'Hold light dumbbells at your sides and lift both arms outward until shoulder height.',
    visualUrl: shouldersFocusImg,
  },
  {
    id: 'face-pull',
    name: 'Face Pull (Rear Shoulders)',
    muscleGroup: 'Rear Shoulders',
    targetZone: 'shoulders',
    gripAndForm:
      'Hold the rope at eye height and pull the ends apart toward your forehead with elbows high.',
    visualUrl: maleFacePullImg,
  },
  {
    id: 'dumbbell-shrugs',
    name: 'Dumbbell Shrugs',
    muscleGroup: 'Upper Traps',
    targetZone: 'shoulders',
    gripAndForm:
      'Hold dumbbells calmly at your sides and lift your shoulders straight up toward your ears.',
    visualUrl: dumbbellShrugsImg,
  },
  {
    id: 'farmers-walk-hold',
    name: "Farmer's Walk Hold",
    muscleGroup: 'Upper Traps & Grip',
    targetZone: 'shoulders',
    gripAndForm:
      'Hold sturdy weights at your sides, stand tall with chest proud, and walk with steady steps.',
    visualUrl: maleFarmersWalkImg,
  },
  {
    id: 'mid-back-barbell-row',
    name: 'Mid-Back Barbell Row',
    muscleGroup: 'Mid Traps & Rhomboids',
    targetZone: 'back',
    gripAndForm:
      'Bend slightly at the hips with a flat back and pull the bar smoothly toward your lower ribs.',
    visualUrl: bentBarbellRowImg,
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    muscleGroup: 'Biceps',
    targetZone: 'arms',
    gripAndForm:
      'Keep your elbows still by your sides and curl the weights smoothly up toward your shoulders.',
    visualUrl: PHOTO_BLUE_CURLS,
  },
  {
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    muscleGroup: 'Triceps',
    targetZone: 'arms',
    gripAndForm:
      'Tuck your elbows beside your ribs and push the rope handle straight down until your arms straighten.',
    visualUrl: cableTricepsPushdownImg,
  },
  {
    id: 'seated-wrist-forearm-curl',
    name: 'Seated Wrist & Forearm Curl',
    muscleGroup: 'Forearms & Wrists',
    targetZone: 'arms',
    gripAndForm:
      'Rest your forearms flat on your thighs palms up and slowly curl your wrists upward.',
    visualUrl: seatedWristCurlImg,
  },
  {
    id: 'kneeling-crunch',
    name: 'Kneeling Crunch',
    muscleGroup: 'Upper Abs',
    targetZone: 'core',
    gripAndForm:
      'Kneel facing the cable, hold the rope beside your forehead, and curl your ribs gently downward.',
    visualUrl: maleKneelingCrunchImg,
  },
  {
    id: 'knee-or-leg-raise',
    name: 'Knee or Leg Raise',
    muscleGroup: 'Lower Abs',
    targetZone: 'core',
    gripAndForm:
      'Hang steadily from the bar and lift your knees or straight legs slowly up toward waist height.',
    visualUrl: coreFocusImg,
  },
  {
    id: 'side-plank-twist',
    name: 'Side Plank & Twist',
    muscleGroup: 'Obliques',
    targetZone: 'core',
    gripAndForm:
      'Prop your weight on one forearm on a mat, lift your hips in a straight line, and hold steadily.',
    visualUrl: maleSidePlankImg,
  },
  {
    id: 'glute-bridge-hip-thrust',
    name: 'Glute Bridge / Hip Thrust',
    muscleGroup: 'Glutes',
    targetZone: 'legs',
    gripAndForm:
      'Rest your upper back on a bench with feet flat, then push through your heels to lift your hips.',
    visualUrl: maleHipThrustImg,
  },
  {
    id: 'side-leg-lift-abductor',
    name: 'Side Leg Lift (Hip Abductor)',
    muscleGroup: 'Hip Abductors',
    targetZone: 'legs',
    gripAndForm:
      'Sit upright in the machine and press your knees smoothly outward against the side pads.',
    visualUrl: maleHipAbductorImg,
  },
  {
    id: 'weighted-knee-drive',
    name: 'Weighted Knee Drive (Hip Flexors)',
    muscleGroup: 'Hip Flexors',
    targetZone: 'legs',
    gripAndForm:
      'Hold a sturdy rack with both hands and smoothly lift one knee upward to hip height.',
    visualUrl: maleKneeDriveImg,
  },
  {
    id: 'squat-bodyweight-barbell',
    name: 'Squat (Bodyweight or Barbell)',
    muscleGroup: 'Quads',
    targetZone: 'legs',
    gripAndForm:
      'Stand shoulder-width apart, sit your hips back and down like sitting in a chair, and stand tall.',
    visualUrl: legsFocusImg,
  },
  {
    id: 'seated-leg-curl',
    name: 'Seated Leg Curl',
    muscleGroup: 'Hamstrings',
    targetZone: 'legs',
    gripAndForm:
      'Sit upright with the pad behind your lower ankles and bend your knees smoothly down and back.',
    visualUrl: maleLegCurlImg,
  },
  {
    id: 'calf-ankle-raise',
    name: 'Calf & Ankle Raise',
    muscleGroup: 'Calves & Ankles',
    targetZone: 'legs',
    gripAndForm:
      'Stand on the edge of a low step block, lift high onto your toes, pause, and lower smoothly.',
    visualUrl: standingCalfRaiseImg,
  },
];

const GUIDE_META_BY_ID = new Map(
  TWENTY_SIX_EXERCISES.map((item) => [item.id, item]),
);

function withGuide(
  base: Omit<ExerciseDefinition, 'targetZone' | 'visualUrl' | 'gripAndForm'>,
): ExerciseDefinition {
  const guide = GUIDE_META_BY_ID.get(base.id);
  return {
    ...base,
    targetZone: guide?.targetZone ?? 'chest',
    visualUrl: guide?.visualUrl ?? CREATOR_PHOTO_URL,
    gripAndForm: guide?.gripAndForm ?? base.instructions.join(' '),
  };
}

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // Chest (Upper / Mid / Lower)
  withGuide({
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    subArea: 'Mid Chest',
    secondaryMuscles: ['Shoulders', 'Arms'],
    equipment: 'Barbell',
    instructions: [
      'Lie flat on the bench with both feet planted firmly on the floor and grip the bar slightly wider than your shoulders.',
      'Breathe in and lower the bar slowly and evenly down until it gently nears the middle of your chest.',
      'Breathe out and press the bar straight back up until your arms are nearly straight without snapping your elbows.',
    ],
    simpleTip:
      'Keep your shoulders resting back against the bench from start to finish.',
  }),
  withGuide({
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    subArea: 'Upper Chest',
    secondaryMuscles: ['Shoulders', 'Arms'],
    equipment: 'Dumbbell',
    instructions: [
      'Set the bench to a comfortable 30 to 45-degree angle and hold one dumbbell in each hand just above your upper chest.',
      'Press both dumbbells smoothly upward until your hands almost meet above your chest.',
      'Lower both weights slowly back to shoulder height over two seconds before starting the next rep.',
    ],
    simpleTip: 'Keep your wrists straight and take your time lowering the weights.',
  }),
  withGuide({
    id: 'chest-dips',
    name: 'Chest Dips (or Assisted Dips)',
    muscleGroup: 'Chest',
    subArea: 'Lower Chest',
    secondaryMuscles: ['Arms', 'Shoulders'],
    equipment: 'Bodyweight',
    instructions: [
      'Grip both parallel handles firmly with straight arms and lean your upper body slightly forward.',
      'Bend your elbows calmly to lower yourself until your shoulders are just below your elbows.',
      'Press steadily through your palms to lift back up to the starting position.',
    ],
    simpleTip:
      'If bodyweight dips feel tough, use an assisted dip machine or do incline push-ups.',
  }),
  withGuide({
    id: 'cable-chest-squeeze',
    name: 'Cable Chest Squeeze (Fly)',
    muscleGroup: 'Chest',
    subArea: 'Mid Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
    instructions: [
      'Grab one cable handle in each hand, take one small step forward for balance, and keep a slight bend in both elbows.',
      'Bring your hands together in front of your chest in a wide hugging motion while breathing out.',
      'Pause for one second while squeezing your chest, then let your arms open slowly back out.',
    ],
    simpleTip: 'Imagine hugging a large tree—keep your elbows softly bent the whole time.',
  }),

  // Back (Lats / Upper / Lower)
  withGuide({
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    subArea: 'Lats',
    secondaryMuscles: ['Arms'],
    equipment: 'Cable',
    instructions: [
      'Hold the overhead bar wider than shoulder width, sit upright, and tuck your thighs snugly under the leg pad.',
      'Pull your elbows down toward your sides to bring the bar smoothly to your upper chest.',
      'Pause briefly at chest level, then let the bar rise slowly until your arms are comfortably stretched overhead.',
    ],
    simpleTip: 'Think about pulling with your elbows rather than yanking with your hands.',
  }),
  withGuide({
    id: 'pull-ups',
    name: 'Pull-Ups',
    muscleGroup: 'Back',
    subArea: 'Lats',
    secondaryMuscles: ['Arms', 'Core & Abs'],
    equipment: 'Bodyweight',
    instructions: [
      'Hold the overhead bar slightly wider than your shoulders with palms facing forward and gently pull your shoulders down away from your ears.',
      'Pull your chest smoothly upward toward the bar without kicking or swinging your legs.',
      'Lower yourself slowly all the way back down with full control before starting the next rep.',
    ],
    simpleTip: 'Use an assisted pull-up machine or resistance band anytime you need support.',
  }),
  withGuide({
    id: 'seated-row',
    name: 'Seated Row',
    muscleGroup: 'Back',
    subArea: 'Upper Back',
    secondaryMuscles: ['Arms', 'Traps'],
    equipment: 'Cable',
    instructions: [
      'Sit tall on the bench with your feet braced on the footplates, knees slightly soft, and both hands gripping the handle.',
      'Pull the handle smoothly toward your belly button while keeping your torso upright.',
      'Squeeze your shoulder blades gently together for a moment, then let your arms extend slowly forward.',
    ],
    simpleTip: 'Keep your chest lifted and avoid rocking far backward as you pull.',
  }),
  withGuide({
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    muscleGroup: 'Back',
    subArea: 'Lower Back',
    secondaryMuscles: ['Glutes & Hips', 'Legs'],
    equipment: 'Barbell',
    instructions: [
      'Stand with your mid-foot under the bar, push your hips back, keep your back flat, and grip the bar just outside your legs.',
      'Brace your belly tight and push smoothly through your feet to stand up tall with the bar close to your thighs.',
      'Lower the bar back to the floor by pushing your hips back first with a steady flat spine.',
    ],
    simpleTip: 'Keep the barbell brushing close to your legs so your lower back stays safe.',
  }),

  // Shoulders (Front / Side / Rear)
  withGuide({
    id: 'seated-shoulder-press',
    name: 'Seated Shoulder Press',
    muscleGroup: 'Shoulders',
    subArea: 'Front Shoulders',
    secondaryMuscles: ['Arms'],
    equipment: 'Dumbbell',
    instructions: [
      'Sit upright with your back supported and hold one dumbbell in each hand just outside your ears.',
      'Breathe out and press both dumbbells smoothly straight overhead until your arms are nearly straight.',
      'Lower the dumbbells gently back down to ear height under full control.',
    ],
    simpleTip: 'Keep your belly tight so your lower back stays comfortable against the bench.',
  }),
  withGuide({
    id: 'side-dumbbell-raise',
    name: 'Side Dumbbell Raise',
    muscleGroup: 'Shoulders',
    subArea: 'Side Shoulders',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    instructions: [
      'Stand tall holding a light dumbbell in each hand at your sides with a soft bend in your elbows.',
      'Raise both arms smoothly out to the sides until your hands reach shoulder height.',
      'Pause briefly at the top, then lower both dumbbells slowly down to your sides.',
    ],
    simpleTip: 'Choose a comfortable weight so you do not need to swing your body.',
  }),
  withGuide({
    id: 'face-pull',
    name: 'Face Pull (Rear Shoulders)',
    muscleGroup: 'Shoulders',
    subArea: 'Rear Shoulders',
    secondaryMuscles: ['Back', 'Traps'],
    equipment: 'Cable',
    instructions: [
      'Set the pulley at eye level, hold both ends of the rope with thumbs pointing back, and step back until the cable feels snug.',
      'Pull the rope ends apart toward your forehead while keeping your elbows raised high.',
      'Hold for one breath squeezing the backs of your shoulders, then extend your arms slowly forward.',
    ],
    simpleTip: 'Great for fixing rounded shoulders from sitting at a desk or phone.',
  }),

  // Traps (Upper Traps / Mid Traps)
  withGuide({
    id: 'dumbbell-shrugs',
    name: 'Dumbbell Shrugs',
    muscleGroup: 'Traps',
    subArea: 'Upper Traps',
    secondaryMuscles: ['Arms'],
    equipment: 'Dumbbell',
    instructions: [
      'Stand upright holding a dumbbell comfortably in each hand with your arms hanging straight at your sides.',
      'Lift both shoulders straight up toward your ears without bending your elbows.',
      'Pause for one second at the top, then lower your shoulders slowly all the way down.',
    ],
    simpleTip: 'Lift straight up and down—avoid rolling your shoulders in circles.',
  }),
  withGuide({
    id: 'farmers-walk-hold',
    name: "Farmer's Walk Hold",
    muscleGroup: 'Traps',
    subArea: 'Upper Traps',
    secondaryMuscles: ['Arms', 'Core & Abs'],
    equipment: 'Dumbbell',
    instructions: [
      'Pick up a dumbbell in each hand, stand tall with your shoulders back, and look straight ahead.',
      'Brace your core and walk forward with calm, even steps for 20 to 30 steps.',
      'Turn smoothly or set the dumbbells down carefully by bending your knees and hips.',
    ],
    simpleTip: 'Builds strong shoulders, posture, and everyday grip strength.',
  }),
  withGuide({
    id: 'mid-back-barbell-row',
    name: 'Mid-Back Barbell Row',
    muscleGroup: 'Traps',
    subArea: 'Mid Traps',
    secondaryMuscles: ['Back', 'Arms'],
    equipment: 'Barbell',
    instructions: [
      'Stand with feet shoulder-width apart, bend slightly at the knees, hinge forward with a flat back, and grip the bar shoulder-width.',
      'Pull the barbell smoothly up toward your lower chest while driving your elbows backward.',
      'Lower the bar slowly back to arm’s length while keeping your back flat and steady.',
    ],
    simpleTip: 'Look at the floor a few feet ahead so your neck stays relaxed.',
  }),

  // Arms (Biceps / Triceps / Forearms & Wrists)
  withGuide({
    id: 'bicep-curl',
    name: 'Bicep Curl',
    muscleGroup: 'Arms',
    subArea: 'Biceps',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    instructions: [
      'Stand tall holding weights at your sides with palms facing forward and elbows tucked gently near your ribs.',
      'Curl the weights smoothly up toward your shoulders while keeping your upper arms completely still.',
      'Squeeze your biceps briefly at the top, then lower the weights slowly all the way down.',
    ],
    simpleTip: 'Keep your torso still—no swinging backward to lift the weight.',
  }),
  withGuide({
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    muscleGroup: 'Arms',
    subArea: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
    instructions: [
      'Stand facing the cable stack, hold the rope attachment with both hands, and pin your elbows neatly beside your ribs.',
      'Push your hands smoothly down toward your thighs until your arms straighten fully.',
      'Pause to feel the backs of your arms tighten, then let your forearms rise slowly back up.',
    ],
    simpleTip: 'Only your forearms should hinge—keep your elbows glued to your sides.',
  }),
  withGuide({
    id: 'seated-wrist-forearm-curl',
    name: 'Seated Wrist & Forearm Curl',
    muscleGroup: 'Arms',
    subArea: 'Forearms & Wrists',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    instructions: [
      'Sit on a flat bench and rest your forearms across your thighs with your palms facing upward and wrists just past your knees.',
      'Let the light dumbbells roll slightly into your fingers, then curl your wrists smoothly upward.',
      'Lower your wrists gently back down for a comfortable stretch before repeating.',
    ],
    simpleTip: 'Use light weight and slow movement so your wrists feel smooth and comfortable.',
  }),

  // Core & Abs (Upper / Lower / Obliques)
  withGuide({
    id: 'kneeling-crunch',
    name: 'Kneeling Crunch',
    muscleGroup: 'Core & Abs',
    subArea: 'Upper Abs',
    secondaryMuscles: [],
    equipment: 'Cable',
    instructions: [
      'Kneel on a mat facing the cable pulley and hold both ends of the rope lightly next to your temples.',
      'Keep your hips still, breathe out, and curl your chest gently downward toward your thighs using your abs.',
      'Hold the squeeze at the bottom for one second, then rise slowly back up without leaning back.',
    ],
    simpleTip: 'Let your stomach muscles fold your ribs down—do not pull with your neck.',
  }),
  withGuide({
    id: 'knee-or-leg-raise',
    name: 'Knee or Leg Raise',
    muscleGroup: 'Core & Abs',
    subArea: 'Lower Abs',
    secondaryMuscles: ['Glutes & Hips'],
    equipment: 'Bodyweight',
    instructions: [
      'Hang steadily from the bar (or rest in an arm-supported leg-raise stand) with your body still.',
      'Tighten your lower belly and lift your bent knees—or straight legs—smoothly up toward hip height.',
      'Lower your legs slowly back down without letting your body swing.',
    ],
    simpleTip:
      'Bending your knees makes this much easier while still working your lower abs.',
  }),
  withGuide({
    id: 'side-plank-twist',
    name: 'Side Plank & Twist',
    muscleGroup: 'Core & Abs',
    subArea: 'Obliques',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Bodyweight',
    instructions: [
      'Lie on your side on a mat with your elbow directly under your shoulder and your legs stacked cleanly.',
      'Lift your hips upward so your head, waist, and ankles form a straight line, resting your top hand on your hip or overhead.',
      'Hold steady for 20 to 30 seconds (or add a gentle slow waist turn), then switch sides.',
    ],
    simpleTip: 'Bend your bottom knee onto the mat anytime you want extra balance.',
  }),

  // Glutes & Hips (Glutes / Hip Abductors / Hip Flexors)
  withGuide({
    id: 'glute-bridge-hip-thrust',
    name: 'Glute Bridge / Hip Thrust',
    muscleGroup: 'Glutes & Hips',
    subArea: 'Glutes',
    secondaryMuscles: ['Legs'],
    equipment: 'Barbell',
    instructions: [
      'Rest your upper back comfortably across a bench (or lie on a mat), plant your feet flat hip-width apart, and hold a padded bar over your hips.',
      'Drive down through your heels to lift your hips until your body forms a straight line from shoulders to knees.',
      'Squeeze your glutes gently at the top for one second, then lower your hips slowly.',
    ],
    simpleTip: 'Keep your chin slightly tucked and look forward rather than up at the ceiling.',
  }),
  withGuide({
    id: 'side-leg-lift-abductor',
    name: 'Side Leg Lift (Hip Abductor)',
    muscleGroup: 'Glutes & Hips',
    subArea: 'Hip Abductors',
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Sit upright in the hip abductor machine with your back resting cleanly against the pad and knees against the outer pads.',
      'Press both thighs smoothly outward away from each other as far as feels comfortable.',
      'Pause briefly, then bring your legs slowly back together without letting the weight stack clang.',
    ],
    simpleTip: 'Strengthens your outer hips and keeps your knees steady when walking or climbing.',
  }),
  withGuide({
    id: 'weighted-knee-drive',
    name: 'Weighted Knee Drive (Hip Flexors)',
    muscleGroup: 'Glutes & Hips',
    subArea: 'Hip Flexors',
    secondaryMuscles: ['Core & Abs'],
    equipment: 'Cable',
    instructions: [
      'Fasten a light ankle strap around one ankle, stand tall facing away or holding a sturdy upright rail for balance.',
      'Keep your back straight and drive that knee smoothly upward toward hip height.',
      'Lower your foot back toward the floor slowly with full control before starting the next rep.',
    ],
    simpleTip: 'Stand tall on your supporting leg without leaning backward.',
  }),

  // Legs (Quads / Hamstrings / Calves & Ankles)
  withGuide({
    id: 'squat-bodyweight-barbell',
    name: 'Squat (Bodyweight or Barbell)',
    muscleGroup: 'Legs',
    subArea: 'Quads',
    secondaryMuscles: ['Glutes & Hips', 'Core & Abs'],
    equipment: 'Barbell',
    instructions: [
      'Stand with your feet shoulder-width apart and toes angled slightly outward, either bodyweight or with a barbell resting across your upper back.',
      'Sit your hips back and bend your knees smoothly as if lowering onto a sturdy chair while keeping your chest lifted.',
      'Push evenly through your whole feet to stand tall back up to the starting position.',
    ],
    simpleTip:
      'Start with bodyweight squats until sitting down and standing up feels smooth.',
  }),
  withGuide({
    id: 'seated-leg-curl',
    name: 'Seated Leg Curl',
    muscleGroup: 'Legs',
    subArea: 'Hamstrings',
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Sit back against the seat pad, line your knees up with the machine hinge, and place the lower roller comfortably behind your ankles.',
      'Pull your heels smoothly down and back underneath the seat to squeeze the backs of your thighs.',
      'Hold briefly at the bottom, then let your legs straighten slowly back up.',
    ],
    simpleTip: 'Control the return upward so the weights never snap down.',
  }),
  withGuide({
    id: 'calf-ankle-raise',
    name: 'Calf & Ankle Raise',
    muscleGroup: 'Legs',
    subArea: 'Calves & Ankles',
    secondaryMuscles: [],
    equipment: 'Bodyweight',
    instructions: [
      'Stand with the balls of both feet on a low step block (or flat floor), holding a rack lightly for balance.',
      'Rise as high as you comfortably can onto your tiptoes and pause for one full second.',
      'Lower your heels slowly down until you feel a gentle stretch in your calves.',
    ],
    simpleTip: 'Move slowly at the top and bottom—no bouncing up and down.',
  }),
];

export const QUICK_ROUTINES: RoutineTemplate[] = [
  {
    id: 'routine-push',
    name: 'Push Day',
    category: 'Push Day',
    description:
      'Simple upper-body pushing for chest, shoulders, and triceps.',
    estimatedMinutes: 45,
    imageUrl: chestFocusImg,
    targetMuscles: ['Chest', 'Shoulders', 'Arms'],
    exercises: [
      {
        exerciseId: 'bench-press',
        defaultSets: 3,
        targetReps: 8,
        suggestedWeightKg: 40,
      },
      {
        exerciseId: 'incline-dumbbell-press',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 16,
      },
      {
        exerciseId: 'seated-shoulder-press',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 14,
      },
      {
        exerciseId: 'side-dumbbell-raise',
        defaultSets: 3,
        targetReps: 12,
        suggestedWeightKg: 6,
      },
      {
        exerciseId: 'triceps-pushdown',
        defaultSets: 3,
        targetReps: 12,
        suggestedWeightKg: 15,
      },
    ],
  },
  {
    id: 'routine-pull',
    name: 'Pull Day',
    category: 'Pull Day',
    description:
      'Back, traps, rear shoulders, and biceps for strong posture.',
    estimatedMinutes: 45,
    imageUrl: backFocusImg,
    targetMuscles: ['Back', 'Traps', 'Arms'],
    exercises: [
      {
        exerciseId: 'lat-pulldown',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 35,
      },
      {
        exerciseId: 'seated-row',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 35,
      },
      {
        exerciseId: 'face-pull',
        defaultSets: 3,
        targetReps: 15,
        suggestedWeightKg: 12,
      },
      {
        exerciseId: 'dumbbell-shrugs',
        defaultSets: 3,
        targetReps: 12,
        suggestedWeightKg: 16,
      },
      {
        exerciseId: 'bicep-curl',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 10,
      },
    ],
  },
  {
    id: 'routine-legs',
    name: 'Leg Day',
    category: 'Leg Day',
    description: 'Squats, glutes, hamstrings, calves, and core stability.',
    estimatedMinutes: 50,
    imageUrl: legsFocusImg,
    targetMuscles: ['Legs', 'Glutes & Hips', 'Core & Abs'],
    exercises: [
      {
        exerciseId: 'squat-bodyweight-barbell',
        defaultSets: 3,
        targetReps: 8,
        suggestedWeightKg: 40,
      },
      {
        exerciseId: 'glute-bridge-hip-thrust',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 40,
      },
      {
        exerciseId: 'seated-leg-curl',
        defaultSets: 3,
        targetReps: 12,
        suggestedWeightKg: 30,
      },
      {
        exerciseId: 'calf-ankle-raise',
        defaultSets: 3,
        targetReps: 15,
        suggestedWeightKg: 0,
      },
      {
        exerciseId: 'kneeling-crunch',
        defaultSets: 3,
        targetReps: 12,
        suggestedWeightKg: 20,
      },
    ],
  },
  {
    id: 'routine-full-body',
    name: 'Full Body',
    category: 'Full Body',
    description: 'Easy all-around workout hitting every major body area.',
    estimatedMinutes: 40,
    imageUrl: maleBarbellDeadliftImg,
    targetMuscles: ['Legs', 'Chest', 'Back', 'Shoulders', 'Core & Abs'],
    exercises: [
      {
        exerciseId: 'squat-bodyweight-barbell',
        defaultSets: 3,
        targetReps: 8,
        suggestedWeightKg: 40,
      },
      {
        exerciseId: 'bench-press',
        defaultSets: 3,
        targetReps: 8,
        suggestedWeightKg: 40,
      },
      {
        exerciseId: 'seated-row',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 35,
      },
      {
        exerciseId: 'seated-shoulder-press',
        defaultSets: 3,
        targetReps: 10,
        suggestedWeightKg: 12,
      },
      {
        exerciseId: 'side-plank-twist',
        defaultSets: 2,
        targetReps: 20,
        suggestedWeightKg: 0,
      },
    ],
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: 'Athlete',
  photoDataUrl: undefined,
  email: '',
  phoneNumber: '',
  age: null,
  gender: 'Prefer not to say',
  heightCm: null,
  bodyWeightKg: null,
  fitnessGoal: 'Muscle Gain',
  preferredUnit: 'kg',
  weeklyGoalWorkouts: 4,
  defaultRestSeconds: 90,
  autoStartRestTimer: true,
  soundEnabled: true,
  membershipPlan: 'free',
};
