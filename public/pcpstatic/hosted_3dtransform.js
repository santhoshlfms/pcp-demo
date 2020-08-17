function loadHostedButtons() {
  var submit = document.querySelector("#submit");
  try {
    paypal.HostedFields.render({
      paymentsSDK: true,
      createOrder: createOrderHosted,
      fields: {
        number: {
          selector: "#cc-num",
          placeholder: "Credit Card Number",
          prefill: "5555555555554444",
        },
        cvv: {
          selector: "#cc-cvv",
          placeholder: "CVV",
          prefill: "123",
        },
        expirationDate: {
          selector: "#cc-expiration-date",
          placeholder: "MM/YYYY",
          prefill: "01/2021",
        },
      },
      styles: {
        input: {
          "font-size": "16px",
          "-webkit-font-smoothing": "antialiased",
        },
      },
    })
      .then(function (hf) {
        addToConsole("Hosted Fields is enabled");
        addToConsole("Hosted Fields rendered successfully");

        $("#submit").removeAttr("disabled");

        hf.on("validityChange", function (event) {
          var allValid = true;
          var field, key;

          for (key in event.fields) {
            if (event.fields[key].isValid === false) {
              allValid = false;
              break;
            }
          }

          if (allValid) {
            submit.removeAttribute("disabled");
          } else {
            submit.setAttribute("disabled", "disabled");
          }
        });

        submit.addEventListener("click", function (event) {
          event.preventDefault();

          addToConsole("Submitting card form to SDK...");
          var is3dsEnabled = $("#3dsEnabled").val() == "Yes";
          var contingencies = [];
          if (is3dsEnabled) contingencies.push("3D_SECURE");

          const envObj = getEnvObj();
          const intent = $("[name=intent]:checked").attr("data-value");

          hf.submit({
            contingencies: contingencies,
            vault: envObj.isVaulting,
          })
            .then(function (payload) {
              addToConsole("Payload " + JSON.stringify(payload, null, "\t"));
              if (payload.nonce) {
                addToConsole("Tokenized (Nonce): " + payload.nonce);
              }
              addToConsole("LiabilityShifted " + payload.liabilityShifted);

              $.LoadingOverlay("show", {
                image: "",
                text:
                  intent === "capture"
                    ? "Capturing Order..."
                    : "Authorizing Order...",
                textClass: "loadingText",
              });

              // Capture/ Authorize the funds from the transaction
              if (intent == "authorize") {
                return fetch("/pcp-auth-order?id=" + payload.orderId, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    envObj,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (!res.id) {
                      addToConsole(
                        "<pre style='max-height:320px'>" +
                          JSON.stringify(res, null, 2) +
                          "</pre>",
                        "error"
                      );
                    }
                    return res;
                  })
                  .catch((err) => {
                    addToConsole(JSON.stringify(err, null, 4), "error");
                  });
              } else {
                return fetch("/pcp-capture-order?id=" + payload.orderId, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    envObj,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (!res.id) {
                      addToConsole(JSON.stringify(res, null, 4), "error");
                      return "Error";
                    }
                    return res;
                  })
                  .catch((err) => {
                    addToConsole(JSON.stringify(err, null, 4), "error");
                  });
              }
            })
            .then(function (details) {
              $.LoadingOverlay("hide");

              if (details === "Error") {
                alert("Some Error Occurred");
                throw new Error("Some Error Occurred");
                return;
              }
              // Show a success message to your buyer
              if (intent == "capture") {
                alert("Payment Successful");
                addToConsole("Payment successful");
                addToConsole("Capture Order Response");
              } else {
                alert(
                  "Payment Authorized. Capture the Order once you are ready"
                );
                addToConsole(
                  "Payment Authorized. Capture the Order once you are ready"
                );
                addToConsole("Auth Order Response");
              }
              addToConsole(
                "<pre style='max-height:320px'>" +
                  JSON.stringify(details, null, 2) +
                  "</pre>"
              );

              setTimeout(() => {
                $.LoadingOverlay("show", {
                  image: "",
                  text: "GET Order...",
                  textClass: "loadingText",
                });
              }, 300);

              // Get the transaction details
              addToConsole("GET ORDER DETAILS ");
              return fetch("/pcp-get-order?id=" + details.id, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  envObj,
                }),
              });
            })
            .then((res) => res.json())
            .then((res) => {
              if (!res.id) {
                addToConsole(
                  "<pre style='max-height:320px'>" +
                    JSON.stringify(res, null, 2) +
                    "</pre>",
                  "error"
                );
              }
              return res;
            })
            .then(function (details) {
              addToConsole(
                "<pre style='max-height:320px'>" +
                  JSON.stringify(details, null, 2) +
                  "</pre>"
              );
            })
            .catch((err) => {
              addToConsole(JSON.stringify(err, null, 4), "error");
              $.LoadingOverlay("hide");
            })
            .finally(() => {
              $.LoadingOverlay("hide");
            });
        });
      })
      .catch(function (err) {
        $.LoadingOverlay("hide");
        addToConsole(err.message, "error");
        $("#hcontainer").empty();
        $("#hostedButton").hide();
      });
  } catch (e) {
    $.LoadingOverlay("hide");
    addToConsole("Error" + JSON.stringify(e), "error");
    throw e;
  }
}
