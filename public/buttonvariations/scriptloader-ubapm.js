async function save() {
  // Load PayPal script dynamically
  try {
    // loader - for demo
    $("#apm-button").empty();

    if ($ && $.LoadingOverlay) $.LoadingOverlay("show");

    // fallback if loader gets stuck - just for demo
    setTimeout(() => {
      if ($ && $.LoadingOverlay) $.LoadingOverlay("hide");
    }, 12000);

    let { clientId, apm, buyercountry } = getScriptQueryParam();

    loadAPMButtons(apm);

    $.LoadingOverlay("hide");
  } catch (error) {
    if ($ && $.LoadingOverlay) $.LoadingOverlay("hide");
    alert("some error occurred");
    console.log(error);
  }
}

// const FUNDING_LOGOS = {
//   "bancontact" : paypalLogos.BancontactLogo,
//   "paypal" : paypalLogos.PayPalLogo,
//   "alipay": paypalLogos.AlipayLogo,
//   "blik": paypalLogos.BlikLogo,
//   "eps": paypalLogos.

// }
function loadAPMButtons(fundingSource) {
  var logoStr =
    fundingSource.slice(0, 1).toUpperCase() + fundingSource.slice(1) + "Logo";

  var { LOGO_COLOR } = paypalLogos;

  if (paypalLogos[logoStr]) {
    let src = paypalLogos[logoStr]({ logoColor: LOGO_COLOR.DEFAULT }).props.src;

    var img = document.createElement("img");

    var button = document.createElement("button");
    button.style.width = "100%"

    button.appendChild(img);

    img.src = src;

    img.onload = function () {
      document.getElementById("apm-button").appendChild(button);
      $.LoadingOverlay("hide");
    };
  } else {
    var button = document.createElement("button");
    button.innerHTML = logoStr;
    button.style.fontWeight = "bold";
    button.style.width = "100%"
    document.getElementById("apm-button").appendChild(button);
      $.LoadingOverlay("hide");
  }
}
save();