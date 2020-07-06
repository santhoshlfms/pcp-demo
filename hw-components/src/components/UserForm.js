import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { ValidatorForm } from "react-material-ui-form-validator";

import { useFormFields } from "../hooks/useFormFields";

import RenderForm from "./RenderForm";
import Loader from "./Loader";

import { COUNTRY } from "./Constants";

import { host } from "./Config";

const useStyles = makeStyles({
  button: {
    marginTop: 10,
    marginRight: 10,
  },
  actionsContainer: {
    width: 800,
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

function UserForm(props) {
  const [loaderObj, setLoaderObj] = useState({
    open: false,
    message: "Creating Users...",
  });

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

  const profileTypeRef = useRef();
  const clientUserIdRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const dateOfBirthRef = useRef();
  const addressLine1Ref = useRef();
  const cityRef = useRef();
  const postalCodeRef = useRef();
  const stateRef = useRef();
  const countryRef = useRef();

  const initalState = {
    profileType: "",
    clientUserId: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    stateProvince: "",
    country: "",
  };

  const formElem = [
    {
      type: "text",
      label: "Profile Type",
      ref: { profileTypeRef },
      name: "profileType",
      id: "profileType",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Profile Type is required", "Profile Type is required"],
      helperText: "Enter Profile Type",
    },

    {
      type: "text",
      label: "Client User ID",
      ref: { clientUserIdRef },
      name: "clientUserId",
      id: "clientUserId",
      validators: ["required", "isNotEmpty"],
      errorMessages: [
        "Client User ID is required",
        "Client User ID is required",
      ],
      helperText: "Enter Client User ID",
    },

    {
      type: "text",
      label: "First Name",
      ref: { firstNameRef },
      name: "firstName",
      id: "firstName",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["First Name is required", "First Name is required"],
      helperText: "Enter First Name",
    },

    {
      type: "text",
      label: "Last Name",
      ref: { lastNameRef },
      name: "lastName",
      id: "lastName",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Last Name is required", "Last Name is required"],
      helperText: "Enter Last Name",
    },

    {
      type: "text",
      label: "Email",
      ref: { emailRef },
      name: "email",
      id: "email",
      validators: ["required", "isNotEmpty", "isEmail"],
      errorMessages: [
        "Email is required",
        "Email is required",
        "Enter Valid Email",
      ],
      helperText: "Enter Email",
    },

    {
      type: "date",
      label: "Date of Birth",
      ref: { dateOfBirthRef },
      name: "dateOfBirth",
      id: "dateOfBirth",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Date of Birth is required", "Date of Birth is required"],
      helperText: "Enter Date of Birth",
    },

    {
      type: "text",
      label: "Address Line 1",
      ref: { addressLine1Ref },
      name: "addressLine1",
      id: "addressLine1",
      validators: ["required", "isNotEmpty"],
      errorMessages: [
        "Address Line 1 is required",
        "Address Line 1 is required",
      ],
      helperText: "Enter Address Line 1",
    },

    {
      type: "select",
      label: "Country",
      ref: { countryRef },
      entries: COUNTRY,
      name: "country",
      id: "country",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Country is required", "Country is required"],
      helperText: "Select Country",
    },

    {
      type: "text",
      label: "State",
      ref: { stateRef },
      name: "stateProvince",
      id: "stateProvince",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["State is required", "State is required"],
      helperText: "Enter State",
    },

    {
      type: "text",
      label: "City",
      ref: { cityRef },
      name: "city",
      id: "city",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["City is required", "City is required"],
      helperText: "Enter City",
    },

    {
      type: "text",
      label: "Postal Code",
      ref: { postalCodeRef },
      name: "postalCode",
      id: "postalCode",
      validators: ["required", "isNotEmpty"],
      errorMessages: ["Postal Code is required", "Postal Code is required"],
      helperText: "Enter Postal Code",
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

    return () => {
      ValidatorForm.removeValidationRule("isNotEmpty");
    };
  }, []);

  const handleBlur = (ref) => (event) => {
    ref.current.validate(event.target.value);
    handleFieldChange(event);
  };

  const handleSubmit = () => {
    setLoaderObj({ open: true, message: "Creating User..." });

    updateStatus([{ message: "Creating User", type: "info" }]);

    updateStatus([{ message: "Calling Create User API....", type: "info" }]);

    let request = `curl --location --request POST 'https://api.sandbox.hyperwallet.com/rest/v3/users' 
--header 'Authorization: Basic <username>:<password>' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--data-raw '{
      "profileType": "${fields.profileType}",
      "clientUserId": "${fields.clientUserId}",
      "firstName": "${fields.firstName}",
      "lastName": "${fields.lastName}",
      "email": "${fields.email}",
      "dateOfBirth": "${fields.dateOfBirth}",
      "addressLine1": "${fields.addressLine1}",
      "city": "${fields.city}",
      "country": "${fields.country}",
      "stateProvince": "${fields.stateProvince}",
      "postalCode": "${fields.postalCode}",
      "programToken": "${fields.programToken}"
  }'
    `;

    updateStatus([
      { message: "Create User API Request....", type: "request", req: request },
    ]);

    let userToken = "";
    fetch(host + "/hw-create-user", {
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
          console.log("error in creating user");
          console.log(data.error);

          alert("Error Occurred. Check Playground Status");

          updateStatus([
            {
              message: "Create User API Error...",
              type: "request",
              req: JSON.stringify(data.error, null, 2),
              status: "error",
            },
          ]);

          setLoaderObj({ open: false, message: "" });

          return;
        }
        console.log("Created user");
        console.log(data.data);
        updateStatus([
          {
            message: "User created Successfully...",
            type: "request",
            req: JSON.stringify(data.data, null, 2),
          },
        ]);

        if (data.data.token) {
          userToken = data.data.token;
        }
        setTimeout(() => {
          setLoaderObj({ open: false, message: "" });
          handleNext();
          return;
        }, 1000);
      })
      .catch((err) => {
        console.log("error in creating user");
        console.log(err);
        alert("Error Occurred. Check Playground Status");
        updateStatus([
          {
            message: "Create User API Error...",
            type: "request",
            req: JSON.stringify(err, null, 2),
            status: "error",
          },
        ]);
        setLoaderObj({ open: false, message: "" });
      })
      .finally(() => {
        updateAppData({ ...fields, userToken: userToken });
      });
  };

  return (
    <>
      <Loader obj={loaderObj}> </Loader>
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
            {activeStep === steps.length - 1 ? "Finish" : "Create"}
          </Button>
        </div>
      </ValidatorForm>
    </>
  );
}

export default React.memo(UserForm);
