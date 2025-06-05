import React, { useState } from 'react';
import Step from '../Step/Step';
import Stepper from '../Stepper/Stepper';
import formSpec from '../../data/childcare_form.json';

export default function FormRenderer() {
  const { form } = formSpec;
  const steps = form.steps || [];
  const [currentStep, setCurrentStep] = useState(0);
  const stepperPosition = form.layout?.stepperPosition || 'right';
  const orientation = stepperPosition === 'top' ? 'horizontal' : 'vertical';

  const requiredDocs =
    steps[currentStep]?.sections?.flatMap((section) =>
      (section.fields || [])
        .filter((f) => f.type === 'file' && f.required)
        .map((f) => f.label)
    ) || [];

  const handleNext = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  return (
    <div className={stepperPosition === 'top' ? 'wizard-layout-column' : 'wizard-layout-row'}>
      {stepperPosition !== 'top' && (
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          requiredDocs={requiredDocs}
          orientation={orientation}
        />
      )}
      <div className="form-main">
        <h1>{form.title}</h1>
        <p>{form.description}</p>
        {stepperPosition === 'top' && (
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            requiredDocs={requiredDocs}
            orientation={orientation}
          />
        )}
        {steps.length > 0 && (
          <Step
            key={steps[currentStep].id}
            title={steps[currentStep].title}
            sections={steps[currentStep].sections}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        )}
      </div>
    </div>
  );
}
