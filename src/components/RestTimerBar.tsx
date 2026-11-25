import React from 'react';
import {
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatDuration } from '../utils/units';

interface RestTimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  soundEnabled: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  onAdjust: (deltaSeconds: number) => void;
  onSelectPreset: (seconds: number) => void;
  onToggleSound: () => void;
}

const PRESETS = [60, 90, 120, 180];

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  remainingSeconds,
  totalSeconds,
  isRunning,
  soundEnabled,
  onToggleRun,
  onReset,
  onAdjust,
  onSelectPreset,
  onToggleSound,
}) => {
  const progressPct =
    totalSeconds > 0
      ? Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-[#e5e2dc] bg-[#ffffff] p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]">
            <Timer className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#475569]">
              Rest Break Timer
            </div>
            <div className="font-mono-tabular text-3xl font-bold tracking-tight text-[#182026]">
              {formatDuration(remainingSeconds)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAdjust(-15)}
            className="flex min-h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-3 text-xs font-bold text-[#182026] transition-colors hover:border-[#0f766e]/60"
            aria-label="Subtract 15 seconds"
          >
            <Minus className="mr-0.5 h-3.5 w-3.5" />
            15s
          </button>

          <button
            type="button"
            onClick={onToggleRun}
            className={`flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
              isRunning
                ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                : 'bg-[#0f766e] text-white hover:bg-[#0d625b]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Start Rest
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onAdjust(15)}
            className="flex min-h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] px-3 text-xs font-bold text-[#182026] transition-colors hover:border-[#0f766e]/60"
            aria-label="Add 15 seconds"
          >
            <Plus className="mr-0.5 h-3.5 w-3.5" />
            15s
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex min-h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] text-[#475569] transition-colors hover:text-[#182026]"
            aria-label="Reset rest timer"
            title="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="flex min-h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-[#d6d1c7] bg-[#f7f6f2] text-[#475569] transition-colors hover:text-[#182026]"
            aria-label={soundEnabled ? 'Mute timer sound' : 'Enable timer sound'}
            title={soundEnabled ? 'Sound on' : 'Sound off'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-[#0f766e]" />
            ) : (
              <VolumeX className="h-4 w-4 text-[#94a3b8]" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Track & Quick Presets */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e9e6de]">
          <div
            className="h-full rounded-full bg-[#0f766e] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          {PRESETS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSelectPreset(sec)}
              className={`min-h-[38px] rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                totalSeconds === sec
                  ? 'border border-[#0f766e]/40 bg-[#0f766e]/10 text-[#0f766e]'
                  : 'bg-[#f3f1ec] text-[#475569] hover:text-[#182026]'
              }`}
            >
              {sec === 90 ? '1.5m' : `${sec / 60}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
