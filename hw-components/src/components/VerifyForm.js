import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import HWPayeeVerificationDropin from "./HWPayeeVerificationDropin";

import { useAuthToken } from "../hooks/useAuthToken";


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

function TransferForm(props) {
  const {
    handleNext,
    activeStep,
    handleBack,
    appData,
    updateAppData,
    updateStatus,
  } = props;

  let getAuthToken = useAuthToken(updateStatus,appData)[0];

  let onComplete = useCallback(
    (trmObject, completionResult) => {
      //logic to be executed on completion of setting up transfer method.
      console.log("Transfer method created");
      console.log(trmObject, completionResult);
      updateStatus([
        { message: "Transfer method has been created", type: "info" },
      ]);
      updateAppData({
        destinationToken: trmObject.token,
        //destinationToken: trmObject.userToken,
        currency: trmObject.transferMethodCurrency,
      });

      updateStatus([
        {
          message: "Transfer Method API Response...",
          type: "request",
          req: JSON.stringify(trmObject, null, 2),
        },
      ]);
      setTimeout(() => {
        updateStatus([
          {
            message: "You can make a payment to this user now...",
            type: "info",
          },
        ]);
        handleNext();
      }, 1000);
    },
    [handleNext, updateAppData, updateStatus]
  );

  let onError = useCallback(() => {
    console.log("error ");
    updateStatus([
      { message: "Error occurred in loading Drop-in UI", type: "info" },
    ]);
  }, [updateStatus]);

  const classes = useStyles();

  var appInfo = {
      profileType: appData.profileType,
      firstName: appData.firstName,
      middleName: appData.middleName,
      lastName: appData.lastName,
      addressLine1: appData.addressLine1,
      addressLine2: appData.addressLine2,
      country: appData.country,
      stateProvince: appData.stateProvince,
      city: appData.city,
      postalCode: appData.postalCode,
      email: appData.email,
      userToken: appData.userToken

  };
  return (
    <>
      <HWPayeeVerificationDropin
        environment="sandbox"
        getAuthenticationToken={getAuthToken} //token should be renewed every 10 mins
        onComplete={onComplete}
        onError={onError}
        appData={appInfo}
        template="plain" //Specifies the UI template. Allowed values are:[bootstrap3|plain]
      />

      <div className={classes.actionsContainer}>
        <Button
          variant="contained"
          color="secondary"
          disabled={activeStep === 0}
          onClick={handleBack}
          className={classes.button}
        >
          Back
        </Button>
      </div>
    </>
  );
}

export default React.memo(TransferForm);
