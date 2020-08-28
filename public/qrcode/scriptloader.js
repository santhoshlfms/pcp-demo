var html5QrcodeScanner;
addToConsole("Customer Presented QR Code Demo");

async function showQR() {
  try {
    document.getElementById("reader").style.display = "flex";
    addToConsole("GET QR INPUT");
    await delay(200);
    window.scrollTo(
      0,
      document.body.scrollHeight -
        document.querySelector("#statusContainer").clientHeight
    );

    let scanner = new Instascan.Scanner({
      continuous: true,
      video: document.getElementById("preview"),
    });
    scanner.addListener("scan", function (content) {
      console.log("scan content " + content);
      scanner.stop();
      document.getElementById("reader").style.display = "none";
      onScanSuccess(content);
    });
    Instascan.Camera.getCameras()
      .then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error("No cameras found.");
          addToConsole("No Cameras found. ", "error");
        }
      })
      .catch(function (e) {
        console.error(e);
        addToConsole("Error Occurred " + e.message, "error");
        alert("Some Error Occurred");
      });
  } catch (err) {
    console.error(e);
    addToConsole("Error Occurred " + e.message, "error");
    alert("Some Error Occurred");
  }
}

async function onScanSuccess(qrCode) {
  try {
    // Step 1
    // GET QR CODE INPUT

    addToConsole("GOT QR CODE INPUT");
    html5QrcodeScanner?.clear();

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

    let transactionStatus = captureQRCDetailsResp?.transaction_result?.status;

    let reference_id = captureQRCDetailsResp?.transaction_result?.reference_id;

    addToConsole("Reference Id " + reference_id);

    $.LoadingOverlay("hide");

    // STEP 4
    // POLL GET CAPTURE QRC DETAILS

    await delay(500);

    $.LoadingOverlay("show", {
      image: "",
      text: transactionStatus,
      textClass: "loadingText",
    });

    pollCaptureQRCDetails(1, reference_id, uniqueId);
  } catch (err) {
    console.error(e);
    addToConsole("Error Occurred " + e.message, "error");
    alert("Some Error Occurred");
  }
}

async function pollCaptureQRCDetails(attempts, reference_id, uniqueId) {
  try {
    if (attempts > 10) {
      addToConsole("Unable to retrieve Capture status", "error");
      $.LoadingOverlay("hide");
      alert("Order not successful. Try again");
      return;
    }

    await delay(200);

    $.LoadingOverlay(
      "text",
      "Polling Capture Status - Current Status " + status
    );

    // CALL GET CAPTURE DETAILS CALL
    addToConsole("POLLING CAPTURE STATUS ");

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

    addToConsole("GET CAPTURE DETAILS API response");

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

    let status = getCaptureQRCDetailsResp?.items[0]?.transaction_result?.status;

    addToConsole("Order Status " + (status || "UNKNOWN"));

    switch (status) {
      case "SUCCESS":
        addToConsole("The transaction is Successful.");
        addToConsole(
          "<pre style='max-height:500px;color:green'>" +
            JSON.stringify(getCaptureQRCDetailsResp, null, 2) +
            "</pre>"
        );
        alert("Transaction is Successful");
        break;
      case "PROCESSING":
        addToConsole("The transaction is still being Processed.");
        await delay(5000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "ACCEPTED":
        addToConsole("The transaction is Accepted for further processing.");
        await delay(5000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "AWAITING_USER_INPUT":
        addToConsole(
          "The transaction is Waiting for the some input from the USER."
        );
        await delay(5000);
        pollCaptureQRCDetails(attempts + 1, reference_id, uniqueId);
        break;
      case "ABORTED":
        addToConsole("The transaction is Timed out");
        alert("Transaction Aborted");
        break;
      case "CANCELLED":
        addToConsole("The transaction is Cancelled.");
        alert("Transaction Cancelled");
        break;
      case "FAILED":
      case undefined:
      case null:
        addToConsole("The transaction has Failed.");
        alert("Transaction Failed");
        break;
    }

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
    $.LoadingOverlay("hide");
  } catch (err) {
    console.error(e);
    $.LoadingOverlay("hide");
    addToConsole("Error Occurred " + e.message, "error");
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
