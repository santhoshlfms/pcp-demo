function loadHostedButtons() {
  addToConsole("Rendering Hosted Fields...");
  var submit = document.querySelector("#submit");
  try {
    paypal.HostedFields.render({
      paymentsSDK: true,
      createOrder: createOrderHosted,
      fields: {
        number: {
          selector: "#cc-num",
          placeholder: "Credit Card Number"
        },
        cvv: {
          selector: "#cc-cvv",
          placeholder: "CVV"
        },
        expirationDate: {
          selector: "#cc-expiration-date",
          placeholder: "MM/YYYY"
        }
      },
      styles: {
        input: {
          "font-size": "16px",
          "-webkit-font-smoothing": "antialiased"
        }
      }
    }).then(function(hf) {
      addToConsole("Hosted Fields rendered successfully");
      $("#submit").removeAttr("disabled");

      hf.on("validityChange", function(event) {
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
                    addToConsole(JSON.stringify(res, null, 4));
                  }
                  return res;
                });
            }
          })
          .then(function(details) {
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
          });
      });
    });
  } catch (e) {
    addToConsole("Error"+ JSON.stringify(e),'error');
    throw e;
  }
}
