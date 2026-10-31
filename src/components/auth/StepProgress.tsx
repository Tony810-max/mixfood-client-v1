import { useUiText } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface StepProgressProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export const StepProgress = ({ currentStep, steps, className }: StepProgressProps) => {
  const n = steps.length;
  // Half a column's width, as a percentage of the row — this is exactly
  // the horizontal offset from the row edge to the first/last circle's
  // center. Using a fixed rem inset here (the previous attempt) only
  // works if every column is exactly as wide as the circle; in practice
  // each column's width is set by its (wider) label text, so the circle
  // ends up centered somewhere past that fixed offset — which is exactly
  // why a stray bit of line kept poking out to the left of the first step.
  // A CSS grid with equal-width columns removes that assumption entirely:
  // column i is always centered at (i + 0.5) / n of the row, full stop.
  const halfColumn = `${50 / n}%`;

  const ui = useUiText();
  return (
    <div className={cn("w-full mb-8", className)}>
      <div
        className="relative grid items-start"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {/* Progress line track — spans center-to-center between the first
            and last column, so it starts/ends exactly under those circles
            regardless of how wide each step's label text is. */}
        <div
          className="absolute top-6 h-0.5 -translate-y-1/2"
          style={{ left: halfColumn, right: halfColumn }}
        >
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary-gradient rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (n - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          const isPending = index + 1 > currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted && "bg-primary-gradient border-primary text-primary-foreground shadow-lg",
                  isCurrent && "bg-white dark:bg-slate-800 border-primary text-primary shadow-md scale-110",
                  isPending && "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={cn(
                  "mt-2 text-xs font-medium whitespace-nowrap",
                  isCurrent && "text-primary",
                  isCompleted && "text-primary",
                  isPending && "text-gray-400"
                )}
              >
                {ui(step.label)}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
