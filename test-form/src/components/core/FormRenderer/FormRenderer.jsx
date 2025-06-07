import React, { useState, useEffect } from 'react';
import Step from '../Step/Step';
import Stepper from '../Stepper/Stepper';
import formSpec from '../../data/childcare_form.json';
import { validateStep } from '../../utils/formHelpers';

export default function FormRenderer() {
  const { form } = formSpec;
  const steps = form.steps || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [allData, setAllData] = useState({});
  const stepperPosition = form.layout?.stepperPosition || 'right';
  const orientation = stepperPosition === 'top' ? 'horizontal' : 'vertical';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentStep]);

  const requiredDocs =
    steps[currentStep]?.sections?.flatMap((section) =>
      (section.fields || [])
        .filter((f) => f.type === 'file' && f.required)
        .map((f) => f.label)
    ) || [];

  const handleDataChange = (data) => {
    const stepId = steps[currentStep].id;
    setStepData((prev) => ({ ...prev, [stepId]: data }));
    setAllData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = (data) => {
    handleDataChange(data);
    setAllData((prev) => ({ ...prev, ...data }));
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBack = (data) => {
    handleDataChange(data);
    setAllData((prev) => ({ ...prev, ...data }));
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const canNavigate = (targetIndex) => {
    // allow going to a previous step without checking validation
    if (targetIndex < currentStep) return true;
    const { valid } = validateStep(
      steps[currentStep],
      stepData[steps[currentStep].id] || {}
    );
    return valid;
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
          canNavigate={canNavigate}
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
            canNavigate={canNavigate}
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
            formData={stepData[steps[currentStep].id] || {}}
            fullData={allData}
            onDataChange={handleDataChange}
          />
        )}
      </div>
    </div>
  );
}
