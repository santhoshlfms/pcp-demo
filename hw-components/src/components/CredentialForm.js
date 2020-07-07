import React, { useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { ValidatorForm } from "react-material-ui-form-validator";

import { useFormFields } from "../hooks/useFormFields";

import RenderForm from "./RenderForm";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  button: {
    marginTop: 10,
    marginRight: 10,
  },
  actionsContainer: {
    marginBottom: 10,
    marginTop: 20,
  },
  resetContainer: {
    padding: 20,
  },
});

function CredentialForm(props) {
  const {
    handleNext,
    activeStep,
    steps,
    handleBack,
    appData,
    updateAppData,
    updateStatus,
  } = props;

  const classes = useStyles();

  const usernameRef = useRef();
  const passwordRef = useRef();
  
  const programTokenRef = useRef();

  const initalState = {
    username: "",
    password: "",
    programToken: "",
  };

  const formElem = [
    {
      type: "text",
      label: "API Username",
      ref: { usernameRef },
      name: "username",
      id: "username",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["API Username is required", "API Username is required"],
      helperText: "Enter API Username",
    },

    {
      type: "password",
      label: "API Password",
      ref: { passwordRef },
      name: "password",
      id: "password",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["API Password is required", "API Password is required"],
      helperText: "Enter API Password",
    },
    {
      type: "text",
      label: "Program Token",
      ref: { programTokenRef },
      name: "programToken",
      id: "programToken",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Program Token is required", "Program Token is required"],
      helperText: "Enter Program Token",
    }

  ];

  const [fields, setFields] = useFormFields({ ...initalState, ...appData });

  const handleFieldChange = (event) => {
    setFields(event.target.id, event.target.value);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isNotEmpty", (value) => {
      if (value === "") {
        return false;
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule("isNotEmpty");
    };
  }, []);

  const handleBlur = (ref) => (event) => {
    ref.current.validate(event.target.value);
    handleFieldChange(event);
  };

  const handleHere = () => {
    updateAppData(fields);
    updateStatus([
      { message: "Credentials Loaded", type: "info" },
    ]);
    handleNext();
  };

  return (
    <ValidatorForm
      onSubmit={() => {
        handleHere();
      }}
      onError={(errors) => console.log(errors)}
    >
      <RenderForm
        formElem={formElem}
        handleBlur={handleBlur}
        handleFieldChange={handleFieldChange}
        fields={fields}
      />

      <div className={classes.actionsContainer}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={classes.button}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>

      </div>
    </ValidatorForm>
  );
}

export default React.memo(CredentialForm);
