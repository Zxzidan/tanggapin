/**
 * AnimatedStepper Component
 * A reusable multi-step indicator and content container with smooth Framer Motion transitions.
 * 
 * Features:
 * - Slide transitions between steps with custom spring easing
 * - Dynamic height adjustment container
 * - Progress indicators with completion states
 * - Fully customizable step content via <Step> sub-component
 * - Responsive design following minimalist principles
 */

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export function AnimatedStepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Kembali',
  nextButtonText = 'Lanjutkan',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className={cn(
        'flex min-h-[420px] w-full flex-col items-center justify-center p-2 sm:p-6',
        rest.className
      )}
      {...rest}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]',
          stepCircleContainerClassName
        )}
      >
        {/* Step Indicators Header */}
        <div className={cn('flex w-full items-center px-6 sm:px-10 pt-8 pb-4', stepContainerClassName)}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content Area with Dynamic Height */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={cn('space-y-4 px-6 sm:px-10', contentClassName)}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer Actions */}
        {!isCompleted && (
          <div className={cn('px-6 sm:px-10 pb-8 pt-4 border-t border-slate-100 dark:border-slate-800/50', footerClassName)}>
            <div className={cn('flex items-center', currentStep !== 1 ? 'justify-between' : 'justify-end')}>
              {currentStep !== 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={cn(
                    'text-sm font-semibold transition-colors duration-200 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                    currentStep === 1 ? 'pointer-events-none opacity-0' : 'opacity-100'
                  )}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                type="button"
                onClick={isLastStep ? handleComplete : handleNext}
                className="inline-flex h-11 items-center justify-center rounded-full bg-blue-700 dark:bg-blue-600 px-8 text-sm font-bold tracking-tight text-white transition-all duration-300 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                {...nextButtonProps}
              >
                {isLastStep ? 'Selesai & Coba Sistem' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Step Content Wrapper with dynamic height and slide animation
 */
function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = '',
}: {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight || 'auto' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 25 : -25,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -25 : 25,
    opacity: 0,
  }),
};

/**
 * Step Sub-component for individual step content
 */
export function Step({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="py-4">
      {title && (
        <h2 className="mb-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      )}
      <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        {children}
      </div>
    </div>
  );
}

/**
 * Step Indicator Circle
 */
function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  return (
    <motion.div
      onClick={() => !disableStepIndicators && onClickStep(step)}
      className={cn(
        'relative flex items-center justify-center select-none',
        !disableStepIndicators && 'cursor-pointer'
      )}
      animate={status}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: 'rgba(241, 245, 249, 1)',
            color: 'rgba(100, 116, 139, 1)',
            borderColor: 'rgba(226, 232, 240, 1)',
          },
          active: {
            scale: 1.08,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(29, 78, 216, 1)',
            borderColor: 'rgba(29, 78, 216, 1)',
          },
          complete: {
            scale: 1,
            backgroundColor: 'rgba(29, 78, 216, 1)',
            color: 'rgba(255, 255, 255, 1)',
            borderColor: 'rgba(29, 78, 216, 1)',
          },
        }}
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 font-bold text-sm transition-colors duration-300 shadow-xs"
      >
        {status === 'complete' ? (
          <Check className="h-5 w-5 stroke-[2.5]" />
        ) : (
          <span>{step}</span>
        )}
      </motion.div>

      {status === 'active' && (
        <motion.div
          layoutId="active-glow"
          className="absolute -inset-1.5 rounded-full bg-blue-600/25 blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

/**
 * Connector line between indicators
 */
function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-3 sm:mx-4 h-[3px] flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <motion.div
        className="absolute inset-0 bg-blue-600 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isComplete ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  );
}

export default AnimatedStepper;
