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
    // ^ this will stop the scanner (video feed) and clear the scan area.

    // handle on success condition with the decoded message

    addToConsole("QR CODE INPUT IS " + qrCode);

    var uniqueId = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    console.log("UNIQUE ID "+ uniqueId);

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

    $.LoadingOverlay("hide");

    // STEP 4
    // POLL GET CAPTURE QRC DETAILS

    await delay(1000);

    $.LoadingOverlay("show", {
      image: "",
      text: "Polling Order Status...",
      textClass: "loadingText",
    });

    pollCaptureQRCDetails(1);
  } catch (err) {
    console.error(e);
    addToConsole("Error Occurred " + e.message, "error");
    alert("Some Error Occurred");
  }
}

function pollCaptureQRCDetails(attempts) {
  try {
  } catch (err) {
    console.error(e);
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
