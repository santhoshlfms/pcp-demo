var timerId = null;

var CLIENT_ID = "AVajOV0VnH8tD0mWYqeWH22uB-DOIWPO5yRzmrqTCOeWx0oopJfeZl6NiL1NAITC3mKiTY1XuAT_mXeh";

async function loadPPAndHostedJS(type) {
  var isLoaded = false;

  // handle error if the JS script doesn't load after a specific time
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    $.LoadingOverlay("hide");
    if (!isLoaded) {
      addToConsole(
        "Some error has occurred . Please check your configurations ",
        "error"
      );
      alert("Some error has occurred . Please check your configurations ");
    }
  }, 15000);

  try {
    var elem = document.getElementById("ppscript");

    let {
      env,
      clientId,
      clientSecret,
      buyercountry,
      
      // country,
      // lang,
      locale,
      merchantId,
      customerId,
      currency,
      setLocale,
      setBuyerCountry,
      intent,
      isPartner,
      isVaulting,
      isMSP
    } = getScriptQueryParam();

    $("#paypal-button").empty();
    $("#paypal-button").hide();
    $("#hcontainer").empty();

    if (elem) elem.parentNode.removeChild(elem);

    let envObj = getEnvObj();

    if (isVaulting && !customerId) {
      alert("Enter Customer Id");
      return;
    }

    if (isPartner && !merchantId) {
      alert("Enter Merchant Id");
      return;
    }

    if (isMSP && !isPartner) {
      alert("MSP is applicable only for Partner");
      return;
    }

    if (isMSP && !merchantId) {
      alert("Enter Merchant Id");
      return;
    }

    if (isMSP && merchantId && merchantId.split(",").length < 2) {
      alert("Enter Multiple Merchant Ids for MSP");
      return;
    }

    $.LoadingOverlay("show");
    
    let components = type;

    if (type == "both") {
      components = "buttons,hosted-fields";
    }
    let clientToken = "";

    let shouldFetchClientToken =
      isVaulting || components.indexOf("hosted-fields") > -1;

     if (shouldFetchClientToken) {
       let clientTokenRespJson = await fetch("/pcp-get-client-token", {
         method: "POST",
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
         },
         body: JSON.stringify({
           envObj
         })
       });

       let clientTokenResp = await clientTokenRespJson.json();

       console.log(clientTokenResp);
       if (!clientTokenResp.status || !clientTokenResp.clientToken) {
         alert(
           "Some Error Occured in loading Hosted fields. Check the configuration"
         );
         addToConsole(
           "Some Error Occured in loading Hosted fields. Check the configuration",
           "error"
         );
         addToConsole(JSON.stringify(clientTokenResp.error));
         $.LoadingOverlay("hide");
         return;
       }

       clientToken = clientTokenResp.clientToken;
     }

    var file = `https://www.paypal.com/sdk/js?client-id=${clientId}&commit=true&components=${components}&debug=false&currency=${currency}`;

    file += `&intent=${intent}`;

    if (isPartner) {
      if(isMSP) {
        file += `&merchant-id=*`;
      } else {
        file += `&merchant-id=${merchantId}`;
      }
    }

    if (setLocale == "true") {
      file += `&locale=${locale}`;
    }

    if (setBuyerCountry == "true") {
      if(env == "sandbox")
        file += `&buyer-country=${buyercountry}`;
      else 
      alert("Buyer Country cannot be used in Live");
    }

    var jsElm = document.createElement("script");
    jsElm.type = "application/javascript";
    jsElm.src = file;
    jsElm.id = "ppscript";

    if (shouldFetchClientToken) jsElm.dataset["clientToken"] = clientToken;

     if(isPartner) {
       jsElm.dataset["merchantId"] = merchantId;
     }

    document.body.appendChild(jsElm);

    jsElm.onload = function() {
      if (type == "buttons") renderPPButton();
      else if (type == "hosted-fields") renderHostedButton();
      else if (type == "both") {
        renderPPButton();
        renderHostedButton();
      }

      setTimeout(function() {
        $.LoadingOverlay("hide");
        isLoaded = true;
      }, 4000);
    };
  } catch (err) {
    console.log("Error ", err);
    $.LoadingOverlay("hide");
    addToConsole("ERROR - " + err.message, "error");
    alert(
      "Some error has occurred in loading PP Buttons / Hosted Fields. Please check your configurations "
    );
    throw err;
  }
}

function save() {
  $("#plgStatus").empty();


  let {
    clientId,
    clientSecret,
  } = getScriptQueryParam();

  if(clientId !== CLIENT_ID) {
    if(!clientSecret || clientSecret.trim().length === 0) {
      alert(" Looks like you have changed the Client Id . Please Enter Client Secret");
      return;
    }
    return;
  }

  var components = $("[name=components]:checked")
    .map(function() {
      return this.value;
    })
    .get();

  console.log(components);

  if (!components || components.length == 0) {
    alert("Please select atleast one Component");
    return;
  }

  if (components && components.length == 1) {
    if (components.includes("buttons")) {
      loadPPAndHostedJS("buttons");
    } else if (components.includes("hosted-fields")) {
      loadPPAndHostedJS("hosted-fields");
    }
  } else {
    loadPPAndHostedJS("both");
  }
}

function addToConsole(msg, state) {
  if (!state)
    $("#plgStatus").append(
      "<span style='color:green'>" +
        msg +
        "</span><span style='float:right'>" +
        moment(new Date()).format("HH:mm:ss a") +
        "</span>"
    );
  else
    $("#plgStatus").append(
      "<span style='color:red'>" +
        msg +
        "</span><span style='float:right'>" +
        moment(new Date()).format("HH:mm:ss a") +
        "</span>"
    );

  $("#plgStatus").append("<br/><br/>");
}

window.onerror = function(message, url, line, column, error) {
  $.LoadingOverlay("hide");
  console.log("Uncaught error" + message + " " + error);
  $("#paypal-error-container").html(
    "<br/>Error Occurred while rendering buttons."
  );
};
