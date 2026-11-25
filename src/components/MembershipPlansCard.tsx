import React from 'react';
import { CheckCircle2, Lock, Sparkles, Unlock } from 'lucide-react';
import { MembershipPlanId } from '../types/fitness';

interface MembershipPlansCardProps {
  currentPlan: MembershipPlanId;
  onSelectPlan: (planId: MembershipPlanId) => void;
}

interface PlanOption {
  id: MembershipPlanId;
  name: string;
  price: string;
  period: string;
  tag?: string;
  description: string;
  unlockedItems: string[];
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '$0',
    period: 'Free forever',
    description: 'Everything needed to start training cleanly with zero cost.',
    unlockedItems: [
      'BMI Calculator & Starter Workout Plan',
      'Live Workout Logger & Rest Timer',
      '26 Male-Form Body Guide Cards & Red Anatomy',
      'Basic Progress & Personal Records',
    ],
  },
  {
    id: 'monthly-starter',
    name: 'Monthly Supporter',
    price: '$2.99',
    period: 'per month',
    description: 'Low monthly price to unlock extra coaching & split tools.',
    unlockedItems: [
      'Everything in Free Starter',
      'BMI Weekly Progression Tips',
      'Full Push / Pull / Legs Rotation Notes',
      'Priority Form Checklists & Backup Extras',
    ],
  },
  {
    id: 'yearly-value',
    name: 'Yearly Value',
    price: '$19.99',
    period: 'per year (~$1.66/mo)',
    tag: 'Best Value',
    description: 'Save 44% across the full year for consistent training.',
    unlockedItems: [
      'All Membership Split & Progression Tools',
      'Unlimited BMI Goal Re-plans Anytime',
      'Full Export & Restore Safety Tools',
      'Supports Independent App Updates',
    ],
  },
  {
    id: 'lifetime-pack',
    name: 'Student / Lifetime',
    price: '$29.99',
    period: 'one-time payment',
    description: 'Pay once and keep every membership feature unlocked.',
    unlockedItems: [
      'All Membership Features Unlocked Forever',
      'Zero Monthly Subscriptions',
      'Full Offline & Backup Portability',
      'Built Affordable for Everyday Lifters',
    ],
  },
];

export const MembershipPlansCard: React.FC<MembershipPlansCardProps> = ({
  currentPlan,
  onSelectPlan,
}) => {
  const isPaidMember = currentPlan !== 'free';

  return (
    <section
      id="membership-plans-section"
      aria-label="Free and Affordable Membership Plans"
      className="space-y-5 rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-3 border-b border-[#e5e2dc] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
            <Sparkles className="h-4 w-4" />
            <span>Fair &amp; Affordable Pricing</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-[#182026] sm:text-3xl">
            Free vs. Affordable Membership
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            Core workout tracking, BMI check, and the 26-exercise guide stay
            free. Upgrade only if you want extra progression guidance at a low,
            honest price.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 self-start rounded-xl border px-3.5 py-2 text-xs font-bold ${
            isPaidMember
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-[#d6d1c7] bg-[#f7f6f2] text-[#182026]'
          }`}
        >
          {isPaidMember ? (
            <Unlock className="h-3.5 w-3.5 text-emerald-700" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0f766e]" />
          )}
          <span>
            Active:{' '}
            {PLAN_OPTIONS.find((p) => p.id === currentPlan)?.name ||
              'Free Starter'}
          </span>
        </div>
      </div>

      {/* Clear Free vs Membership feature status row */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e5e2dc] bg-[#faf9f6] p-4 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3.5 py-2.5 border border-[#e5e2dc]">
          <span className="text-sm font-semibold text-[#182026]">
            Core Workout Logger, BMI &amp; 26 Guides
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap">
            <Unlock className="h-3.5 w-3.5" />
            Unlocked (Free)
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3.5 py-2.5 border border-[#e5e2dc]">
          <span className="text-sm font-semibold text-[#182026]">
            Weekly BMI Split Coaching &amp; Extras
          </span>
          {isPaidMember ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap">
              <Unlock className="h-3.5 w-3.5" />
              Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 whitespace-nowrap">
              <Lock className="h-3.5 w-3.5" />
              Locked on Free
            </span>
          )}
        </div>
      </div>

      {/* 4 Clean Affordable Plan Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLAN_OPTIONS.map((plan) => {
          const isSelected = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                isSelected
                  ? 'border-[#0f766e] bg-teal-50/40 shadow-sm'
                  : 'border-[#e5e2dc] bg-[#faf9f6]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#182026]">
                    {plan.name}
                  </h3>
                  {plan.tag && (
                    <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                      {plan.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono-tabular text-3xl font-extrabold text-[#182026]">
                    {plan.price}
                  </span>
                  <span className="text-xs font-medium text-[#64748b]">
                    {plan.period}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#475569]">
                  {plan.description}
                </p>

                <ul className="space-y-2 border-t border-[#e5e2dc] pt-3">
                  {plan.unlockedItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-[#182026]"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f766e]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan(plan.id)}
                className={`mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors ${
                  isSelected
                    ? 'bg-[#0f766e] text-white'
                    : 'border border-[#d6d1c7] bg-white text-[#182026] hover:border-[#0f766e] hover:text-[#0f766e]'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Active Plan
                  </>
                ) : plan.id === 'free' ? (
                  'Switch to Free'
                ) : (
                  `Choose ${plan.price}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#64748b]">
        Preview notice: Switching plans here lets you immediately test Free vs.
        Membership unlocked features right inside the app without charging a
        card.
      </p>
    </section>
  );
};
