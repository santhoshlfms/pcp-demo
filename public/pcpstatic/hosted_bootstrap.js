function loadHostedButtons() {
  try {
    paypal.HostedFields.render({
      createOrder: createOrderHosted,
      styles: {
        input: {
          "font-size": "14px",
          "font-family": "helvetica, tahoma, calibri, sans-serif",
          color: "#3a3a3a",
        },
        ":focus": {
          color: "green",
        },
      },
      fields: {
        number: {
          selector: "#card-number",
          placeholder: "5555 5555 5555 4444",
          prefill: "5555555555554444",
        },
        cvv: {
          selector: "#cvv",
          placeholder: "123",
          prefill: "123",
        },
        expirationDate: {
          selector: "#expiration-date",
          placeholder: "01/2022",
          prefill: "01/2022",
        },
      },
    })
      .then(function (hf) {
        addToConsole("Hosted Fields is enabled");
        addToConsole("Hosted Fields rendered successfully");
        $("#submit").removeAttr("disabled");

        hf.on("validityChange", function (event) {
          var field = event.fields[event.emittedBy];

          if (field.isValid) {
            if (
              event.emittedBy === "expirationMonth" ||
              event.emittedBy === "expirationYear"
            ) {
              if (
                !event.fields.expirationMonth.isValid ||
                !event.fields.expirationYear.isValid
              ) {
                return;
              }
            } else if (event.emittedBy === "number") {
              $("#card-number").next("span").text("");
            }

            // Remove any previously applied error or warning classes
            $(field.container)
              .parents(".form-group")
              .removeClass("has-warning");
            $(field.container)
              .parents(".form-group")
              .removeClass("has-success");
            // Apply styling for a valid field
            $(field.container).parents(".form-group").addClass("has-success");
          } else if (field.isPotentiallyValid) {
            // Remove styling  from potentially valid fields
            $(field.container)
              .parents(".form-group")
              .removeClass("has-warning");
            $(field.container)
              .parents(".form-group")
              .removeClass("has-success");
            if (event.emittedBy === "number") {
              $("#card-number").next("span").text("");
            }
          } else {
            // Add styling to invalid fields
            $(field.container).parents(".form-group").addClass("has-warning");
            // Add helper text for an invalid card number
            if (event.emittedBy === "number") {
              $("#card-number")
                .next("span")
                .text("Looks like this card number has an error.");
            }
          }
        });

        hf.on("cardTypeChange", function (event) {
          // Handle a field's change, such as a change in validity or credit card type
          if (event.cards.length === 1) {
            $("#card-type").text(event.cards[0].niceType);
          } else {
            $("#card-type").text("Card");
          }
        });

        $("#my-sample-form").submit(async function (event) {
          event.preventDefault();

          addToConsole("Submitting card form to SDK...");

          const envObj = getEnvObj();
          const intent = $("[name=intent]:checked").attr("data-value");

          var is3dsEnabled = $("#3dsEnabled").val() == "Yes";
          var contingencies = [];
          if (is3dsEnabled) contingencies.push("3D_SECURE");

          hf.submit({
            contingencies: contingencies,
            vault: envObj.isVaulting,
          })
            .then(async function (payload) {
              addToConsole("Payload " + JSON.stringify(payload, null, "\t"));
              if (payload.nonce) {
                addToConsole("Tokenized (Nonce): " + payload.nonce);
              }
              addToConsole("LiabilityShifted " + payload.liabilityShifted);

              if (is3dsEnabled) {
                // Get the transaction details
                $.LoadingOverlay("show", {
                  image: "",
                  text: "GET ORDER after 3DS",
                  textClass: "loadingText",
                });
                addToConsole("GET ORDER after 3DS");

                await fetch("/pcp-get-order?id=" + payload.orderId, {
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
                    }
                    return res;
                  })
                  .then((details) => {
                    addToConsole(
                      "<pre style='max-height:320px'>" +
                        JSON.stringify(details, null, 2) +
                        "</pre>"
                    );
                  });
                $.LoadingOverlay(
                  "text",
                  intent == "capture"
                    ? "Capturing Order..."
                    : "Authorizing Order..."
                );
              } else {
                $.LoadingOverlay("show", {
                  image: "",
                  text:
                    intent == "capture"
                      ? "Capturing Order..."
                      : "Authorizing Order...",
                  textClass: "loadingText",
                });
              }

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
                        "<pre style='max-height:320px;color:red'>" +
                          JSON.stringify(res, null, 2) +
                          "</pre>",
                        "error"
                      );
                    }
                    return res;
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
                    $.LoadingOverlay("hide");
                  });
              }
            })
            .then(function (details) {
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

              $.LoadingOverlay(
                "text",
                "GET ORDER after " + intent.toUpperCase()
              );

              // Get the transaction details
              addToConsole("GET ORDER after  " + intent.toUpperCase());

              // Get the transaction details
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
                  "<pre style='max-height:320px;color:red'>" +
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
              $.LoadingOverlay("hide");
              addToConsole(JSON.stringify(err, null, 4), "error");
            })
            .finally(() => {
              $.LoadingOverlay("hide");
            });
        });
      })
      .catch(function (err) {
        console.log(err);
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
