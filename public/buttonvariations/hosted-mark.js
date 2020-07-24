function createOrderHosted() {

  console.log("Creating Order");
  if($ && $.LoadingOverlay)
    $.LoadingOverlay("show", {
      image: "",
      text: "Creating Order...",
      textClass: "loadingText"                                
    });
  // payload is hardcoded in routes/payload.js
  // payload can be sent from UI as well.
  return fetch("https://pcp-ucc-sample.herokuapp.com/create-order", {
      method: "POST",
      headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
      },
      body : JSON.stringify({
        amount: "3.00"
      })
  })
  .then(res => res.json())
  .then(res => {
      if(!res.id)
      console.log(JSON.stringify(res, null, 4));
      else
      console.log("Order Id : "+ res.id);
      if($ && $.LoadingOverlay)
        $.LoadingOverlay("hide");
      return res;
  })
  .then(d => d.id);
}
function loadHostedButtons() {
  console.log("Rendering Hosted Fields...");
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
          placeholder: "01/2022",
          prefill: "01/2022"
        }
      }
    }).then(function(hf) {
      console.log("Hosted Fields rendered successfully");
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
        
        console.log("Submitting card form to SDK...");
        
        var contingencies = [];
        // enable 3DS
        contingencies.push("3D_SECURE");

        hf.submit({
          contingencies: contingencies,
        })
          .then(function(payload) {
              console.log("Response Payload " + JSON.stringify(payload, null, "\t"));
              if (payload.nonce) {
                  console.log("Tokenized (Nonce): " + payload.nonce);
              }
              console.log("LiabilityShifted " + payload.liabilityShifted);
  
              // Capture the funds from the transaction
              if($ && $.LoadingOverlay)
              $.LoadingOverlay("show", {
                image: "",
                text: "Capturing Order...",
                textClass: "loadingText"                                
              });
          
              return fetch("http://localhost:3000/capture-order?id=" + payload.orderId, {
                  method: "POST",
                  headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                  }
              })
              .then(res => res.json())
              .then(res => {
                  if (!res.id) {
                      console.log(JSON.stringify(res, null, 4));
                  }
                  return res;
              });
          
          })
          .then(function(details) {
            // Show a success message to your buyer

              alert("Payment Successful");
              console.log("Payment successful");
              console.log(
                  JSON.stringify(details, null, 2)
              );
              if($ && $.LoadingOverlay)
                $.LoadingOverlay("hide");
          })
          .finally(() => {
            $.LoadingOverlay("hide")
          })
      });
    });
  } catch (e) {
    console.log("Error"+ JSON.stringify(e),'error');
    alert("Error occurred");
    if($ && $.LoadingOverlay)
      $.LoadingOverlay("hide");
  }
}

