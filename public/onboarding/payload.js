
function getScriptQueryParam() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();
  
  return {
    env,
    clientId,
    clientSecret,
  };
}

function getEnvObj() {
  var env = $("[name=environment]").val();
  var clientId = $("[name=clientId]").val().trim();
  var clientSecret = $("[name=clientSecret]").val().trim();

  return {
    clientId,
    clientSecret,
    env,
  };
}




function createPartnerReferralPayload() {
    const partnerReferralObj =  {
      
      // "email": "spp16353@paypal.com",
      // "preferred_language_code": "en-US",
      // "tracking_id": "testents1231222135211221",
      "partner_config_override": {
        "partner_logo_url": "https://www.opencart.com/opencart/application/view/image/logo.png",
        "return_url": "https://testenterprises.com/merchantonboarded",
        "return_url_description": "the url to return the merchant after the paypal onboarding process.",
        "action_renewal_url": "https://testenterprises.com/renew-exprired-url",
        "show_add_credit_card": true
      },
      "operations": [
        {
          "operation": "API_INTEGRATION",
          "api_integration_preference": {
            "rest_api_integration": {
              "integration_method": "PAYPAL",
              "integration_type": "FIRST_PARTY",
              "first_party_details": {
                "features": [
                  "PAYMENT",
                  "REFUND"
                ],
                "seller_nonce": "ARhK2xC8xSvNRphchskRddPDH2rWncfasd-FfasdfPlfdsfasaadfdasfewreqwre127241"
              }
            }
          }
        }
      ],
      "products": [
        "EXPRESS_CHECKOUT"
      ],
      "legal_consents": [
        {
          "type": "SHARE_DATA_CONSENT",
          "granted": true
        }
      ]
    }
    return {partnerReferralObj};
}