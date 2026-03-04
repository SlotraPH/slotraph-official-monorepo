import type { BookingStepId } from '../types';

interface ProgressStep {
  id: BookingStepId;
  label: string;
  description: string;
}

interface BookingProgressProps {
  steps: ProgressStep[];
  currentStep: BookingStepId;
  isStepComplete: (stepId: BookingStepId) => boolean;
  isStepAccessible: (stepId: BookingStepId) => boolean;
  onStepSelect: (stepId: BookingStepId) => void;
}

export function BookingProgress({
  steps,
  currentStep,
  isStepComplete,
  isStepAccessible,
  onStepSelect,
}: BookingProgressProps) {
  return (
    <ol className="booking-progress" aria-label="Booking steps">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isComplete = isStepComplete(step.id);
        const isAccessible = isStepAccessible(step.id);

        return (
          <li key={step.id}>
            <button
              type="button"
              className={[
                'booking-progress__step',
                isCurrent ? 'booking-progress__step--current' : '',
                isComplete ? 'booking-progress__step--complete' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onStepSelect(step.id)}
              disabled={!isAccessible}
            >
              <span className="booking-progress__index">{index + 1}</span>
              <span className="booking-progress__body">
                <strong>{step.label}</strong>
                <span>{step.description}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
