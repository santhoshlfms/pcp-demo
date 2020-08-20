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

async function pollOrderStatus(orderId, attempts = 1) {
  try {
    
    console.log("Poll DB Order status attempt "+ attempts);

    addToConsole("Poll DB Order status attempt "+ attempts);

    if (attempts > 7) {
      addToConsole("PayPal Order Status is not updated", "error");
      $.LoadingOverlay("hide");
      alert("Order not successful. Try again");
      return;
    }

    let orderStatusRespObj = await fetch("/orderStatus?orderId=" + orderId);

    let orderStatusResp = await orderStatusRespObj.json();

    let status = orderStatusResp?.status;

    handleStatus(status, attempts, orderId, "", false);
  } catch (err) {
    console.log(err);
    addToConsole("Some Error occurred", "error");
    $.LoadingOverlay("hide");
    alert("Some Error Occurred");
  }
}

async function pollPPGetOrder(orderId, attempts = 1) {
  try {
    
    console.log("Poll PP Get Order status attempt : "+ attempts);

    addToConsole("Poll PP Get Order status attempt : "+ attempts);

    let { envObj } = getCreateOrderPayload();

    if (attempts > 7) {
      addToConsole("PayPal Order Status is not updated", "error");
      $.LoadingOverlay("hide");
      alert("Order not successful. Try again");
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
      addToConsole(
        "<pre style='max-height:320px;color:red'>" +
          JSON.stringify(getOrderResp, null, 2) +
          "</pre>", "error");
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    handleStatus(getOrderResp.status, attempts, orderId, getOrderResp, true);
  } catch (err) {
    console.log(err);
    addToConsole("Some Error occurred", "error");
    $.LoadingOverlay("hide");
    alert("Some Error Occurred");
  }
}

async function handleStatus(
  status,
  attempts,
  orderId,
  orderResp,
  isPollPPOrder
) {
  console.log("status " + status);
  switch (status) {
    case "COMPLETED":
      addToConsole("Order Already Captured", "error");
      alert("Order Already Captured");
      $.LoadingOverlay("hide");
      break;
    case "VOIDED":
      addToConsole("Order Already VOIDED", "error");
      alert("Order Already VOIDED");
      $.LoadingOverlay("hide");
      break;
    case "CANCELLED":
    case "REVERSED":
      addToConsole("Order CANCELLED", "error");
      alert("Order CANCELLED");
      $.LoadingOverlay("hide");
      break;
    case "APPROVED":
      addToConsole("Order APPROVED");
      if (isPollPPOrder) {
        addToConsole("GET Order Response");
        addToConsole(
          "<pre style='height:320px;color:green'>" +
            JSON.stringify(orderResp, null, 2) +
            "</pre>"
        );
      }
      $.LoadingOverlay("hide");
      // call capture Order
      captureOrder(orderId);
      break;
    case undefined:
    case null:
    default:
      let { pollingPreference } = getScriptQueryParam();
      
      if (pollingPreference === "GET_ORDER") {
        setTimeout(function () {
          pollPPGetOrder(orderId, attempts + 1);
        }, 9000);
      } else {
        setTimeout(() => pollOrderStatus(orderId, attempts + 1), 12000);
      }
      break;
  }
}

async function captureOrder(orderId) {
  let { envObj } = getCreateOrderPayload();

  await delay(500);
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
    addToConsole(
      "<pre style='max-height:320px;color:red'>" +
        JSON.stringify(captureOrderResp, null, 2) +
        "</pre>", "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
    return;
  }

  addToConsole(
    "<pre style='height:320px;color:green'>" +
      JSON.stringify(captureOrderResp, null, 2) +
      "</pre>"
  );

  $.LoadingOverlay("hide");
  alert("Order Successful");
}
