function getCreateOrderPayload() {
  var amount = $("[name=amount]").val();
  var currency = $("[name=currency]").val();
  var intent = $("[name=intent]:checked").attr("data-value");

  var isShippingPrefillAddressUsed = $(
    "[name=prefill-shipping-address]:checked"
  ).attr("data-value");

  var isBiillingPrefillAddressUsed = $(
    "[name=prefill-billing-address]:checked"
  ).attr("data-value");

  var country = $("[name=buyercountry]").val();
  var merchantId = $("[name=merchantId]").val();

  var isPartner = $("[name=isPartner]").val() == "Yes";

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
      country_code: country,
    };
    phoneNo = shippingObj.phone;

    billingAddress = {
      address_line_1: shippingObj.line1,
      address_line_2: shippingObj.line2,
      admin_area_2: shippingObj.city,
      admin_area_1: shippingObj.state,
      postal_code: shippingObj.postal_code,
      country_code: country,
    };
  }

  var orderObj = {
    intent: intent.toUpperCase(),
    payer: {
      // name: {
      //   "given_name": "Arvindan",
      //   "surname": "TA",
      // },

      address: billingAddress,
      email_address: "spp1@paypal.com",
      phone: {
        phone_type: "MOBILE",
        phone_number: {
          national_number: phoneNo,
        },
      },
    },
    purchase_units: [
      {
        amount: {
          value: amount.toString(),
          currency_code: currency,
          "breakdown": {
            "item_total": {
              "currency_code": currency,
              "value": amount.toString()
            },
            "tax_total": {
              "currency_code": currency,
              "value": "0.00"
            },
          }
        },
        shipping: {
          address: shippingAddress,
          // name: {
          //   full_name :"Arvindan TA"
          // }
        },
      },
    ]
  };

  if (isPartner) {
    orderObj.purchase_units[0].payee = {
      merchant_id: merchantId,
    };
  }
  
  if (isShippingPrefillAddressUsed == "false") {
    delete orderObj.purchase_units[0].shipping;
  }

  if (isBiillingPrefillAddressUsed == "false") {
    delete orderObj.payer.address;
  }

  var envObj = getEnvObj();

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

  var isPartner = $("[name=isPartner]").val() == "Yes";
  var intent = $("[name=intent]:checked").attr("data-value");
  var isVaulting = $("[name=vaultingEnabled]").val() == "Yes";

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
    intent,
    isPartner,
    isVaulting,
  };
}

function getEnvObj() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val();
  var clientSecret = $("[name=clientSecret]").val();
  var merchantId = $("[name=merchantId]").val();
  var customerId = $("[name=customerId]").val();
  var isPartner = $("[name=isPartner]").val() == "Yes";
  var isVaulting = $("[name=vaultingEnabled]").val() == "Yes";

  return {
    clientId,
    clientSecret,
    merchantId,
    env,
    customerId,
    isPartner,
    isVaulting,
  };
}
