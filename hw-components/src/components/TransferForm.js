import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import HyperwalletTranferMethodDropIn from "./HyperWalletDropin";

import { host } from "./Config";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
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

  let getAuthToken = useCallback(
    (callback) => {
      console.log("Auth callback");

      updateStatus([{ message: "Fetching Auth Token", type: "info" }]);

      fetch(host + "/hw-auth-token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: appData.username,
          password: appData.password,
          userToken: appData.userToken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log("error in getting auth token");
            console.log(data.error);
            updateStatus([
              {
                message: "Fetch Auth Token API Error...",
                type: "request",
                req: JSON.stringify(data.error, null, 2),
                status: "error",
              },
            ]);
            return;
          }
          console.log("Got auth token");
          console.log(data.data.value);
          updateStatus([
            {
              message: "Received auth token...",
              type: "request",
              req: JSON.stringify(data.data, null, 2),
            },
          ]);
          callback(data.data.value);
        })
        .catch((err) => {
          console.log("error in getting auth token");
          console.log(err);
          updateStatus([
            {
              message: "Fetch Auth Token API Error...",
              type: "request",
              req: JSON.stringify(err, null, 2),
              status: "error",
            },
          ]);
        })
        .finally(() => {});
    },
    [appData.userToken, appData.username, appData.password, updateStatus]
  );

  let onComplete = useCallback(
    (trmObject, completionResult) => {
      //logic to be executed on completion of setting up transfer method.
      console.log("Transfer method created");
      console.log(trmObject, completionResult);
      updateStatus([
        { message: "Transfer method has been created", type: "info" },
      ]);
      updateAppData({
        //destinationToken: trmObject.token,
        destinationToken: trmObject.userToken,
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
  return (
    <>
      <HyperwalletTranferMethodDropIn
        userToken={appData.userToken}
        environment="sandbox"
        getAuthenticationToken={getAuthToken} //token should be renewed every 10 mins
        onComplete={onComplete}
        onError={onError}
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
