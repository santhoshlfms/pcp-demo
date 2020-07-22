import { useCallback } from "react";
import { host } from "../components/Config";


export const useAuthToken = function (updateStatus, appData) {
  let getAuthToken = useCallback(
    (callback) => {
      console.log("Auth callback");

      updateStatus([{ message: "Fetching Auth Token", type: "info" }]);

      let request = `curl -X "POST" "https://api.sandbox.hyperwallet.com/rest/v3/users/${appData.userToken}/authentication-token"  
        --header 'Authorization: Basic <username>:<password>' 
        --header 'Content-Type: application/json' 
        --header 'Accept: application/json' 
        `;

      updateStatus([
        {
          message: "Auth Token API Request....",
          type: "request",
          req: request,
        },
      ]);

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
          //console.log(" Token "+data.data.value);
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

  return [getAuthToken];
};
