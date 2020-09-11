addToConsole("Merchant Presented QR Code Demo");

async function showQR() {
  try {
    document.getElementById("reader").style.display = "flex";

    let payer_id = "7J5E5MRJUDW9Q";

    // Step 1 - SHOW QR

    // Generate Unique Merchant Ref ID

    let merchant_ref_id = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    let uniqueId = chance.string({
      length: 45,
      casing: "upper",
      alpha: true,
      numeric: true,
    });

    let time_stamp = Date.now();

    console.log("UNIQUE ID " + uniqueId);
    console.log("Merchant Reference ID " + merchant_ref_id);

    let qrText = `https://www.paypal.com/qrcode/integrated?payer_id=${payer_id}&merchant_ref_id=${merchant_ref_id}&time_stamp=${time_stamp}`;

    let qrcode = new QRCode(document.getElementById("qrcode"), {
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

    processMPQRC(merchant_ref_id, uniqueId);
  } catch (err) {
    document.getElementById("reader").style.display = "none";
    console.error(err);
    addToConsole("Error Occurred " + err.message, "error");
    alert("Some Error Occurred");
    $.LoadingOverlay("hide");
  }
}

async function processMPQRC(merchant_ref_id, uniqueId) {
  try {
    // Step 1

    let envObj = getEnvObj();

    let source = new EventSource(
      "/pcp-qrc-mpqrc-sse?merchant_ref_id=" +
        merchant_ref_id +
        "&uniqueId=" +
        uniqueId +
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
//   processMPQRC(791036711951231231236);
// }, 2000);
