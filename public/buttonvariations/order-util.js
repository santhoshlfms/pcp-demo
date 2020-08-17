const LOGO_MAP = {
  bancontact:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_bancontact.svg",
  blik:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_blik.svg",
  eps:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_eps.svg",
  giropay:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_giropay.svg",
  ideal:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_iDEAL.svg",
  mybank:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_mybank.svg",
  p24:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_p24.svg",
  sofort:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_sofort.svg",
  trustly:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_trustly.svg",
  verkkopankki:
    "https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_verkkopankki.svg",
};

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}

async function pollPPGetOrder(orderId, attempts) {
  let { envObj } = getCreateOrderPayload();

  if (attempts > 7) {
    addToConsole("PayPal Order Status is not updated", "error");
    $.LoadingOverlay("hide");
    alert("Some Error Occurred");
    return;
  }

  let getOrderRespObj = await fetch("/pcp-get-order?id=" + orderId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      envObj,
    }),
  });

  let getOrderResp = await getOrderRespObj.json();

  if (getOrderResp.statusCode > 201) {
    addToConsole(JSON.stringify(getOrderResp, null, 4), "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
    return;
  }

  switch (getOrderResp.status) {
    case "COMPLETED":
      addToConsole("Order Already Captured");
      $.LoadingOverlay("hide");
      break;
    case "VOIDED":
      addToConsole("Order Already VOIDED");
      $.LoadingOverlay("hide");
      break;
    case "CANCELLED":
      addToConsole("Order CANCELLED");
      $.LoadingOverlay("hide");
      break;
    case "APPROVED":
      addToConsole("Order APPROVED");
      addToConsole("GET Order Response");
      addToConsole(
        "<pre style='height:320px'>" +
          JSON.stringify(getOrderResp, null, 2) +
          "</pre>"
      );
      $.LoadingOverlay("hide");
      // call capture Order
      captureOrder(orderId);
      break;
    case undefined:
    default:
      setTimeout(function () {
        pollPPGetOrder(orderId, attempts + 1);
      }, 3000);
      break;
  }
}

async function captureOrder(orderId) {
  let { envObj } = getCreateOrderPayload();

  await delay(1000);
  $.LoadingOverlay("show", {
    image: "",
    text: "Capture Order...",
    textClass: "loadingText",
  });

  addToConsole("Calling Capture Order");

  let captureOrderRespObj = await fetch("/pcp-capture-order?id=" + orderId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      envObj,
    }),
  });

  let captureOrderResp = await captureOrderRespObj.json();

  addToConsole("Capture Order Response");

  if (captureOrderResp.statusCode > 201) {
    addToConsole(JSON.stringify(captureOrderResp, null, 4), "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
    return;
  }

  addToConsole(
    "<pre style='height:320px'>" +
      JSON.stringify(captureOrderResp, null, 2) +
      "</pre>"
  );

  $.LoadingOverlay("hide");
  alert("Order Successful");
}
