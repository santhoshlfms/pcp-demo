function loadHostedButtons() {
  try {
    var form = document.querySelector("#cardForm");

    // Input switcher
    var formItems = [];
    var currentFormItem = 0;

    $(".field-container").each(function () {
      formItems.push(this);
    });

    // Add the functionality for what happens when people will click on next
    function formControlNext() {
      $(formItems[currentFormItem]).addClass("field-container--hidden");
      $(formItems[currentFormItem + 1]).removeClass("field-container--hidden");

      currentFormItem = currentFormItem + 1;
      checkFormVisibility();
      changeStepperNumber();

      hideNext();

      return false;
    }

    function hideNext() {
      if (
        !$(formItems[currentFormItem + 1])
          .find(".hosted-field")
          .hasClass("hosted-field")
      ) {
        $(".form-controls__next").addClass("form-controls--hidden");
      }

      $(".form-controls__prev").addClass("form-controls--back");
    }

    function formControlPrev() {
      $(formItems[currentFormItem]).addClass("field-container--hidden");
      $(formItems[currentFormItem - 1]).removeClass("field-container--hidden");

      currentFormItem = currentFormItem - 1;
      checkFormVisibility();
      changeStepperNumber();
    }

    function showNext() {
      $(".form-controls__next").removeClass("form-controls--hidden");
      $(".form-controls__prev").removeClass("form-controls--back");
    }

    $(".form-controls__next").click(function () {
      formControlNext();

      return false;
    });

    $(".form-controls__prev").click(function () {
      formControlPrev();

      return false;
    });

    // Update the number of steps and update the content to match input
    function changeStepperNumber() {
      if (currentFormItem === 3) {
        $(".form-controls__steps").text("4 / 4");
        $(".field-message").text("Time to buy that sweet sweet bag.");
        $(".form-controls").addClass("form-controls--end");
      } else if (currentFormItem === 2) {
        $(".form-controls__steps").text("3 / 4");
        $(".field-message").text("This is on the back of your card.");
        $(".form-controls").removeClass("form-controls--end");
      } else if (currentFormItem === 1) {
        $(".form-controls__steps").text("2 / 4");
        $(".field-message").text("When will your card expire?");
      } else {
        $(".form-controls__steps").text("1 / 4");
        $(".field-message").text("Let's add your card number.");
      }
    }

    // Show/hide the appropriate controls
    function checkFormVisibility() {
      if (currentFormItem === 0) {
        $(".form-controls__prev").addClass("form-controls--hidden");
      } else {
        $(".form-controls__prev").removeClass("form-controls--hidden");
      }

      if (currentFormItem === 3) {
        $(".form-controls__next").addClass("form-controls--hidden");
      } else {
        $(".form-controls__next").removeClass("form-controls--hidden");
      }
    }

    paypal.HostedFields.render({
      paymentsSDK: true,
      createOrder: createOrderHosted,
      styles: {
        input: {
          "font-size": "2em",
          "font-weight": "300",
          "font-family": "sans-serif",
          color: "#fff",
        },
        ":focus": {
          color: "#fff",
        },
        ".invalid": {
          color: "#fff",
        },
        "@media screen and (max-width: 361px)": {
          input: {
            "font-size": "1em",
          },
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
          placeholder: "01/2021",
          prefill: "01/2021",
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
            // Show Next button if inputs are valid
            showNext();

            // Update message to reflect success
            $(".field-message").text("Nice! Let's move on…");
          } else if (!field.isPotentiallyValid) {
            // Hide next button
            $(".form-controls__next").addClass("form-controls--hidden");
            // Change the top message based on the input error
            switch ($(field.container).attr("id")) {
              case "card-number":
                $(".field-message").text(
                  "Please check if you typed the correct card number."
                );
                break;
              case "expiration-date":
                $(".field-message").text("Please check your expiration date.");
                break;
              case "cvv":
                $(".field-message").text("Please check your security code.");
                break;
            }
          } else {
            switch ($(field.container).attr("id")) {
              case "card-number":
                $(".field-message").text("Let's add your card number.");
                break;
              case "expiration-date":
                $(".field-message").text("When will your card expire?");
                break;
              case "cvv":
                $(".field-message").text("This is on the back of your card.");
                break;
            }
          }
        });

        hf.on("focus", function (event) {
          var field = event.fields[event.emittedBy];

          $(field.container)
            .prev(".hosted-field--label")
            .addClass("hosted-field--label--moved");
          $(field.container).parent().addClass("field-container--active");
        });

        hf.on("blur", function (event) {
          var field = event.fields[event.emittedBy];

          $(field.container)
            .prev(".hosted-field--label")
            .removeClass("hosted-field--label--moved");
          $(field.container).parent().removeClass("field-container--active");
        });

        hf.on("empty", function (event) {
          var field = event.fields[event.emittedBy];

          $(field.container)
            .prev(".hosted-field--label")
            .removeClass("not-empty");
        });

        hf.on("notEmpty", function (event) {
          var field = event.fields[event.emittedBy];

          $(field.container).prev(".hosted-field--label").addClass("not-empty");
        });
        form.addEventListener("submit", function (event) {
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
