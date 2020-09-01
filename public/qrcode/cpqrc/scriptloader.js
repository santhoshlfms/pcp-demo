addToConsole("Customer Presented QR Code Demo");

async function scanQR() {
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
    console.error(err);
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
  }
}

// setTimeout(() => {
//   onScanSuccess(791036711956);
// }, 2000);
