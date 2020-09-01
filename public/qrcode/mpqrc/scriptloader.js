addToConsole("Merchant Presented QR Code Demo");

async function showQR() {
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

    source.addEventListener("MSG", (event) => {
      //document.getElementById("reader").style.display = "none";
      console.log("MSG event");
      console.log("Data ", event.data);
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
