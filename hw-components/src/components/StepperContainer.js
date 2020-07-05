import React, { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import UserForm from "./UserForm";
import CredentialForm from "./CredentialForm";
import TransferForm from "./TransferForm";
import PaymentForm from "./PaymentForm";

import { INITIALSTATE } from "../hooks/InitalState";

const useStyles = makeStyles({
  root: {
    marginTop: 0,
  },
  button: {
    marginTop: 10,
    marginRight: 10,
  },
  actionsContainer: {
    width: 800,
    marginBottom: 10,
  },
  resetContainer: {
    padding: 20,
  },
});

function getSteps() {
  return [
    {
      title: "Credentials Section",
      component: CredentialForm,
    },
    {
      title: "Create User",
      component: UserForm,
    },
    {
      title: "Create Transfer",
      component: TransferForm,
    },

    {
      title: "Make Payment",
      component: PaymentForm,
    },
  ];
}

function StepperContainer(props) {
  const [appData, setAppData] = useState(INITIALSTATE);

  const { updateStatus } = props;

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  console.log("Rendering stepper ");

  const updateAppData = useCallback(
    (obj) => {
      setAppData((prevAppData) => ({
        ...prevAppData,
        ...obj,
      }));
    },
    [setAppData]
  );

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  const ActiveStepContent = function (props) {
    let ComponentA = props.obj.component;
    return (
      <>
        <StepContent {...props}>
          <div>
            <ComponentA
              appData={appData}
              activeStep={activeStep}
              handleNext={handleNext}
              steps={steps}
              updateAppData={updateAppData}
              handleBack={handleBack}
              updateStatus={updateStatus}
            />
            {props.children}
          </div>
        </StepContent>
      </>
    );
  };

  return (
    <Container fixed className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((stepObj, index) => {
          return (
            <Step key={stepObj.title}>
              <StepLabel>
                <h3>{stepObj.title}</h3>
              </StepLabel>
              <ActiveStepContent obj={stepObj}></ActiveStepContent>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default React.memo(StepperContainer);
