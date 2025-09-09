export class Stepper {
  constructor(rootEl, {
    steps = [],
    currentStep = 1,
    onStepChange = () => {}
  }) {
    this.root = rootEl;
    this.steps = steps;
    this.currentStep = currentStep;
    this.onStepChange = onStepChange;
    this._mount();
  }

  _mount() {
    const stepsHtml = this.steps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === this.currentStep;
      const isCompleted = stepNumber < this.currentStep;
      
      return `
        <div class="bk-stepper__step ${isActive ? 'bk-stepper__step--active' : ''} ${isCompleted ? 'bk-stepper__step--completed' : ''}" data-step="${stepNumber}">
          <div class="bk-stepper__step-circle">
            <span class="bk-stepper__step-number">${stepNumber.toString().padStart(2, '0')}</span>
          </div>
          <div class="bk-stepper__step-label">${step.label || `Step ${stepNumber}`}</div>
        </div>
        ${index < this.steps.length - 1 ? '<div class="bk-stepper__line"></div>' : ''}
      `;
    }).join('');

    this.root.innerHTML = `
      <div class="bk-stepper">
        ${stepsHtml}
      </div>
    `;
  }

  setCurrentStep(step) {
    this.currentStep = step;
    this._mount();
    this.onStepChange(step);
  }

  next() {
    if (this.currentStep < this.steps.length) {
      this.setCurrentStep(this.currentStep + 1);
    }
  }

  previous() {
    if (this.currentStep > 1) {
      this.setCurrentStep(this.currentStep - 1);
    }
  }

  getCurrentStep() {
    return this.currentStep;
  }
}
