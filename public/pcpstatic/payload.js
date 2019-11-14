function getCreateOrderPayload() {
  var amount = $("[name=amount]").val();
  var currency = $("[name=currency]").val();
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val();
  var clientSecret = $("[name=clientSecret]").val();
  var merchantId = $("[name=merchantId]").val();
  var intent = $("[name=intent]:checked").attr("data-value");

  var isShippingPrefillAddressUsed = $(
    "[name=prefill-shipping-address]:checked"
  ).attr("data-value");

  var isBiillingPrefillAddressUsed = $(
    "[name=prefill-billing-address]:checked"
  ).attr("data-value");

  var country = $("[name=country]").val();

  var shippingObj = getInlineGuestShippingDetails(country);

  let shippingAddress = {};

  let billingAddress = {};

  let phoneNo = "";

  if (shippingObj) {
    shippingAddress = {
      address_line_1: shippingObj.line1,
      address_line_2: shippingObj.line2,
      admin_area_2: shippingObj.city,
      admin_area_1: shippingObj.state,
      postal_code: shippingObj.postal_code,
      country_code: country
    };
    phoneNo = shippingObj.phone;

    billingAddress = {
      address_line_1: shippingObj.line1,
      address_line_2: shippingObj.line2,
      admin_area_2: shippingObj.city,
      admin_area_1: shippingObj.state,
      postal_code: shippingObj.postal_code,
      country_code: country
    };
  }

  var orderObj = {
    intent: intent.toUpperCase(),
    payer: {
      name: {
        given_name: "PayPal",
        surname: "Customer"
      },
      address: billingAddress,
      //email_address: "customer@domain.com",
      phone: {
        phone_type: "MOBILE",
        phone_number: {
          national_number: phoneNo
        }
      }
    },
    purchase_units: [
      {
        amount: {
          value: amount.toString(),
          currency_code: currency
        },
        "payee":{
          "merchant_id": merchantId
        },
        shipping: {
          address: shippingAddress
        }
      }
    ],
    application_context: {}
  };

  if (isShippingPrefillAddressUsed == "false") {
    delete orderObj.purchase_units[0].shipping;
  }

  if (isBiillingPrefillAddressUsed == "false") {
    delete orderObj.payer.address;
  }

  var envObj = {
    clientId,
    clientSecret,
    merchantId,
    env
  };

  return { envObj, orderObj };
}

function getScriptQueryParam() {
  var country = $("[name=country]").val();
  var buyercountry = $("[name=buyercountry]").val();
  var lang = $("[name=lang]").val();

  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val();
  var clientSecret = $("[name=clientSecret]").val();
  var merchantId = $("[name=merchantId]").val();
  var customerId = $("[name=customerId]").val();

  var currency = $("[name=currency]").val();
  var setLocale = $("[name=set-locale]:checked").attr("data-value");
  var setBuyerCountry = $("[name=set-buyercountry]:checked").attr("data-value");

  var intent = $("[name=intent]:checked").attr("data-value");

  return {
    env,
    clientId,
    clientSecret,
    country,
    buyercountry,
    lang,
    merchantId,
    customerId,
    currency,
    setLocale,
    setBuyerCountry,
    intent
  };
}


function getEnvObj() {

  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val();
  var clientSecret = $("[name=clientSecret]").val();
  var merchantId = $("[name=merchantId]").val();
  var customerId = $("[name=customerId]").val();

  return { clientId, clientSecret, merchantId, env, customerId };
}