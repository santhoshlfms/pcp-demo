function getCreateOrderPayload() {
  var amount = $("[name=amount]").val().trim();
  var currency = $("[name=currency]").val();
  var intent = "capture";

  var addressPreference = $("[name=address-preference]:checked").attr(
    "data-value"
  );
  var country = $("[name=buyercountry]").val();

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

  var orderObj = {};

  orderObj = {
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
          breakdown: {
            item_total: {
              currency_code: currency,
              value: amount.toString(),
            },
            tax_total: {
              currency_code: currency,
              value: "0.00",
            },
          },
        },
        shipping: {
          address: shippingAddress,
          // name: {
          //   full_name :"Arvindan TA"
          // }
        },
      },
    ],
  };

  
  if (addressPreference === "NO_SHIPPING") {
    delete orderObj.purchase_units[0].shipping.address;
    delete orderObj.payer.address;
    delete orderObj.payer.phone;
  }

  if (addressPreference === "SET_PROVIDED_ADDRESS") {
    orderObj.application_context = {
      shipping_preference: "SET_PROVIDED_ADDRESS",
    };
  }

  if (addressPreference === "GET_FROM_FILE") {
    orderObj.application_context = {
      shipping_preference: "GET_FROM_FILE",
    };
  }

  var envObj = getEnvObj();

  return { envObj, orderObj };
}

function getScriptQueryParam() {
  var buyercountry = $("[name=buyercountry]").val();
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var apm = $("[name=apm]").val();
  var currency = $("[name=currency]").val();
  var addressPreference = $("[name=address-preference]:checked").attr(
    "data-value"
  );

  return {
    env,
    clientId,
    clientSecret,
    buyercountry,
    currency,
    apm,
    addressPreference,
  };
}

function getEnvObj() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var apm = $("[name=apm]").val();

  return {
    clientId,
    clientSecret,
    env,
    apm,
  };
}
