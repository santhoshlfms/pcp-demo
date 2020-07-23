function loadHostedButtons() {
  addToConsole("Rendering Hosted Fields...");

  try {
    var form = document.querySelector("#my-sample-form");
    var submit = document.querySelector('input[type="submit"]');

    paypal.HostedFields.render({
      paymentsSDK: true,
      createOrder: createOrderHosted,
      styles: {
        input: {
          color: "#282c37",
          "font-size": "16px",
          transition: "color 0.1s",
          "line-height": "3"
        },
        // Style the text of an invalid input
        "input.invalid": {
          color: "#E53A40"
        },
        // placeholder styles need to be individually adjusted
        "::-webkit-input-placeholder": {
          color: "rgba(0,0,0,0.6)"
        },
        ":-moz-placeholder": {
          color: "rgba(0,0,0,0.6)"
        },
        "::-moz-placeholder": {
          color: "rgba(0,0,0,0.6)"
        },
        ":-ms-input-placeholder": {
          color: "rgba(0,0,0,0.6)"
        }
      },
      // Add information for individual fields
      fields: {
        number: {
          selector: "#card-number",
          placeholder: "4111 1111 1111 1111"
        },
        cvv: {
          selector: "#cvv",
          placeholder: "123"
        },
        expirationDate: {
          selector: "#expiration-date",
          placeholder: "01 / 2021"
        }
      }
    }).then(function(hf) {
      addToConsole("Hosted Fields rendered successfully");
      $("#submit").removeAttr("disabled");

      hf.on("validityChange", function(event) {
        // Check if all fields are valid, then show submit button
        var formValid = Object.keys(event.fields).every(function(key) {
          return event.fields[key].isValid;
        });

        if (formValid) {
          $("#button-pay").addClass("show-button");
        } else {
          $("#button-pay").removeClass("show-button");
        }
      });

      hf.on("empty", function(event) {
        $("header").removeClass("header-slide");
        $("#card-image").removeClass();
        $(form).removeClass();
      });

      hf.on("cardTypeChange", function(event) {
        // Change card bg depending on card type
        if (event.cards.length === 1) {
          $(form)
            .removeClass()
            .addClass(event.cards[0].type);
          $("#card-image")
            .removeClass()
            .addClass(event.cards[0].type);
          $("header").addClass("header-slide");

          // Change the CVV length for AmericanExpress cards
          if (event.cards[0].code.size === 4) {
            hf.setAttribute({
              field: "cvv",
              attribute: "placeholder",
              value: "1234"
            });
          }
        } else {
          hf.setAttribute({
            field: "cvv",
            attribute: "placeholder",
            value: "123"
          });
        }
      });

      submit.addEventListener("click", function(event) {
        event.preventDefault();
        
        addToConsole("Submitting card form to SDK...");
        var is3dsEnabled = $("#3dsEnabled").val() == "Yes";
        var contingencies = [];
        if (is3dsEnabled) contingencies.push("3D_SECURE");

        const envObj = getEnvObj();
        const intent = $("[name=intent]:checked").attr("data-value");
        
        hf.submit({
          contingencies: contingencies,
          vault: envObj.isVaulting
        })
          .then(function(payload) {
            addToConsole("Payload " + JSON.stringify(payload, null, "\t"));
            if (payload.nonce) {
              addToConsole("Tokenized (Nonce): " + payload.nonce);
            }
            addToConsole("LiabilityShifted " + payload.liabilityShifted);

            $.LoadingOverlay("show", {
              image: "",
              text: "Capturing Order...",
              textClass: "loadingText"                                
            });


            // Capture/ Authorize the funds from the transaction
            if (intent == "authorize") {
              return fetch("/pcp-auth-order?id=" + payload.orderId, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  envObj
                })
              })
                .then(res => res.json())
                .then(res => {
                  if (!res.id) {
                    addToConsole(JSON.stringify(res, null, 4));
                  }
                  return res;
                }).catch(err=>{
                  addToConsole(JSON.stringify(err, null, 4),"error");
                });
            } else {
              return fetch("/pcp-capture-order?id=" + payload.orderId, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  envObj
                })
              })
                .then(res => res.json())
                .then(res => {
                  if (!res.id) {
                    addToConsole(JSON.stringify(res, null, 4),"error");
                    return "Error";
                  }
                  return res;
                }).catch(err=>{
                  addToConsole(JSON.stringify(err, null, 4),"error");
                });
            }
          })
          .then(function(details) {
            if(details === "Error") { 
              alert("Some Error Occurred");
              return;
            }
            // Show a success message to your buyer
            if (intent == "capture") {
              alert("Payment Successful");
              addToConsole("Payment successful");
            } else {
              alert("Payment Authorized. Capture the Order once you are ready");
              addToConsole(
                "Payment Authorized. Capture the Order once you are ready"
              );
            }
            addToConsole(
              "<pre style='height:200px'>" +
                JSON.stringify(details, null, 2) +
                "</pre>"
            );
          }).catch(err=>{
            addToConsole(JSON.stringify(err, null, 4),"error");
          })
          .finally(() => {
            $.LoadingOverlay("hide");
          })
      });
    });
  } catch (e) {
    $.LoadingOverlay("hide");
    addToConsole("Error"+ JSON.stringify(e),'error');
    throw e;
  }
}
