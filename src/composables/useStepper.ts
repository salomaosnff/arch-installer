export interface StepProvider {
  nextLink: Ref<string>;
}

export function useInstallerStepper() {
  const stepper = inject<StepProvider>('stepper');

  if (!stepper) {
    throw new Error('useStepper must be used within a StepProvider');
  }

  return stepper;
}