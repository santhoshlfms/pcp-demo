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
import Grid from "@material-ui/core/Grid";

import UserForm from "./UserForm";
import CredentialForm from "./CredentialForm";
import TransferForm from "./TransferForm";
import PaymentForm from "./PaymentForm";

import { INITIALSTATE, getInitalState } from "../hooks/InitalState";

const useStyles = makeStyles({
  root: {
    marginTop: 0,
  },
  button: {
    marginTop: 30,
    marginRight: 10,
  },
  actionsContainer: {
    marginBottom: 10,
  },
  resetContainer: {
    padding: 20,
  },
  grid :{
    marginTop: 20
  }
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

  const { updateStatus, resetStatus } = props;

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
    setAppData(getInitalState());
    setActiveStep(0);
    resetStatus();
  }, [setActiveStep, resetStatus]);

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
    <Container maxWidth="sm" className={classes.root}>
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
        <>
          <Paper square elevation={3} className={classes.resetContainer}>
            <Typography variant="h5" color="primary" gutterBottom>
              Payment Successful. Details below
            </Typography>

            <Grid container spacing={3} className={classes.grid}>
              <Grid item xs={6}>
                <Typography variant="h6">Email </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{appData.email} </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6">Amount </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{appData.amount} </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6">Currency </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{appData.currency} </Typography>
              </Grid>
            </Grid>
          </Paper>
          <Button
            onClick={handleBack}
            className={classes.button}
            variant="contained"
            color="secondary"
          >
            Back
          </Button>
          <Button
            onClick={handleReset}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Restart Flow
          </Button>
        </>
      )}
    </Container>
  );
}

export default React.memo(StepperContainer);
