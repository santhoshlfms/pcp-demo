var config = {
  sandbox: {
    //"CLIENT_ID" :"AZN1cfAKLJSwDHfnIks7oGrjriBD3b6HS91ziYeRcKAGLSgQejjJmrPAL501icsygCTya3KJAqqHUDny",
    //"SECRET":"EBex11GdPVHrJ2V0yyr3wj0rg9c8f43KXqMgqys4NOcz49g_ljREUJHaFHJ7F7-wcMTaLgPIzbh3sswg",
    //"CLIENT_ID":"AYDT9tEozAuA53QfD0IoTLxiETetu52UoSb48m_ndpjjmr5w1k1imNdoNEkMACg_rFJwhl6Xp0r3PfH_",
    //"SECRET":"EBOzYhK58t-vvBWsTMNOaM55DDW53XgpjocCbzcJx-6uHumQT6g6V1Xee1X-RH_ln7vEmZ1tiVpLMNWS",
    //"CLIENT_ID" :"AY_7Ot1bDbkeUe0A61I6oaFeBAAu36vOUQ7dJCm7_6aqYdwXjjI_3fb1-tgq43BykTnq4dUg7D2jUZwf",
    //"SECRET":"EHp-nENfthAt7JHBd2eBHEBJA8TN8d11CZ76lVYpybGc7Vy7fhpZz8kxBOo-tlVGn9-_TkCXuBhaNRa0",

    //"MERCHANTID":"Z62HFDE3WU3VJ",
    // "CLIENT_ID":"AT5vIvI-b7hTlfwQQdjf__hhMG489_kxEilxC_AXH2jKH6_E7GjaTPb8ht-CTM5YmW9Zy92HiD4igtXG",
    // "SECRET" : "EFRHK9CFJKH8X1P1CmpG_sGk-S5ScH3Rg-2vGJsYNu9E2mKW4JYca5mdbEl0ccPBbdHQ0DAGus5WcToy",

    MERCHANTID: "3M5SFHD87UCNA",
    PARTNER_MERCHANT_ID: "8KKV5DUPTYP5N",
    CLIENT_ID:
      "AVajOV0VnH8tD0mWYqeWH22uB-DOIWPO5yRzmrqTCOeWx0oopJfeZl6NiL1NAITC3mKiTY1XuAT_mXeh",
    SECRET:
      "EMbNnp1QyetdAdQeWlT1gRbQiQQJ_MnPaLhD2HVMwTjpl3ImYnQcw_6_NOcPCYHiWNQ8gig3E2CDtvg0",
    CLIENT_ID_QRC:
      "AbNRL08wTtob3q0c_q8YjRhRMdkWzJVbotvQx6gxtaHwjW9rFs2bAO_TRt45y2ZUKQnIV4PeqrxjnfQC",
    SECRET_QRC:
      "EL3dr5WB9REy5JmI2gT8T3qRTA-4GC_pgQ69iXqYxQwxVePG-EoiViylA7_M8YysJR5FCgNl5NorDWmv",

    STC: "https://api.sandbox.paypal.com/v1/risk/transaction-contexts/",
    CREATE_ORDER_URL: "https://api.sandbox.paypal.com/v2/checkout/orders",
    GET_ORDER_URL: "https://api.sandbox.paypal.com/v2/checkout/orders/",
    CAPTURE_ORDER_URL: "https://api.sandbox.paypal.com/v2/checkout/orders/",
    AUTH_ORDER_URL: "https://api.sandbox.paypal.com/v2/checkout/orders/",
    CONFIRM_PAYMENT_SOURCE:
      "https://api.sandbox.paypal.com/v2/checkout/orders/",
    CREATE_PARTNER_REFERRAL_URL:
      "https://api.sandbox.paypal.com/v2/customer/partner-referrals/",
    GET_SELLER_CREDENTIALS:
      "https://api.sandbox.paypal.com/v1/customer/partners/",
    CAPTURE_QRC: "https://api.sandbox.paypal.com/v2/retail/captures",
    GET_CAPTURE_QRC:
      "https://api.sandbox.paypal.com/v2/retail/captures?reference_id=",
    CUSTOMER_ID: "CUSTOMER_ID_123456",
    //"CLIENT_ID":"ASuu5Mry_jCK3EWOzhSXAoTFJ0kBe_CNhTE_V68atBPfHMKdyU3FvLe6tVk-DAj43xjxIyZnfm9nXEeu",
    //"SECRET":"EEhN5c_tXXialdxHTcNRVxAs0n3OiS33ndeeCsXkHGzWEtt1QdMtx813-6J4GECKCF9ZGCact-uAX6MN",
    //"CLIENT_ID" :"AUy9j0vE2UevpqIxAR2QsxzDJBM2dB3tBNwe6hLTRFY3DOAI8n1pC3vKmdoWMORxy5YpXWcqF3o0dW3E",
    //"SECRET":"EMv9tv-oRlIQQPkgP1hLW5LYvmW6-rO4XUOybTRKO4-pkOHCazAq-TbJZYHOMHJUWsP-uIrCUQLiUuVV",
    USER_NAME: "Mario1267_api1.gmail.com",
    PASSWORD: "6QT974GBLAVZX5AE",
    SIGNATURE: "AJBjrAOFeBi.IDmiOFQfhCvLWSn0AbNm-He.J4jVOt3DK39k729LW.bx",
    VERSION: "204.0",
    ACCESS_TOKEN_URL: "https://api.sandbox.paypal.com/v1/oauth2/token",
    CREATE_PAYMENT_URL: "https://api.sandbox.paypal.com/v1/payments/payment",
    GET_CLIENT_TOKEN:
      "https://api.sandbox.paypal.com/v1/identity/generate-token",
    SETEC_NVP_URL: "https://api-3t.sandbox.paypal.com/nvp",
    DOEC_NVP_URL: "https://api-3t.sandbox.paypal.com/nvp",
    EXECUTE_PAYMENT_URL:
      "https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}/execute/",
    GET_PAYMENT_DETAILS:
      "https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}",
    CANCEL_URL: "https://ignis.serveo.net/cancel-url",
    RETURN_URL: "https://android-ec-nvp-server.herokuapp.com/execute-payments",
    BN_CODE: "PCP-DEMO-PORTAL",
    GET_VAULT_TOKEN: "https://api.sandbox.paypal.com/v2/vault/payment-tokens",
  },
  production: {
    CLIENT_ID: "",
    SECRET: "",
    CLIENT_ID_QRC: "",
    SECRET_QRC: "",
    MERCHANTID: "RQZ6VZGJNBRG6",
    PARTNER_MERCHANT_ID: "8KKV5DUPTYP5N",
    CREATE_ORDER_URL: "https://api.paypal.com/v2/checkout/orders",
    GET_ORDER_URL: "https://api.paypal.com/v2/checkout/orders/",
    CAPTURE_ORDER_URL: "https://api.paypal.com/v2/checkout/orders/",
    AUTH_ORDER_URL: "https://api.paypal.com/v2/checkout/orders/",
    STC: "https://api.paypal.com/v1/risk/transaction-contexts/",
    CONFIRM_PAYMENT_SOURCE: "https://api.paypal.com/v2/checkout/orders/",
    CREATE_PARTNER_REFERRAL_URL:
      "https://api.paypal.com/v2/customer/partner-referrals/",
    GET_SELLER_CREDENTIALS: "https://api.paypal.com/v1/customer/partners/",
    CAPTURE_QRC: "https://api.paypal.com/v2/retail/captures",
    GET_CAPTURE_QRC: "https://api.paypal.com/v2/retail/captures?reference_id=",
    CUSTOMER_ID: "",
    ACCESS_TOKEN_URL: "https://api.paypal.com/v1/oauth2/token",
    GET_CLIENT_TOKEN: "https://api.paypal.com/v1/identity/generate-token",
    GET_VAULT_TOKEN: "https://api.paypal.com/v2/vault/payment-tokens",
  },
};

exports.getConfig = function (env) {
  console.log("Env loaded is " + env);
  if (config[env]) return config[env];
  return config.sandbox;
};
