var CLIENT_ID =
  "AVajOV0VnH8tD0mWYqeWH22uB-DOIWPO5yRzmrqTCOeWx0oopJfeZl6NiL1NAITC3mKiTY1XuAT_mXeh";

var k = 1;
async function save() {
  // Render sign up link dynamically
  $("#plgStatus").empty();
  document.querySelector(".msg").style.display = "none";
  if ($("#onboarding-button-container"))
    $("#onboarding-button-container").remove();

  document.body.classList = "";

  var elem = document.getElementById("paypal-js");
  if (elem) elem.parentNode.removeChild(elem);
  elem = document.getElementById("signup-js");
  if (elem) elem.parentNode.removeChild(elem);
  elem = document.getElementById("biz-js");
  if (elem) elem.parentNode.removeChild(elem);

  let {
    clientId,
    clientSecret,
    trackingId
  } = getScriptQueryParam();

  let envObj = getEnvObj();

  if (clientId !== CLIENT_ID) {
    if (!clientSecret || clientSecret.trim().length === 0) {
      alert(
        " Looks like you have changed the Client Id . Please Enter Client Secret"
      );
      return;
    }
  }

  if (!trackingId || trackingId.length < 44) {
    alert("Please Enter Tracking Id with minimum of 44 characters");
    return;
  }

  $.LoadingOverlay("show", {
    image: "",
    text: "Calling Partner Referral API...",
    textClass: "loadingText",
  });

  // step 1
  // get partner referral payload

  let { partnerReferralObj } = createPartnerReferralPayload();

  // step 2
  // call create partner referral api

  addToConsole("Call Create Partner Referral API");

  addToConsole("Create Partner Referral Request Payload");

  addToConsole(
    "<pre style='max-height:400px;color:green'>" +
      JSON.stringify(partnerReferralObj, null, 2) +
      "</pre>"
  );

  let createPartnerReferralRespObj = await fetch(
    "/pcp-create-partner-referral",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        partnerReferralObj,
      }),
    }
  );

  let createPartnerReferralResp = await createPartnerReferralRespObj.json();

  addToConsole("Create Partner Referral API response");

  if (createPartnerReferralResp.statusCode > 201) {
    addToConsole(
      "<pre style='max-height:400px;color:red'>" +
        JSON.stringify(createPartnerReferralResp, null, 2) +
        "</pre>",
      "error"
    );
    $.LoadingOverlay("hide");
    alert("Error Occurred");
    return;
  }

  addToConsole(
    "<pre style='max-height:400px;color:green'>" +
      JSON.stringify(createPartnerReferralResp, null, 2) +
      "</pre>"
  );

  let actionUrl = createPartnerReferralResp?.links?.find(
    (l) => l.rel === "action_url"
  )?.href;

  let divContainer = document.createElement("div");
  divContainer.id = "onboarding-button-container";
  divContainer.classList = "size";

  document.getElementById("statusContainer").prepend(divContainer);

  await delay(400);

  let container = document.getElementById("onboarding-button-container");

  let link = document.createElement("a");

  link.dataset.target = "_blank";
  link.id = "ppbutton";

  window.onSignUpCallback = _.once(onboardedCallback);

  link.dataset["paypalOnboardComplete"] = "onSignUpCallback";
  link.dataset["paypalPopupClose"] = "onClosePopup";

  link.href = `${actionUrl}&displayMode=minibrowser`;
  link.dataset["paypalButton"] = "true";
  link.innerHTML = "Sign up for PayPal";
  container.appendChild(link);

  let script = document.createElement("script");
  script.id = "paypal-js";
  script.type = "application/javascript";
  script.src =
    "https://www.sandbox.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js";

  document.body.appendChild(script);

  script.onload = async () => {
    document.querySelector("#ppbutton").style.display = "flex";
    document.querySelector(".closemsg").style.display = "flex";
    await delay(1500);
    $.LoadingOverlay("hide");
  };

  script.onerror = () => {
    addToConsole("Some Error Occurred ", "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
  };
}

async function onboardedCallback(authCode, sharedId) {
  try {
    console.log(authCode, sharedId);

    addToConsole("<b>Auth Code : " + authCode + "</b>");
    addToConsole("<b>Shared Id : " + sharedId + "</b>");

    // Get seller access token using authcode and sharedId

    await delay(2000);

    $.LoadingOverlay("show", {
      image: "",
      text: "Calling Get Seller Access Token API...",
      textClass: "loadingText",
    });

    let envObj = getEnvObj();

    addToConsole("Calling Get Seller Access Token API");

    let sellerAccessTokenObj = {
      sharedId: sharedId,
      authCode: authCode,
      sellerNonce: envObj.trackingId,
    };

    let sellerAccessTokenRespObj = await fetch("/pcp-seller-accesstoken", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        sellerAccessTokenObj,
      }),
    });

    let sellerAccessTokenResp = await sellerAccessTokenRespObj.json();

    addToConsole("Get Seller Access token API response");

    if (sellerAccessTokenResp.statusCode > 201) {
      addToConsole(
        "<pre style='max-height:350px;color:red'>" +
          JSON.stringify(sellerAccessTokenResp, null, 2) +
          "</pre>",
        "error"
      );
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    addToConsole(
      "<pre style='max-height:350px;color:green'>" +
        JSON.stringify(sellerAccessTokenResp, null, 2) +
        "</pre>"
    );

    let sellerAccessToken = sellerAccessTokenResp.access_token;

    addToConsole("<b>Seller Access Token : " + sellerAccessToken+"</b>");

    $.LoadingOverlay("hide");

    // Use seller access token to get the credentials

    await delay(1000);

    $.LoadingOverlay("show", {
      image: "",
      text: "Calling Get Seller Credentials API...",
      textClass: "loadingText",
    });

    addToConsole("Calling Get Seller Credentials API");

    let sellerCredentialsObj = {
      partnerMerchantId: envObj.partnerMerchantId,
      sellerAccessToken,
    };

    let sellerCredentialsRespObj = await fetch("/pcp-seller-credentials", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        envObj,
        sellerCredentialsObj,
      }),
    });

    let sellerCredentialsResp = await sellerCredentialsRespObj.json();

    addToConsole("Get Seller Credentials API response");

    if (sellerCredentialsResp.statusCode > 201) {
      addToConsole(
        "<pre style='max-height:350px;color:red'>" +
          JSON.stringify(sellerCredentialsResp, null, 2) +
          "</pre>",
        "error"
      );
      $.LoadingOverlay("hide");
      alert("Error Occurred");
      return;
    }

    addToConsole(
      "<pre style='max-height:350px;color:green'>" +
        JSON.stringify(sellerCredentialsResp, null, 2) +
        "</pre>"
    );

    let { client_id, client_secret } = sellerCredentialsResp;

    addToConsole("<b>Seller CLIENT ID : " + client_id + "</b>");
    addToConsole("<b>Seller CLIENT Secret : " + client_secret+ "</b>");

    $.LoadingOverlay("hide");

    alert("Got Seller Credentials");

    await delay(500);
    doCleanup();
  } catch (err) {
    console.log(err);
    addToConsole("Some Error Occurred ", "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
  }
}

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}

function onClosePopup(param) {
  console.log("PopUp closed");
}

function doCleanup() {
  // remove event listeners on popup and do cleanup
  k++;
  window.onSignUpCallback = {};
  document.querySelector("#ppbutton").style.display = "none";
  document.querySelector(".closemsg").style.display = "none";
  document.querySelector(".msg").style.display = "flex";
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
