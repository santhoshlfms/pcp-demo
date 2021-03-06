addToConsole("Customer Presented QR Code Demo");

async function scanQR() {
  document.getElementById("reader").style.display = "none";

  try {
    let qrIdSelectManual = document.getElementById("qrIdSelectManual")?.checked;
    let qrIdInput = document.getElementById("qrIdInput")?.value;

    if (qrIdSelectManual) {
      if (!qrIdInput || qrIdInput.trim().length == 0) {
        alert("Please enter QR ID as you have chosen to enter it manually");
        return;
      }

      processCPQRC(qrIdInput);
      return;
    }

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
      processCPQRC(content);
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
        $.LoadingOverlay("hide");
        document.getElementById("reader").style.display = "none";
      });
  } catch (err) {
    console.error(err);
    document.getElementById("reader").style.display = "none";
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
    $.LoadingOverlay("hide");
  }
}

async function processCPQRC(qrCode) {
  try {
    // Step 1
    // GET QR CODE INPUT

    addToConsole("QR CODE INPUT IS " + qrCode);

    let uniqueId = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    console.log("UNIQUE ID " + uniqueId);

    let envObj = getEnvObj();

    // STEP 2
    $.LoadingOverlay("show", {
      image: "",
      text: "CAPTURE DETAILS...",
      textClass: "loadingText",
    });

    let source = new EventSource(
      "/pcp-qrc-cpqrc-sse?uniqueId=" +
        uniqueId +
        "&qrCode=" +
        qrCode +
        "&env=" +
        envObj.env
    );

    configureEventSourceListeners(source);
  } catch (err) {
    console.log("Error occurred " + err.message);
    document.getElementById("reader").style.display = "none";
    alert("Error occurred");
    $.LoadingOverlay("hide");
  }
}

// setTimeout(() => {
//   processCPQRC(791036711956);
// }, 2000);
