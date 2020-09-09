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

      onScanSuccess(qrIdInput);
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
    console.error(err);
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
  }
}

// setTimeout(() => {
//   onScanSuccess(791036711956);
// }, 2000);
