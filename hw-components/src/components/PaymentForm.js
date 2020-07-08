import React, { useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { ValidatorForm } from "react-material-ui-form-validator";

import { useFormFields } from "../hooks/useFormFields";

import RenderForm from "./RenderForm";

import { CURRENCY, PURPOSE } from "./Constants";

import { host } from "./Config";

import $ from "jquery";
import "gasparesganga-jquery-loading-overlay";

const useStyles = makeStyles({
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
  helperText: {
    marginBottom: 5,
  },
});

function PaymentForm(props) {
  const {
    handleNext,
    activeStep,
    steps,
    handleBack,
    appData,
    updateStatus,
  } = props;

  const classes = useStyles();

  const programTokenRef = useRef();
  const destinationTokenRef = useRef();
  const clientPaymentIdRef = useRef();
  const currencyRef = useRef();
  const amountRef = useRef();
  const purposeRef = useRef();

  const initalState = {
    programToken: "",
    destinationToken: "",
    clientPaymentId: "",
    currency: "",
    amount: "",
    purpose: "",
  };

  const formElem = [
    {
      type: "text",
      label: "Program Token",
      ref: { programTokenRef },
      disabled: true,
      name: "programToken",
      id: "programToken",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Program Token is required", "Program Token is required"],
      helperText: "Enter Program Token",
    },

    {
      type: "text",
      label: "Destination Token",
      ref: { destinationTokenRef },
      disabled: true,
      name: "destinationToken",
      id: "destinationToken",
      validators: ["required", "isNotEmpty"],
      errorMessages: [
        "Destination Token is required",
        "Destination Token is required",
      ],
      helperText: "Enter Destination Token",
    },

    {
      type: "text",
      label: "Client Payment ID",
      ref: { clientPaymentIdRef },
      disabled: false,
      name: "clientPaymentId",
      id: "clientPaymentId",
      validators: ["required", "isNotEmpty"],
      errorMessages: [
        "Client Payment ID is required",
        "Client Payment ID is required",
      ],
      helperText: "Enter Client Payment ID",
    },

    {
      type: "text",
      label: "Amount",
      ref: { amountRef },
      name: "amount",
      id: "amount",
      validators: ["required", "isNotEmpty", "isNumber", "isLessThan"],
      errorMessages: [
        "Amount is required",
        "Amount is required",
        "Amount must be a Number",
        "Amount exceeded approved limit",
      ],
      helperText: "Enter Amount",
    },

    {
      type: "select",
      label: "Currency",
      ref: { currencyRef },
      disabled: true,
      entries: CURRENCY,
      name: "currency",
      id: "currency",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Currency is required", "Currency is required"],
      helperText: "Select Currency",
    },

    {
      type: "select",
      label: "Purpose",
      ref: { purposeRef },
      entries: PURPOSE,
      name: "purpose",
      id: "purpose",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Purpose is required", "Purpose is required"],
      helperText: "Select Purpose",
    },
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

    ValidatorForm.addValidationRule("isLessThan", (value) => {
      console.log(value);
      let val = parseInt(value);
      if (val > 100) {
        return false;
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule("isNotEmpty");
      ValidatorForm.removeValidationRule("isLessThan");
    };
  }, []);

  const handleBlur = (ref) => (event) => {
    ref.current.validate(event.target.value);
    handleFieldChange(event);
  };

  const handleSubmit = () => {
    $.LoadingOverlay("show", {
      image: "",
      text: "Making Payment...",
      textClass: "loadingText"                                
    });

    updateStatus([{ message: "Calling Make Payment API....", type: "info" }]);

    let request = `curl --location --request POST 'https://api.sandbox.hyperwallet.com/rest/v3/payments' 
--header 'Authorization: Basic <username>:<password>' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--data-raw '{
      "programToken": "${fields.parentToken}",
      "destinationToken": "${fields.destinationToken}",
      "clientPaymentId": "${fields.clientPaymentId}",
      "amount": "${fields.amount}",
      "currency": "${fields.currency}",
      "purpose": "${fields.purpose}"
  }'
    `;

    updateStatus([
      { message: "Make Payment Request....", type: "request", req: request },
    ]);

    fetch(host + "/hw-make-payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...appData,
        ...fields,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log("error in making payment");
          console.log(data.error);
          alert("Error Occurred. Check Playground Status");
          updateStatus([
            {
              message: "Make Payment API Error...",
              type: "request",
              req: JSON.stringify(data.error, null, 2),
              status: "error",
            },
          ]);
          return;
        }
        console.log("Payment Successful");
        alert("Payment Successful");
        console.log(data.data);
        updateStatus([
          {
            message: "Payment successfull...",
            type: "request",
            req: JSON.stringify(data.data, null, 2),
          },
        ]);

        setTimeout(() => {
          $.LoadingOverlay("hide");
          handleNext();
          return;
        }, 2000);
      })
      .catch((err) => {
        console.log("error in making payment");
        console.log(err);
        alert("Error Occurred. Check Playground Status");

        updateStatus([
          {
            message: "Make Payment API Error...",
            type: "request",
            req: JSON.stringify(err, null, 2),
            status: "error",
          },
        ]);
        $.LoadingOverlay("hide");
      })
      .finally(() => {
        $.LoadingOverlay("hide");
      });
  };

  return (
    <>
      <ValidatorForm
        onSubmit={() => {
          handleSubmit();
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
            {activeStep === steps.length - 1 ? "Make Payment" : null}
          </Button>
        </div>
      </ValidatorForm>
    </>
  );
}

export default React.memo(PaymentForm);
