function getCreateOrderPayload() {
  var amount = $("[name=amount]").val().trim();
  var currency = $("[name=currency]").val();
  var intent = $("[name=intent]:checked").attr("data-value");

  var isShippingPrefillAddressUsed = $(
    "[name=prefill-shipping-address]:checked"
  ).attr("data-value");

  var isBiillingPrefillAddressUsed = $(
    "[name=prefill-billing-address]:checked"
  ).attr("data-value");

  var country = $("[name=buyercountry]").val();

  var merchantId = $("[name=merchantId]").val().trim();

  var isPartner = $("[name=isPartner]").val() === "Yes";

  var isMSP = $("[name=isMSP]").val() === "Yes";

  var isVaulting = $("[name=vaultingEnabled]").val() === "Yes";

  var components = $("[name=components]:checked")
  .map(function() {
    return this.value;
  })
  .get();

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

  if (!isMSP) {
    merchantId = merchantId.split(",")[0];
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

    if (isPartner) {
      orderObj.purchase_units[0].payee = {
        merchant_id: merchantId,
      };
    }

    if (isShippingPrefillAddressUsed === "false") {
      delete orderObj.purchase_units[0].shipping.address;
    }
    
    if(isShippingPrefillAddressUsed === "true") {
      orderObj.application_context = {
        shipping_preference: "SET_PROVIDED_ADDRESS"
      }
    }
    
    if(isVaulting && isShippingPrefillAddressUsed === "false"
    && components.includes("hosted-fields")
    ) {
      orderObj.application_context = {
        shipping_preference: "NO_SHIPPING"
      }
    }

    if (isBiillingPrefillAddressUsed === "false") {
      delete orderObj.payer.address;
      delete orderObj.payer.phone
    }
  }

  // for MSP
  if (isMSP) {
    orderObj = {
      intent: "CAPTURE",
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
      purchase_units: [],
    };
    if (isBiillingPrefillAddressUsed === "false") {
      delete orderObj.payer.address;
      delete orderObj.payer.phone;
    }

    if(isShippingPrefillAddressUsed === "true") {
      orderObj.application_context = {
        shipping_preference: "SET_PROVIDED_ADDRESS"
      }
    }
    
    if(isVaulting && isShippingPrefillAddressUsed === "false"
    && components.includes("hosted-fields")
    ) {
      orderObj.application_context = {
        shipping_preference: "NO_SHIPPING"
      }
    }
 
    let merchantIDs = merchantId.split(",");
    if (!merchantIDs || merchantIDs.length === 0) {
      alert("Merchant ID is missing");
      return;
    }

    console.log("Merchant IDs ", merchantIDs);

    let totalAmt = +amount;
    let unitsLength = merchantIDs.length;

    const breakIntoParts = (num, parts) => Array.from({length: parts}, (_,i) => 0|(i < num%parts ? num/parts+1 : num/parts))

    let purchaseUnitsAmount = breakIntoParts(totalAmt, unitsLength);

    let purchaseUnits = merchantIDs.map(getPurchaseUnit);

    orderObj.purchase_units.push(...purchaseUnits);

    function getPurchaseUnit (merchantID, index) {
      var unitObj = {
        "reference_id": "PU-"+ merchantID + "-"+Math.random()*100000,
        amount: {
          value: purchaseUnitsAmount[index].toString(),
          currency_code: currency,
          breakdown: {
            item_total: {
              currency_code: currency,
              value: purchaseUnitsAmount[index].toString(),
            },
            tax_total: {
              currency_code: currency,
              value: "0.00",
            },
          },
        },
        payee: {
          merchant_id: merchantID,
        },
        shipping: {
          address: shippingAddress,
          // name: {
          //   full_name :"Arvindan TA"
          // }
        },
        payment_instruction: {
          disbursement_mode: "INSTANT",
          platform_fees: [
            {
              amount: {
                currency_code: "USD",
                value: "1.00",
              },
            },
          ],
        },
        invoice_id: merchantID + "-invoice-" + Math.random() * 100000,
      };

      if (isShippingPrefillAddressUsed === "false") {
        delete unitObj.shipping.address;
      }
      return unitObj;
    };
  
  }
  var envObj = getEnvObj();

  return { envObj, orderObj };
}

function getScriptQueryParam() {
  var buyercountry = $("[name=buyercountry]").val();

  var locale = $("[name=locale]").val();

  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var merchantId = $("[name=merchantId]").val().trim();
  var customerId = $("[name=customerId]").val().trim();

  var currency = $("[name=currency]").val();
  var setLocale = $("[name=set-locale]:checked").attr("data-value");
  var setBuyerCountry = $("[name=set-buyercountry]:checked").attr("data-value");

  var isPartner = $("[name=isPartner]").val() === "Yes";
  var intent = $("[name=intent]:checked").attr("data-value");
  var isVaulting = $("[name=vaultingEnabled]").val() === "Yes";
  var isMSP = $("[name=isMSP]").val() === "Yes";

  if(!isMSP) {
    merchantId = merchantId.split(",")[0];
  }

  return {
    env,
    clientId,
    clientSecret,
    buyercountry,
    locale,
    merchantId,
    customerId,
    currency,
    setLocale,
    setBuyerCountry,
    intent,
    isPartner,
    isVaulting,
    isMSP,
  };
}

function getEnvObj() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var merchantId = $("[name=merchantId]").val().trim();
  var customerId = $("[name=customerId]").val().trim();
  var isPartner = $("[name=isPartner]").val() === "Yes";
  var isVaulting = $("[name=vaultingEnabled]").val() === "Yes";
  var isMSP = $("[name=isMSP]").val() === "Yes";

  if(!isMSP) {
    merchantId = merchantId.split(",")[0];
  }

  return {
    clientId,
    clientSecret,
    merchantId,
    env,
    customerId,
    isPartner,
    isVaulting,
    isMSP,
  };
}
