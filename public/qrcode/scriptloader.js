async function showQR() {
  var html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 100,
    qrbox: 300,
  });

  function onScanSuccess(qrCodeMessage) {
    // handle on success condition with the decoded message
    html5QrcodeScanner.clear();

    alert("Qr ID is " + qrCodeMessage);
    // ^ this will stop the scanner (video feed) and clear the scan area.
  }

  html5QrcodeScanner.render(onScanSuccess);
  setTimeout(() => {
    window.scrollTo(
      0,
      document.body.scrollHeight -
        document.querySelector("#statusContainer").clientHeight
    );
  }, 200);
}
