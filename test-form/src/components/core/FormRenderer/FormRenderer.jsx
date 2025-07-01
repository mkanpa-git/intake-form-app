import React, { useState, useEffect } from 'react';
import Step from '../Step/Step';
import Stepper from '../Stepper/Stepper';
import ReviewStep from '../ReviewStep/ReviewStep';
// import formSpec from '../../../data/childcare_form.json'; // Removed direct import
import { validateStep } from '../../../utils/formHelpers';
import { getApplication, upsertApplication } from '../../../utils/appStorage';

export default function FormRenderer({ applicationId, onExit }) {
  const [formSpec, setFormSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [allData, setAllData] = useState({});
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [currentStepValidation, setCurrentStepValidation] = useState({ errors: {}, touched: {}, timestamp: null });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading

  // Derived state, initialized after formSpec is loaded
  const [form, setForm] = useState(null);
  const [steps, setSteps] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(-1);
  const [stepperPosition, setStepperPosition] = useState('right');
  const [orientation, setOrientation] = useState('vertical');


  useEffect(() => {
    const fetchFormSpec = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First attempt: fetch from public root
        let response = await fetch('/childcare_form.json');
        if (!response.ok) {
          // Fallback: fetch from /data/ (assuming dev server might serve it from src/data)
          response = await fetch('/data/childcare_form.json');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} while trying to fetch form specification.`);
        }
        const data = await response.json();
        setFormSpec(data);
      } catch (e) {
        console.error("Failed to load form specification:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormSpec();
  }, []);

  useEffect(() => {
    if (formSpec) {
      const loadedForm = formSpec.form;
      const loadedSteps = loadedForm?.steps || [];
      setForm(loadedForm);
      setSteps(loadedSteps);
      setReviewIndex(loadedSteps.findIndex((s) => s.type === 'review'));
      setStepperPosition(loadedForm?.layout?.stepperPosition || 'right');
      setOrientation( (loadedForm?.layout?.stepperPosition || 'right') === 'top' ? 'horizontal' : 'vertical');

      if (applicationId) {
        getApplication(applicationId).then((saved) => {
          if (saved) {
            setCurrentStep(saved.current_step || 0);
            setStepData(saved.step_data || {});
            setAllData(saved.all_data || {});
          }
        });
      }
    }
  }, [formSpec, applicationId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentStep]);

  useEffect(() => {
    if (reviewIndex !== -1 && currentStep === reviewIndex) {
      setEditingFromReview(false);
    }
  }, [currentStep, reviewIndex]);

  const requiredDocs =
    steps[currentStep]?.sections?.flatMap((section) =>
      (section.fields || [])
        .filter((f) => f.type === 'file' && f.required)
        .map((f) => f.label)
    ) || [];

  const handleDataChange = (data) => {
    if (steps.length > 0 && steps[currentStep]) {
      const stepId = steps[currentStep].id;
      setStepData((prev) => ({ ...prev, [stepId]: data }));
    }
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

  const handleSaveDraft = async (data) => {
    handleDataChange(data);
    if (steps.length > 0 && steps[currentStep]) {
      await upsertApplication(applicationId, {
        stepData: { ...stepData, [steps[currentStep].id]: data },
        allData: { ...allData, ...data },
        currentStep,
        status: 'draft',
      });
    }
    onExit && onExit();
  };

  const handleEdit = (idx) => {
    setCurrentStep(idx);
    setEditingFromReview(true);
  };

  const handleBackToReview = (data) => {
    handleDataChange(data);
    setAllData((prev) => ({ ...prev, ...data }));
    if (reviewIndex !== -1) {
      setCurrentStep(reviewIndex);
    }
    setEditingFromReview(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await upsertApplication(applicationId, {
        stepData,
        allData,
        currentStep,
        status: 'submitted',
      });
      onExit && onExit();
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canNavigate = (targetIndex, silent = false) => {
    if (steps.length === 0 || !steps[currentStep]) return false;
    // allow going to a previous step without checking validation
    if (targetIndex < currentStep) return true;
    if (steps[currentStep]?.type === 'review') return true;

    const result = validateStep(
      steps[currentStep],
      stepData[steps[currentStep].id] || {}
    );

    if (!silent && !result.valid && targetIndex > currentStep) {
      // If trying to move forward and validation fails, set errors and touched state to trigger display in Step component
      setCurrentStepValidation({ errors: result.errors, touched: result.touched, timestamp: Date.now() });
    }
    return result.valid;
  };

  if (isLoading) {
    return <div>Loading form definition...</div>;
  }

  if (error) {
    return <div>Error loading form: {error}. Please ensure childcare_form.json is available in the public folder or served at /data/childcare_form.json.</div>;
  }

  if (!formSpec || !form || steps.length === 0) {
    return <div>Form definition loaded, but content is missing or invalid.</div>;
  }

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
        {steps.length > 0 && steps[currentStep] && (
          steps[currentStep].type === 'review' ? (
            <ReviewStep
              steps={steps}
              stepData={stepData}
              onEdit={handleEdit}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting} // Pass isSubmitting prop
            />
          ) : (
            <Step
              key={steps[currentStep].id}
              title={steps[currentStep].title}
              sections={steps[currentStep].sections}
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
              formData={stepData[steps[currentStep].id] || {}}
              fullData={allData}
              onDataChange={handleDataChange}
              applicationId={applicationId}
              onBackToReview={
                editingFromReview ? handleBackToReview : undefined
              }
              validationAttempt={currentStepValidation} // Pass validation attempt state
            />
          )
        )}
      </div>
    </div>
  );
}
