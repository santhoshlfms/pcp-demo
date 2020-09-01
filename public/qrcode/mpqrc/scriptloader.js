addToConsole("Merchant Presented QR Code Demo");

async function scanQR() {
  try {
    document.getElementById("reader").style.display = "flex";

    let payer_id = "7J5E5MRJUDW9Q";

    let merchant_ref_id = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    let time_stamp = Date.now();

    console.log("Merchant Reference ID " + merchant_ref_id);

    let qrText = `https://www.paypal.com/qrcode/integrated?payer_id=${payer_id}&merchant_ref_id=${merchant_ref_id}&time_stamp=${time_stamp}`;

    var qrcode = new QRCode(document.getElementById("qrcode"), {
      text: qrText,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    addToConsole("Showing QR CODE");

    await delay(200);

    window.scrollTo(
      0,
      document.body.scrollHeight -
        document.querySelector("#statusContainer").clientHeight
    );

    let source = new EventSource(
      "/mpqrc/status?merchant_ref_id=" + merchant_ref_id
    );

    source.addEventListener("QRC_ID", (event) => {
      document.getElementById("reader").style.display = "none";

      console.log("QRC_ID event ", event);
      console.log("data ", event.data);
      let data = JSON.parse(event.data);

      let qrcId = data?.qrc_refid;

      console.log("QR ID from SSE ", qrcId);

      if (qrcId) {
        onScanSuccess(qrcId);
      } else {
        alert("QRC not received");
      }
      source.close();
    });

    source.addEventListener("EXCEPTION", (event) => {
      document.getElementById("reader").style.display = "none";

      console.log("Exception Event");
      console.log("error ", event.data);
      addToConsole("Error in getting QR ID from callback " + event.data);
      alert("Error occured");
      source.close();
    });
  } catch (err) {
    document.getElementById("reader").style.display = "none";
    console.error(err);
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
  }
}

// setTimeout(() => {
//   onScanSuccess(791036711956);
// }, 2000);

async function onScanSuccess(qrCode) {
  try {
    // Step 1
    // GET QR CODE INPUT

    //addToConsole("GOT QR CODE INPUT");

    addToConsole("QR CODE INPUT IS " + qrCode);

    var uniqueId = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    console.log("UNIQUE ID " + uniqueId);

    let envObj = getEnvObj();

    // STEP 2
    // FORM CAPTURE QRC DETAILS Payload
    let { qrcObj } = createCaptureDetailsPayload(uniqueId, qrCode);

    $.LoadingOverlay("show", {
      image: "",
      text: "CAPTURE DETAILS...",
      textClass: "loadingText",
    });

    // STEP 3
    // CALL CAPTURE QRC DETAILS API

    addToConsole("Call CAPTURE QRC DETAILS API");

    addToConsole("CAPTURE QRC DETAILS Request Payload");

    addToConsole(
      "<pre style='max-height:400px;color:green'>" +
        JSON.stringify(qrcObj, null, 2) +
        "</pre>"
    );

    let captureQRCDetailsRespObj = await fetch("/pcp-qrc-capture", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        qrcObj,
        requestId: uniqueId,
      }),
    });

    let captureQRCDetailsResp = await captureQRCDetailsRespObj.json();

    addToConsole("CAPTURE QRC DETAILS API response");

    if (captureQRCDetailsResp.statusCode > 202) {
      addToConsole(
        "<pre style='max-height:400px;color:red'>" +
          JSON.stringify(captureQRCDetailsResp, null, 2) +
          "</pre>",
        "error"
      );
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    addToConsole(
      "<pre style='max-height:400px;color:green'>" +
        JSON.stringify(captureQRCDetailsResp, null, 2) +
        "</pre>"
    );

    let transactionStatus =
      captureQRCDetailsResp?.transaction_result?.status || "UNKNOWN";

    let reference_id = captureQRCDetailsResp?.transaction_result?.reference_id;

    addToConsole("Reference Id " + reference_id);

    $.LoadingOverlay("hide");

    // STEP 4
    // POLL GET CAPTURE QRC DETAILS

    await delay(500);

    addToConsole(
      "POLLING Order STATUS - CALL GET CAPTURE DETAILS API using " +
        reference_id
    );

    $.LoadingOverlay("show", {
      image: "",
      text: "Polling Order Status. Current Status: " + transactionStatus,
      textClass: "loadingText",
    });

    pollCaptureQRCDetails(1, reference_id, uniqueId);
  } catch (err) {
    console.error(err);
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
  }
}

