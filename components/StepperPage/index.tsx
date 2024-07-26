import React, { useEffect, useState } from 'react'
import { Stepper } from '../Stepper'

const StepperPage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Marital Status',
      component: <div>HI THERE 1</div>,
    },
    {
      step: 2,
      title: 'Age',
      component: <div>HI THERE 2</div>,
    },
    {
      step: 3,
      title: 'Income',
      component: <div>HI THERE 3</div>,
    },
    {
      step: 4,
      title: 'Residency',
      component: <div>HI THERE 4</div>,
    },
  ]
  const [activeStep, setActiveStep] = useState(1)
  const [isLastStep, setIsLastStep] = useState(false)

  useEffect(() => {
    if (activeStep === steps.length) {
      setIsLastStep(true)
    } else {
      setIsLastStep(false)
    }
  }, [activeStep])

  console.log('isLastStep', isLastStep)
  return (
    <div className="my-14 ml-1">
      <Stepper
        id="stepper123"
        name="Old Age Security Benefits Estimator"
        step={`Step ${activeStep} of ${steps.length}`}
        heading={steps[activeStep - 1].title}
        previousProps={{
          id: 'previous',
          text: 'Previous',
          onClick: () => setActiveStep(Math.max(activeStep - 1, 1)),
        }}
        nextProps={{
          id: 'next',
          text: isLastStep ? 'Estimate my benefits' : 'Next',
          onClick: () =>
            isLastStep
              ? console.log('Estimate my benefits')
              : setActiveStep(activeStep + 1),
        }}
      >
        {steps[activeStep - 1].component}
      </Stepper>
    </div>
  )
}

// or have StepperForm component that takes props for active step and content for each step? Or generate content inside the stepper based on what step we're on?

// const steps = useMemo(() => {
//   factory: () => [
//     {
//       label: 'Step 1',
//       value: 1,
//       component: <StepOne />,
//     },
//     {
//       label: 'Step 2',
//       value: 2,
//       component: <StepTwo />,
//     },
//     {
//       label: 'Step 3',
//       value: 3,
//       component: <StepThree />,
//     },
//   ]
// }, [])

export default StepperPage

// Make a mock page where we have a bare bones stepper with hardcoded content that you can step through and see the content change
