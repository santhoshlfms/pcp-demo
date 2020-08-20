var CLIENT_ID =
  "AVajOV0VnH8tD0mWYqeWH22uB-DOIWPO5yRzmrqTCOeWx0oopJfeZl6NiL1NAITC3mKiTY1XuAT_mXeh";

async function save() {
  // Render sign up link dynamically
  $("#plgStatus").empty();

  let { clientId, clientSecret } = getScriptQueryParam();

  let envObj = getEnvObj();

  if (clientId !== CLIENT_ID) {
    if (!clientSecret || clientSecret.trim().length === 0) {
      alert(
        " Looks like you have changed the Client Id . Please Enter Client Secret"
      );
      return;
    }
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

  addToConsole("Create Partner Referral response");

  if (createPartnerReferralResp.statusCode > 201) {
    addToConsole(
      "<pre style='max-height:320px;color:red'>" +
        JSON.stringify(createPartnerReferralResp, null, 2) +
        "</pre>", "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
    return;
  }

  addToConsole(
    "<pre style='height:320px;color:green'>" +
      JSON.stringify(createPartnerReferralResp, null, 2) +
      "</pre>"
  );

  let actionUrl = createPartnerReferralResp?.links?.find(
    (l) => l.rel === "action_url"
  )?.href;

  let container = document.getElementById("onboarding-button-container");

  let link = document.createElement("a");
  
  link.dataset.target="_blank";
  link.dataset["paypalOnboardComplete"] = "onboardedCallback";
  link.href=`${actionUrl}&displayMode=minibrowser`;
  link.dataset["paypalButton"] = "true";
  link.innerHTML = "Sign up for PayPal";
  container.appendChild(link);

  let script = document.createElement("script");
  script.id="paypal-js";
  script.type = "application/javascript";
  script.src = "https://www.sandbox.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js";
  
  document.body.appendChild(script);

  script.onload = () => {
    $.LoadingOverlay("hide");
  }

  script.onerror = () => {
    addToConsole("Some Error Occurred ", "error");
    $.LoadingOverlay("hide");
    alert("Error Occurred");
  }



}

function onboardedCallback(authCode, sharedId) {

  console.log(authCode, sharedId);
alert("fddd")
}

save();