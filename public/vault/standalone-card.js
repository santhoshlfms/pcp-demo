// util to render pp button
function renderStandaloneCard(isChange) {
  if (isChange) {
    $.LoadingOverlay("show");
    $("#paypal-button").empty();
    setTimeout(() => {
      $.LoadingOverlay("hide");
    }, 1000);
  }

  addToConsole("Rendering Vaulted Card");
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
      fundingSource: paypal.FUNDING.CARD,

      createOrder: function (data, actions) {
        $.LoadingOverlay("show", {
          image: "",
          text: "Creating Order...",
          textClass: "loadingText",
        });

        addToConsole("Creating Order");

        addToConsole("Create Order Request");

        addToConsole(
          "<pre style='max-height:320px'>" +
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
              "<pre style='max-height:320px'>" +
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

      onApprove: async function (data, actions) {
        addToConsole("Authorized by Buyer");
        addToConsole("Info ");
        addToConsole(
          "<pre style='max-height:160px'>" +
            JSON.stringify(data, null, 2) +
            "</pre>"
        );

        console.log(data.orderID, data.payerID);

        $.LoadingOverlay("show", {
          image: "",
          text:
            intent == "capture" ? "Capturing Order..." : "Authorizing Order...",
          textClass: "loadingText",
        });

        let pr = null;

        // Capture the funds from the transaction
        if (intent == "authorize") {
          pr = fetch("/pcp-auth-order?id=" + data.orderID, {
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
                addToConsole(
                  "<pre style='max-height:320px;color:red'>" +
                    JSON.stringify(res, null, 2) +
                    "</pre>",
                  "error"
                );

                return "Error";
              }
              return res;
            });
        }

        return pr
          .then(function (details) {
            //$.LoadingOverlay("hide");
            if (details === "Error") {
              alert("Some Error Occurred");
              throw new Error("Some Error Occurred");
              return;
            }
            return details;
          })
          .then(async function (details) {
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
              "<pre style='max-height:320px'>" +
                JSON.stringify(details, null, 2) +
                "</pre>"
            );

            await delay(100);

            $.LoadingOverlay("text", "GET ORDER after " + intent.toUpperCase());

            // Get the transaction details
            addToConsole("GET ORDER after  " + intent.toUpperCase());
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

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}
