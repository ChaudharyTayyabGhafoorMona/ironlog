import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Star,
} from 'lucide-react';
import { AppRatingRecord } from '../types/fitness';
import { StoredDeviceRating } from '../utils/storage';

interface AppRatingAndHelpProps {
  currentRating?: AppRatingRecord;
  deviceRatings: StoredDeviceRating[];
  onSubmitRating: (stars: number, feedback: string) => void;
}

const HELP_FAQS: { question: string; answer: string }[] = [
  {
    question: '1. How do I start my very first workout?',
    answer:
      'Go to Home and enter your height and weight in the BMI Calculator, or tap any Easy Workout Plan (Push Day, Pull Day, Leg Day, Full Body). Check off each set when finished and tap Finish Workout to save it.',
  },
  {
    question: '2. How does the BMI Workout Plan work?',
    answer:
      'Your BMI score compares your weight and height into Underweight, Normal, Overweight, or Obese ranges. IronLog automatically picks an exercise count, rep pace, and rest timer that fits your body safely.',
  },
  {
    question: '3. What does the red highlight in Body Guide mean?',
    answer:
      'Every exercise card in the Guide tab shows a front or back male body diagram with the main target muscle glowing in red so you know exactly which muscle you are training, along with 3 plain form steps.',
  },
  {
    question: '4. How do I change between kg and lb?',
    answer:
      'Open Profile & Settings (or the top of the Workout tab) and tap Kilograms (kg) or Pounds (lb). All weights across your logs, BMI calculator, and charts update automatically.',
  },
  {
    question: '5. Is the app free, or do I need a membership?',
    answer:
      'Everything you need to check your BMI, log workouts, use the rest timer, and view all 26 exercise guides is 100% free. Affordable memberships ($2.99/mo, $19.99/yr, or $29.99 once) unlock extra weekly progression coaching.',
  },
  {
    question: '6. How do I log out or back up my workouts?',
    answer:
      'On the Profile screen you can tap Logout at the top anytime. Before switching devices, tap Save Backup File (JSON) to keep a copy of your workout history.',
  },
];

export const AppRatingAndHelp: React.FC<AppRatingAndHelpProps> = ({
  currentRating,
  deviceRatings,
  onSubmitRating,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(
    currentRating?.stars ?? 0,
  );
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>(
    currentRating?.feedback ?? '',
  );
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    setSelectedStars(currentRating?.stars ?? 0);
    setFeedbackText(currentRating?.feedback ?? '');
  }, [currentRating]);

  const totalRatingsCount = deviceRatings.length;
  const averageRating =
    totalRatingsCount > 0
      ? deviceRatings.reduce((sum, r) => sum + r.stars, 0) / totalRatingsCount
      : 0;
  const satisfactionPct =
    totalRatingsCount > 0 ? Math.round((averageRating / 5) * 100) : null;

  const activeStars = hoverStars || selectedStars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStars < 1 || selectedStars > 5) return;
    onSubmitRating(selectedStars, feedbackText.trim());
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* App Rating Card */}
      <section
        aria-label="Rate IronLog App"
        className="space-y-5 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6 lg:col-span-5"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
            <Star className="h-4 w-4" />
            <span>Your Feedback</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#182026]">
            Rate IronLog
          </h2>
          <p className="text-sm text-[#475569]">
            How helpful is IronLog for your workouts? Tap 1 to 5 stars below.
          </p>
        </div>

        {/* Real Rating Stats (shown from actual submitted ratings) */}
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#e5e2dc] bg-[#faf9f6] p-3.5 tabular-nums">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              Average Score
            </div>
            <div className="mt-0.5 font-mono-tabular text-2xl font-extrabold text-[#182026]">
              {totalRatingsCount > 0 ? `${averageRating.toFixed(1)} / 5` : '—'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              Satisfaction
            </div>
            <div className="mt-0.5 font-mono-tabular text-2xl font-extrabold text-[#0f766e]">
              {satisfactionPct !== null ? `${satisfactionPct}%` : 'No rating yet'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Tap Stars to Rate
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= activeStars;
                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    onMouseEnter={() => setHoverStars(star)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setSelectedStars(star)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                      filled
                        ? 'border-amber-300 bg-amber-50 text-amber-500'
                        : 'border-[#d6d1c7] bg-[#faf9f6] text-[#94a3b8] hover:border-amber-300'
                    }`}
                  >
                    <Star
                      className={`h-6 w-6 ${filled ? 'fill-amber-400' : ''}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#182026]">
              <MessageSquare className="h-4 w-4 text-[#0f766e]" />
              Short Comment (optional)
            </span>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you enjoy or what we can make even simpler..."
              className="w-full rounded-xl border border-[#d6d1c7] bg-[#faf9f6] p-3 text-sm text-[#182026] placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={selectedStars < 1}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0d625b] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {currentRating ? 'Update My Rating' : 'Submit Rating'}
          </button>

          {savedNotice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-900"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Thank you! Your {selectedStars}-star rating is saved.</span>
            </div>
          )}
        </form>
      </section>

      {/* Help Center Section */}
      <section
        id="help-center-section"
        aria-label="Help Center"
        className="space-y-4 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6 lg:col-span-7"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#182026]">
            Simple Answers &amp; Getting Started
          </h2>
          <p className="text-sm text-[#475569]">
            New to IronLog? Tap any question below for a plain, quick answer.
          </p>
        </div>

        <div className="divide-y divide-[#e5e2dc] overflow-hidden rounded-2xl border border-[#e5e2dc] bg-[#faf9f6]">
          {HELP_FAQS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={item.question} className="bg-white">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#faf9f6]"
                >
                  <span className="text-sm font-bold text-[#182026]">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#0f766e]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#64748b]" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-[#e5e2dc] bg-[#faf9f6] px-4 py-3 text-sm leading-relaxed text-[#475569]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
