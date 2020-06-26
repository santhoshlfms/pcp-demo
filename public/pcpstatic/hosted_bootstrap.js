function loadHostedButtons() {
  addToConsole("Rendering Hosted Fields...");
  try {
    paypal.HostedFields.render({
      createOrder: createOrderHosted,
      styles: {
        input: {
          "font-size": "14px",
          "font-family": "helvetica, tahoma, calibri, sans-serif",
          color: "#3a3a3a"
        },
        ":focus": {
          color: "green"
        }
      },
      fields: {
        number: {
          selector: "#card-number",
          placeholder: "4111 1111 1111 1111",
          prefill: "4111111111111111"
        },
        cvv: {
          selector: "#cvv",
          placeholder: "123",
          prefill: "123"
        },
        expirationDate: {
          selector: "#expiration-date",
          placeholder: "01/2021",
          prefill: "01/2021"
        }
      }
    }).then(function(hf) {
      addToConsole("Hosted Fields rendered successfully");
      $("#submit").removeAttr("disabled");

      hf.on("validityChange", function(event) {
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
            $("#card-number")
              .next("span")
              .text("");
          }

          // Remove any previously applied error or warning classes
          $(field.container)
            .parents(".form-group")
            .removeClass("has-warning");
          $(field.container)
            .parents(".form-group")
            .removeClass("has-success");
          // Apply styling for a valid field
          $(field.container)
            .parents(".form-group")
            .addClass("has-success");
        } else if (field.isPotentiallyValid) {
          // Remove styling  from potentially valid fields
          $(field.container)
            .parents(".form-group")
            .removeClass("has-warning");
          $(field.container)
            .parents(".form-group")
            .removeClass("has-success");
          if (event.emittedBy === "number") {
            $("#card-number")
              .next("span")
              .text("");
          }
        } else {
          // Add styling to invalid fields
          $(field.container)
            .parents(".form-group")
            .addClass("has-warning");
          // Add helper text for an invalid card number
          if (event.emittedBy === "number") {
            $("#card-number")
              .next("span")
              .text("Looks like this card number has an error.");
          }
        }
      });

      hf.on("cardTypeChange", function(event) {
        // Handle a field's change, such as a change in validity or credit card type
        if (event.cards.length === 1) {
          $("#card-type").text(event.cards[0].niceType);
        } else {
          $("#card-type").text("Card");
        }
      });

      $("#my-sample-form").submit(function(event) {
        event.preventDefault();
        
        addToConsole("Submitting card form to SDK...");
		
        const envObj = getEnvObj();
        const intent = $("[name=intent]:checked").attr("data-value");
       
        var is3dsEnabled = $("#3dsEnabled").val() == "Yes";
        var contingencies = [];
        if (is3dsEnabled) contingencies.push("3D_SECURE");

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
          });
      });
    });
  } catch (e) {
    addToConsole("Error"+ JSON.stringify(e),'error');
    throw e;
  }
}
