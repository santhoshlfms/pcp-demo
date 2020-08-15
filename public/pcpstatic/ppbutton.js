// util to render pp button
function renderPPButton(isChange) {
  if (isChange) {
    $.LoadingOverlay("show");

    setTimeout(() => {
      $.LoadingOverlay("hide");
    }, 1000);
  }
  $("#paypal-button").empty();
  $("#paypal-button").show();

  const { envObj, orderObj } = getCreateOrderPayload();

  const intent = $("[name=intent]:checked").attr("data-value");

  let styleObj = {
    layout: $("#layout").val(),
    shape: $("#shape").val(), // pill | rect
    color: $("#color").val(), // gold | blue | silve | black
    label: $("#label").val(), // checkout | pay | paypal
  };

  if ($("#layout").val() === "horizontal") {
    styleObj.tagline = $("#tagline").val(); // true | false
  }

  paypal
    .Buttons({
      // Specify the style of the button
      style: styleObj,

      createOrder: function (data, actions) {
        $.LoadingOverlay("show", {
          image: "",
          text: "Creating Order...",
          textClass: "loadingText",
        });

        addToConsole("Creating Order");

        addToConsole("Create Order Request");

        addToConsole(
          "<pre style='height:320px'>" +
            JSON.stringify(orderObj, null, 2) +
            "</pre>"
        );

        return fetch("/pcp-create-order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            envObj,
            orderObj,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            addToConsole("Create order response");
            addToConsole(
              "<pre style='height:320px'>" +
                JSON.stringify(res, null, 2) +
                "</pre>"
            );

            addToConsole("Order Id : " + res.id);

            $.LoadingOverlay("hide");

            return res;
          })
          .then((d) => d.id)
          .finally(() => {
            $.LoadingOverlay("hide");
          });
      },

      onApprove: function (data, actions) {
        $.LoadingOverlay("show", {
          image: "",
          text: intent == "capture" ? "Capturing Order..." : "Authorizing Order...",
          textClass: "loadingText",
        });

        let pr = null;
        // // Get the transaction details
        // return fetch("/pcp-get-order?id="+data.orderID,{
        //   method: 'POST',
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json"
        //   },
        //   body: JSON.stringify({
        //     envObj,
        //   })
        // })
        // .then(res => res.json())
        // .then(res => {
        //     if(!res.id) {
        //         addToConsole(JSON.stringify(res,null,4));
        //     }
        //     return res;
        // })
        // .then(function(details) {
        // Optionally display the transaction details to the buyer
        addToConsole("Authorized by Buyer");
        addToConsole("Info ");
        addToConsole(
          "<pre style='height:160px'>" +
            JSON.stringify(data, null, 2) +
            "</pre>"
        );

        console.log(data.orderID, data.payerID);
        // Capture the funds from the transaction
        if (intent == "authorize") {
          pr = fetch("/pcp-auth-order?id=" + data.payerID, {
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
            });
        } else {
          pr = fetch("/pcp-capture-order?id=" + data.orderID, {
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
          });
        }
        return pr
          .then(function (details) {
            $.LoadingOverlay("hide");
            if (details === "Error") {
              alert("Some Error Occurred");
              return;
            }
            return details;
          })
          .then(function (details) {
            // Show a success message to your buyer
            if (intent == "capture") {
              alert("Payment Successful");
              addToConsole("Payment successful");
              addToConsole("Capture Order Response");
            } else {
              alert("Payment Authorized. Capture the Order once you are ready");
              addToConsole(
                "Payment Authorized. Capture the Order once you are ready"
              );
              addToConsole("Auth Order Response");
            }
            addToConsole(
              "<pre style='height:320px'>" +
                JSON.stringify(details, null, 2) +
                "</pre>"
            );
            
            setTimeout(() => {
              $.LoadingOverlay("show", {
                image: "",
                text: "GET Order...",
                textClass: "loadingText",
              });
            },200)
            
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
              addToConsole(JSON.stringify(res, null, 4));
            }
            return res;
          })
          .then(function (details) {
            
            addToConsole(
              "<pre style='height:320px'>" +
                JSON.stringify(details, null, 2) +
                "</pre>"
            );
          }).catch(err => {
            $.LoadingOverlay("hide");
          })
          .finally(() => {
            $.LoadingOverlay("hide");
          });
      },
      onCancel: function (err) {
        $.LoadingOverlay("hide");
        addToConsole("You cancelled the operation", "error");
        return alert("You cancelled the operation");
      },
      onError: function (err) {
        $.LoadingOverlay("hide");

        console.log("Some error occurred " + err);
        addToConsole("ERROR - " + err.message, "error");
        alert(
          "Some Error Occurred . Please open console to see the error " +
            JSON.stringify(err)
        );
      },
      onInit: function (data, actions) {
        addToConsole("PayPal Button Loaded");
      },
    })
    .render("#paypal-button")
    .catch((err) => {
      $.LoadingOverlay("hide");
      console.log("errrrrror ", err);
      $("#paypal-error-container").html("<br/> " + err.message);
      $("#paypal-error-container").show();
      addToConsole("ERROR - " + err.message, "error");
    });
} // end of pp button render
