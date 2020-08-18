var childWindowRef;
var CLIENT_ID =
  "AVajOV0VnH8tD0mWYqeWH22uB-DOIWPO5yRzmrqTCOeWx0oopJfeZl6NiL1NAITC3mKiTY1XuAT_mXeh";

async function save() {
  // Load PayPal script dynamically
  try {
    // loader - for demo
    $("#apm-button-container").empty();
    $("#plgStatus").empty();

    let { apm, clientId, clientSecret } = getScriptQueryParam();

    if (clientId !== CLIENT_ID) {
      if (!clientSecret || clientSecret.trim().length === 0) {
        alert(
          " Looks like you have changed the Client Id . Please Enter Client Secret"
        );
        return;
      }
    }

    $.LoadingOverlay("show");

    loadAPMButtons(apm);

    $.LoadingOverlay("hide");
  } catch (error) {
    $.LoadingOverlay("hide");
    alert("some error occurred");
    console.log(error);
  }
}

function loadAPMButtons(fundingSource) {
  try {
    var logoStr =
      fundingSource.slice(0, 1).toUpperCase() + fundingSource.slice(1);

    var button;

    button = document.createElement("button");
    button.style.width = "100%";
    button.style.padding = "10px";
    button.id = "apm-btn";
    button.dataset["source"] = fundingSource;

    if (LOGO_MAP[fundingSource]) {
      let src = LOGO_MAP[fundingSource];

      var img = document.createElement("img");

      button.appendChild(img);

      img.src = src;

      img.onload = function () {
        $.LoadingOverlay("hide");
      };
    } else {
      button.innerHTML = logoStr;
      button.style.fontWeight = "bold";

      $.LoadingOverlay("hide");
    }

    document.getElementById("apm-button-container").appendChild(button);

    document
      .getElementById("apm-btn")
      .addEventListener("click", handleApmClick);
  } catch (err) {
    console.log("Error occurred ", err);
    $.LoadingOverlay("hide");
    alert("some error occurred");
  }
}

async function handleApmClick(e) {
  try {
    // Step 1
    // form payload
    let { envObj, orderObj } = getCreateOrderPayload();

    // Step 2
    // call create order

    $.LoadingOverlay("show", {
      image: "",
      text: "Creating Order...",
      textClass: "loadingText",
    });

    addToConsole("Creating Order");

    addToConsole("Create Order Request");

    addToConsole(
      "<pre style='height:320px;color:green'>" +
        JSON.stringify(orderObj, null, 2) +
        "</pre>"
    );

    let createOrderRespObj = await fetch("/pcp-create-order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        orderObj,
      }),
    });

    let createOrderResp = await createOrderRespObj.json();

    addToConsole("Create order response");

    if (createOrderResp.statusCode > 201) {
      addToConsole(
        "<pre style='max-height:320px;color:red'>" +
          JSON.stringify(createOrderResp, null, 2) +
          "</pre>", "error");
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    addToConsole(
      "<pre style='height:320px;color:green'>" +
        JSON.stringify(createOrderResp, null, 2) +
        "</pre>"
    );

    addToConsole("Order Id : " + createOrderResp.id);

    let orderId = createOrderResp.id;

    $.LoadingOverlay("hide");

    // Step 3
    // call confirm payment source

    await delay(1000);

    $.LoadingOverlay("show", {
      image: "",
      text: "Confirming Payment Source...",
      textClass: "loadingText",
    });

    addToConsole("Confirming Payment Source");

    addToConsole("Confirm Payment Source Request");

    let { confirmPaymentSourceObj } = getConfirmPaymentSourceObj();

    addToConsole(
      "<pre style='height:230px;color:green'>" +
        JSON.stringify(confirmPaymentSourceObj, null, 2) +
        "</pre>"
    );

    let confirmPaymentSourceRespObj = await fetch(
      "/pcp-confirm-payment-source",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          envObj,
          confirmPaymentSourceObj,
          orderId: createOrderResp.id,
        }),
      }
    );

    let confirmPaymentSourceResp = await confirmPaymentSourceRespObj.json();

    addToConsole("Confirm Payment Source response");

    if (confirmPaymentSourceResp.statusCode > 201) {
      addToConsole(
        "<pre style='max-height:320px;color:red'>" +
          JSON.stringify(confirmPaymentSourceResp, null, 2) +
          "</pre>", "error");
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    addToConsole(
      "<pre style='height:320px;color:green'>" +
        JSON.stringify(confirmPaymentSourceResp, null, 2) +
        "</pre>"
    );

    $.LoadingOverlay("hide");

    // Step 4
    // open the redirect url in popup

    let approvalUrl = confirmPaymentSourceResp?.links?.find(
      (l) => l.rel === "payer-action"
    )?.href;
    if (approvalUrl) {
      addToConsole("Approval URL is " + approvalUrl);
      childWindowRef = window.open(
        approvalUrl,
        "approvalWindow",
        "width=1200,height=600,resizable,scrollbars,status"
      );
      
      // Step 5
      // when child window closes , poll get order / local db from webhook to get status

      // Parent window polls for child window to close

      pollPopUp(orderId);
    }
  } catch (error) {
    console.log(error);
    $.LoadingOverlay("hide");
    alert("Error");
  }
}

function pollPopUp(orderId) {
  if (!childWindowRef || childWindowRef.closed) {
    // On child window close. Start polling for status
    addToConsole("Approval Closed");
    addToConsole("Verifying Approval Status");

    // on closing child window, poll order status using pp-getOrder
    $.LoadingOverlay("show", {
      image: "",
      text: "Polling GET Order...",
      textClass: "loadingText",
    });

    pollOrderStatus(orderId);

  } else {
    // keep polling until the child window closes
    setTimeout(() => pollPopUp(orderId), 3000);
  }
}

save();
