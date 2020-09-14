async function configureEventSourceListeners(source) {
  source.addEventListener("MSG", (event) => {
    console.log("ATTEMPT "+ event.data);
  });

  source.addEventListener("CALLBACK_RECVD", async (event) => {
    document.getElementById("reader").style.display = "none";
    try {
      console.log("CALLBACK_RECVD EVENT");
      console.log("DATA " + event.data);
      addToConsole("QR CODE is " + JSON.parse(event.data).data.qrc_refid);

      await delay(1000);

      // STEP 2
      $.LoadingOverlay("show", {
        image: "",
        text: "CAPTURE DETAILS...",
        textClass: "loadingText",
      });
    } catch (e) {
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      console.log("error occurred in CALLBACK_RECVD event ", e.message);
      source.close();
    }
  });

  source.addEventListener("STATUS", async (event) => {
    document.getElementById("reader").style.display = "none";
    try {
      console.log("STATUS EVENT");
      console.log("DATA " + event.data);

      let parsedData;
      let status;

      if (event.data.trim().length > 0 && event.data.includes("data")) {
        if (event.data.includes("datacontenttype")) {
          let dataStr = event.data
            .slice(1, event.data.length - 5)
            .replace(/\\"/g, '"');
          //console.log(dataStr);
          parsedData = JSON.parse(dataStr);

          if (parsedData.datacontenttype === "application/paypal-error+json") {
            status = "FAILED";
          } else {
            status = parsedData.data.transaction_result.status;
          }
        } else if (event.data.includes("isDirect")) {
          parsedData = JSON.parse(event.data);
          status = parsedData.data.status;
          delete parsedData.isDirect;
        }

        addToConsole("Current Status : " + status || "UNKNOWN");

        if (
          ![
            "SUCCESS",
            "PROCESSING",
            "AWAITING_USER_INPUT",
            "ACCEPTED",
          ].includes(status)
        ) {
          addToConsole(
            `<pre style='max-height:400px;color:red'>${JSON.stringify(
              parsedData,
              null,
              2
            )}</pre>`,
            "error"
          );
        }

        switch (status) {
          case "SUCCESS":
            addToConsole(
              `<pre style='max-height:500px;color:green'>${JSON.stringify(
                parsedData,
                null,
                2
              )}</pre>`
            );

            let {
              transaction_result: {
                transaction_id,
                amount_approved: { currency_code, value },
              },
              payer_info: { email_address },
            } = parsedData.data;

            document.getElementById("trIdRes").innerText = transaction_id;
            document.getElementById(
              "amountRes"
            ).innerText = `${value} ${currency_code}`;
            document.getElementById("emailRes").innerText = email_address;

            $("#transactionResultModal").modal("show");

            $.LoadingOverlay("hide");
            break;
          case "PROCESSING":
          case "ACCEPTED":
          case "AWAITING_USER_INPUT":
            $.LoadingOverlay("text", "Current Status : " + status);
            break;
          case "ABORTED":
            alert("Transaction Aborted");
            $.LoadingOverlay("hide");
            break;
          case "CANCELLED":
            alert("Transaction Cancelled");
            $.LoadingOverlay("hide");
            break;
          case "FAILED":
          case undefined:
          case "UNKNOWN":
          case null:
            alert("Transaction Failed");
            $.LoadingOverlay("hide");
            break;
        }
      }
    } catch (e) {
      alert("Error Occurred");
      console.log("error occurred in parsing Status event data " + e.message);
      $.LoadingOverlay("hide");
      source.close();
    }
  });

  source.addEventListener("PAYLOAD", (event) => {
    try {
      console.log("PAYLOAD EVENT");
      console.log(event.data);

      addToConsole("Create Capture Payload");

      let payloadData = JSON.parse(event.data);
      addToConsole("CAPTURE QRC DETAILS Request Payload");

      addToConsole(
        "<pre style='max-height:450px;color:green'>" +
          JSON.stringify(payloadData.data, null, 2) +
          "</pre>"
      );
    } catch (err) {
      console.log("Error in parsing payload event data ", err.message);
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      source.close();
    }
  });

  source.addEventListener("EXCEPTION", (event) => {
    console.log("EXCEPTION EVENT");
    console.log(event.data);
    addToConsole("Error Occurred");
    addToConsole(
      "<pre style='max-height:400px;color:red'>" +
        (event.data, null, 2) +
        "</pre>",
      "error"
    );
    alert("Error occurred");
    $.LoadingOverlay("hide");
    document.getElementById("reader").style.display = "none";
    source.close();
  });

  source.addEventListener("CLOSE", (event) => {
    console.log("CLOSE EVENT");
    console.log(event.data);
    addToConsole("COMPLETE");
    $.LoadingOverlay("hide");
    document.getElementById("reader").style.display = "none";
    source.close();
  });
}

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}
function addToConsole(msg, state) {
  if (!state)
    $("#plgStatus").append(
      "<span style='color:green;word-break:break-word'>" +
        msg +
        "</span><span style='float:right'>" +
        moment(new Date()).format("HH:mm:ss a") +
        "</span>"
    );
  else
    $("#plgStatus").append(
      "<span style='color:red;word-break:break-word'>" +
        msg +
        "</span><span style='float:right'>" +
        moment(new Date()).format("HH:mm:ss a") +
        "</span>"
    );

  $("#plgStatus").append("<br/><br/>");
}