async function pollCaptureQRCDetails(attempts, reference_id, uniqueId) {
  try {
    if (attempts > 10) {
      addToConsole("Unable to retrieve Order status", "error");
      $.LoadingOverlay("hide");
      alert("Order not successful. Try again");
      return;
    }

    await delay(100);

    // CALL GET CAPTURE DETAILS API

    let envObj = getEnvObj();

    let getCaptureQRCDetailsRespObj = await fetch("/pcp-qrc-capture-retrieve", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        reference_id,
        requestId: uniqueId,
      }),
    });

    let getCaptureQRCDetailsResp = await getCaptureQRCDetailsRespObj.json();

    if (getCaptureQRCDetailsResp.statusCode > 200) {
      addToConsole(
        "<pre style='max-height:400px;color:red'>" +
          JSON.stringify(getCaptureQRCDetailsResp, null, 2) +
          "</pre>",
        "error"
      );
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    let status =
      getCaptureQRCDetailsResp?.transaction_result?.status || "UNKNOWN";

    $.LoadingOverlay(
      "text",
      "Polling Order Status. Current Status : " + status
    );

    addToConsole("Order Status " + status);

    if (
      !["SUCCESS", "PROCESSING", "AWAITING_USER_INPUT", "ACCEPTED"].includes(
        status
      )
    ) {
      addToConsole(
        "<pre style='max-height:400px;color:red'>" +
          JSON.stringify(getCaptureQRCDetailsResp, null, 2) +
          "</pre>",
        "error"
      );
    }

    switch (status) {
      case "SUCCESS":
        // addToConsole("The transaction is Successful.");
        addToConsole(
          "<pre style='max-height:500px;color:green'>" +
            JSON.stringify(getCaptureQRCDetailsResp, null, 2) +
            "</pre>"
        );

        let {
          transaction_result: {
            transaction_id,
            amount_approved: { currency_code, value },
          },
          payer_info: { email_address },
        } = getCaptureQRCDetailsResp;

        document.getElementById("trIdRes").innerText = transaction_id;
        document.getElementById(
          "amountRes"
        ).innerText = `${value} ${currency_code}`;
        document.getElementById("emailRes").innerText = email_address;

        $("#transactionResultModal").modal("show");

        $.LoadingOverlay("hide");
        break;
      case "PROCESSING":
        //addToConsole("The transaction is still being Processed.");
        await delay(7000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "ACCEPTED":
        //addToConsole("The transaction is Accepted for further processing.");
        await delay(7000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "AWAITING_USER_INPUT":
        // addToConsole(
        //   "The transaction is Waiting for the some input from the USER."
        // );
        await delay(7000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "ABORTED":
        // addToConsole("The transaction is Timed out");
        alert("Transaction Aborted");
        $.LoadingOverlay("hide");
        break;
      case "CANCELLED":
        // addToConsole("The transaction is Cancelled.");
        alert("Transaction Cancelled");
        $.LoadingOverlay("hide");
        break;
      case "FAILED":
      case undefined:
      case "UNKNOWN":
      case null:
        // addToConsole("The transaction has Failed.");
        alert("Transaction Failed");
        $.LoadingOverlay("hide");
        break;
    }
  } catch (err) {
    console.error(err);
    $.LoadingOverlay("hide");
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
  }
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

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}
