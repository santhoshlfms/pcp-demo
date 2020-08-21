function getScriptQueryParam() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var emailAddress = $("[name=emailAddress]").val().trim();
  var trackingId = $("[name=trackingId]").val().trim();
  var partnerMerchantId = $("[name=partnerMerchantId]").val().trim();

  return {
    env,
    clientId,
    clientSecret,
    emailAddress,
    trackingId,
    partnerMerchantId
  };
}

function getEnvObj() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  var trackingId = $("[name=trackingId]").val().trim();
  var partnerMerchantId = $("[name=partnerMerchantId]").val().trim();

  return {
    clientId,
    clientSecret,
    env,
    trackingId,
    partnerMerchantId
  };
}

function createPartnerReferralPayload() {
  let { emailAddress, trackingId } = getScriptQueryParam();

  const partnerReferralObj = {
    email: emailAddress || "spp16353@paypal.com",
    preferred_language_code: "en-US",
    tracking_id: trackingId || "testents123122213521122112",
    partner_config_override: {
      partner_logo_url:
        "https://pp-product-demo.herokuapp.com/images/GPSLogo.png",
      show_add_credit_card: true,
    },
    operations: [
      {
        operation: "API_INTEGRATION",
        api_integration_preference: {
          rest_api_integration: {
            integration_method: "PAYPAL",
            integration_type: "FIRST_PARTY",
            first_party_details: {
              features: ["PAYMENT", "REFUND"],
              seller_nonce:
                trackingId ||
                "ARhK2xC8xSvNRphchskRddPDH2rWncfasd-FfasdfPlfdsfasaadfdasfewreqwre127241",
            },
          },
        },
      },
    ],
    products: ["PPCP"],
    legal_consents: [
      {
        type: "SHARE_DATA_CONSENT",
        granted: true,
      },
    ],
  };
  return { partnerReferralObj };
}
