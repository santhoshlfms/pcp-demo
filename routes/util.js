const request = require("request");
const jwt = require("jsonwebtoken");

function getAuthAssertion(apiConfiguration) {
  var token = jwt.sign(
    { iss: apiConfiguration.CLIENT_ID, payer_id: apiConfiguration.MERCHANTID },
    null,
    { algorithm: "none" }
  );
  console.log("Get Auth Assertion value for " + apiConfiguration.MERCHANTID);
  console.log("Auth Assertion " + token);
  return token;
}

function getAccessToken(apiConfiguration) {
  return new Promise((resolve, reject) => {
    var token = apiConfiguration.CLIENT_ID + ":" + apiConfiguration.SECRET,
      encodedKey = new Buffer(token).toString("base64"),
      payload =
        "grant_type=client_credentials&Content-Type=application%2Fx-www-form-urlencoded&response_type=token&return_authn_schemes=true&ignoreCache=true";

    var options = {
      method: "POST",
      url: apiConfiguration.ACCESS_TOKEN_URL,
      headers: {
        authorization: "Basic " + encodedKey,
        accept: "application/json",
        "accept-language": "en_US",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: payload,
    };

    if (apiConfiguration.isPartner) {
      options.headers["PayPal-Partner-Attribution-Id"] =
        apiConfiguration.BN_CODE;
    }

    request(options, function (error, response, body) {
      if (error) {
        console.log(
          "Error in getting access token from api " + JSON.stringify(error)
        );
        return resolve({
          accessToken: "",
          status: false,
          error: error,
          statusCode: response.statusCode,
        });
      } else {
        try {
          let accessToken = JSON.parse(body).access_token;
          if (accessToken) {
            console.log("Found Access Token");
            return resolve({
              accessToken,
              status: true,
              error: null,
              statusCode: response.statusCode,
            });
          } else {
            return resolve({
              accessToken: "",
              status: false,
              error: JSON.parse(body),
              statusCode: response.statusCode,
            });
          }
        } catch (err) {
          console.log(
            "Error in Parsing Access Token response " + JSON.stringify(err)
          );
          return resolve({
            accessToken: "",
            status: false,
            error: err,
            statusCode: 500,
            headers: {},
          });
        }
      }
    });
  });
}

function getOrder(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.get(
        apiConfiguration.GET_ORDER_URL + apiConfiguration.orderId,
        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              getOrderResp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
          console.log("*** GET Order Response ***");
          console.log(body);
          let getOrderResp = body;
          return resolve({
            getOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling get orders api " + JSON.stringify(err)
      );
      return resolve({
        getOrderResp: err,
        status: false,
        error: err,
        statusCode: response.statusCode,
        headers: response.headers,
      });
    }
  });
}

function createOrder(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        body: apiConfiguration.payload,
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.post(apiConfiguration.CREATE_ORDER_URL, options, function (
        err,
        response,
        body
      ) {
        if (err) {
          console.error(err);
          return resolve({
            orderResp: err,
            status: false,
            error: err,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
        console.log("*** Create Order Response ***");
        console.log(body);
        let orderResp = body;

        // // STC API Call
        // console.log("Before calling STC API");
        // var stcOptions = {
        //   headers: {
        //     'content-type': "application/json",
        //     'authorization': "Bearer "+accessToken,
        //   },
        //   body: {
        //     "additional_data": [
        //     {
        //       "key": "sender_account_id",
        //       "value": "A12345N343"
        //     },
        //     {
        //       "key": "sender_first_name",
        //       "value": "Saurabh"
        //     },
        //     {
        //       "key":"sender_last_name",
        //       "value":"Nigam"
        //     },
        //     {
        //       "key":"sender_email",
        //       "value":"saunig+1@gmail.com"
        //     },
        //     {
        //       "key":"sender_country_code",
        //       "value":"IN"
        //     }]

        //   },
        //   json: true
        // };

        // if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        //   stcOptions.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
        // }

        // request.put(apiConfiguration.STC +apiConfiguration.MERCHANTID+ '/'+body.id, stcOptions ,function (err, response, body) {
        //     if (err) {
        //       console.error("Error in calling STC API "+ err);
        //       return resolve({
        //         orderResp: null,
        //         status: false,
        //         error: err
        //       })
        //     }
        //     console.log("After calling STC API");
        //     console.log ("Order ID is :"+orderResp.id);
        //     return resolve({
        //       orderResp,
        //       status: true,
        //       error: null
        //     })
        // });

        console.log("Order ID is :" + orderResp.id);
        return resolve({
          orderResp,
          status: true,
          error: null,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      });
    } catch (err) {
      console.log(
        "Some Error occurred in calling create orders api " +
          JSON.stringify(err)
      );
      return resolve({
        orderResp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function captureOrder(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        json: true,
        body: {},
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.post(
        apiConfiguration.CAPTURE_ORDER_URL +
          apiConfiguration.orderId +
          "/capture",
        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              captureOrderResp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
          console.log("*** Capture Order Response ***");
          console.log(body);
          let captureOrderResp = body;
          return resolve({
            captureOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling capture orders api " +
          JSON.stringify(err)
      );
      return resolve({
        captureOrderResp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function authOrder(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        json: true,
        body: {},
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.post(
        apiConfiguration.AUTH_ORDER_URL +
          apiConfiguration.orderId +
          "/authorize",
        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              authOrderResp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
          console.log("*** Auth Order Response ***");
          console.log(body);
          let authOrderResp = body;
          return resolve({
            authOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling auth orders api " + JSON.stringify(err)
      );
      return resolve({
        authOrderResp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function getClientToken(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: apiConfiguration.GET_CLIENT_TOKEN,
      headers: {
        authorization: "Bearer " + accessToken,
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      json: true,
    };
    console.log("Is Partner " + apiConfiguration.isPartner);

    console.log("Is MSP " + apiConfiguration.isMSP);

    if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
      options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
        apiConfiguration
      );
    }

    console.log("Is Vaulting Enabled " + apiConfiguration.isVaulting);

    if (apiConfiguration.isVaulting) {
      options.body = {
        customer_id: apiConfiguration.CUSTOMER_ID,
      };
    }

    console.log("CUSTOMER_ID ", apiConfiguration.CUSTOMER_ID);

    request(options, function (error, response, body) {
      if (error) {
        console.log(
          "Error in getting client token from api " + JSON.stringify(error)
        );
        return resolve({
          clientToken: "",
          status: false,
          error: error,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      } else {
        try {
          let clientTokenResp = body;
          console.log(
            "Client Token response is " + JSON.stringify(clientTokenResp)
          );
          if (clientTokenResp && clientTokenResp.client_token) {
            console.log("Found Client Token");
            return resolve({
              clientToken: clientTokenResp.client_token,
              status: true,
              error: null,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          } else {
            return resolve({
              clientToken: "",
              status: false,
              error: body,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
        } catch (err) {
          console.log(
            "Error in Parsing Client Token response " + JSON.stringify(err)
          );
          return resolve({
            clientToken: "",
            status: false,
            error: err,
            statusCode: 500,
            headers: {},
          });
        }
      }
    });
  });
}

function confirmPaymentSource(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      let payload = apiConfiguration.payload;

      console.log(" Payload Confirm Order ", JSON.stringify(payload));

      options.body = payload;

      request.post(
        apiConfiguration.CONFIRM_PAYMENT_SOURCE +
          apiConfiguration.orderId +
          "/confirm-payment-source/",

        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              orderResp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }

          console.log("*** Confirm Payment Source Response ***");

          console.log(JSON.stringify(body));

          let orderResp = body;

          console.log("Order ID is :" + orderResp.id);

          return resolve({
            orderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling confirm payment source api " +
          JSON.stringify(err)
      );
      return resolve({
        orderResp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function createPartnerReferral(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        body: apiConfiguration.payload,
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.post(
        apiConfiguration.CREATE_PARTNER_REFERRAL_URL,
        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              resp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
          console.log("*** Create Partner Referral Response ***");
          console.log(body);
          let resp = body;

          console.log(
            "Create Partner Referral Response ",
            JSON.stringify(resp)
          );

          return resolve({
            resp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling create partner referral api " +
          JSON.stringify(err)
      );
      return resolve({
        resp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function getSellerAccessToken(apiConfiguration) {
  return new Promise((resolve, reject) => {
    var payload = `grant_type=authorization_code&code=${apiConfiguration.payload.authCode}&code_verifier=${apiConfiguration.payload.sellerNonce}&ignoreCache=true`;

    var options = {
      method: "POST",
      url: apiConfiguration.ACCESS_TOKEN_URL,
      headers: {
        accept: "application/json",
        "accept-language": "en_US",
        "content-type": "application/x-www-form-urlencoded",
      },

      auth: {
        user: apiConfiguration.payload.sharedId,
        pass: "",
      },
      body: payload,
    };

    if (apiConfiguration.isPartner) {
      options.headers["PayPal-Partner-Attribution-Id"] =
        apiConfiguration.BN_CODE;
    }

    request(options, function (error, response, body) {
      if (error) {
        console.log(
          "Error in getting Seller access token from api " +
            JSON.stringify(error)
        );
        return resolve({
          resp: error,
          status: false,
          error: error,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      } else {
        try {
          let accessToken = JSON.parse(body).access_token;
          if (accessToken) {
            console.log("Found Seller Access Token");
            return resolve({
              resp: JSON.parse(body),
              status: true,
              error: null,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          } else {
            return resolve({
              resp: JSON.parse(body),
              status: false,
              error: JSON.parse(body),
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
        } catch (err) {
          console.log(
            "Error in Parsing Seller Access Token response " +
              JSON.stringify(err)
          );
          return resolve({
            resp: err,
            status: false,
            error: err,
            statusCode: 500,
            headers: {},
          });
        }
      }
    });
  });
}

function getSellerCredentials(apiConfiguration) {
  return new Promise((resolve, reject) => {
    console.log(apiConfiguration.payload);
    var options = {
      method: "GET",
      url:
        apiConfiguration.GET_SELLER_CREDENTIALS +
        apiConfiguration.payload.partnerMerchantId +
        "/merchant-integrations/credentials/",
      headers: {
        authorization: "Bearer " + apiConfiguration.payload.sellerAccessToken,
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      json: true,
      body: {},
    };

    if (apiConfiguration.isPartner) {
      options.headers["PayPal-Partner-Attribution-Id"] =
        apiConfiguration.BN_CODE;
    }

    request(options, function (error, response, body) {
      if (error) {
        console.log(
          "Error in getting Seller Credentials" + JSON.stringify(error)
        );
        return resolve({
          resp: error,
          status: false,
          error: error,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      } else {
        try {
          console.log("GET Seller Credentials api response ");
          console.log(JSON.stringify(body));
          return resolve({
            resp: body,
            status: true,
            error: body,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        } catch (err) {
          console.log(
            "Error in Parsing Get Seller Credentials response " +
              JSON.stringify(err)
          );
          return resolve({
            resp: err,
            status: false,
            error: err,
            statusCode: 500,
            headers: {},
          });
        }
      }
    });
  });
}

function captureQRC(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
          "PayPal-Request-Id": apiConfiguration.requestId,
        },
        body: apiConfiguration.payload,
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.post(apiConfiguration.CAPTURE_QRC, options, function (
        err,
        response,
        body
      ) {
        if (err) {
          console.error(err);
          return resolve({
            resp: err,
            status: false,
            error: err,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
        console.log("*** CAPTURE QRC DETAILS Response ***");
        console.log(body);
        let resp = body;
        return resolve({
          resp,
          status: true,
          error: null,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      });
    } catch (err) {
      console.log(
        "Some Error occurred in calling capture qrc details api " +
          JSON.stringify(err)
      );
      return resolve({
        resp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function getCaptureQRCDetails(accessToken, apiConfiguration) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + accessToken,
          "PayPal-Request-Id": apiConfiguration.requestId,
        },
        json: true,
      };

      console.log("Is Partner " + apiConfiguration.isPartner);
      console.log("Is MSP " + apiConfiguration.isMSP);

      if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
          apiConfiguration
        );
      }

      request.get(
        apiConfiguration.GET_CAPTURE_QRC + apiConfiguration.reference_id,
        options,
        function (err, response, body) {
          if (err) {
            console.error(err);
            return resolve({
              resp: err,
              status: false,
              error: err,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
          console.log("*** GET CAPTURE QRC DETAILS Response ***");
          console.log(body);
          let resp = body;
          return resolve({
            resp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers,
          });
        }
      );
    } catch (err) {
      console.log(
        "Some Error occurred in calling get capture qrc details api " +
          JSON.stringify(err)
      );
      return resolve({
        resp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {},
      });
    }
  });
}

function createCaptureDetailsQRPayload(uniqueId, qrCode) {
  const qrcObj = {
    point_of_sale_details: {
      store_details: {
        external_id: "teststore2",
      },
      terminal_details: {
        external_id: "5",
        type: "CASH_REGISTER",
      },
      retailer_name: "Retailer Loc 2",
    },
    credential_info: {
      retailer: {
        account_id: "7J5E5MRJUDW9Q",
      },
      customer: {
        qr_code: qrCode,
      },
    },
    transaction: {
      partial_tender: false,
      partial_approval_supported: true,
      amount: {
        currency_code: "USD",
        value: "400.00",
      },
      invoice: {
        external_id: uniqueId + "_invoice_id",
        soft_descriptor: "Test Merchant",
        items: [
          {
            name: "Timex Unisex Originals",
            description: "Watches",
            ean: "001101",
            sku: "110011",
            return_policy_id: "fee1101",
            total_price: {
              currency_code: "USD",
              value: "100.00",
            },
            item_price: {
              currency_code: "USD",
              value: "50.00",
            },
            item_count: "2",
          },

          {
            name: "Lumix Camera Lens",
            description: "Camera",
            ean: "001201",
            sku: "110021",
            return_policy_id: "fee1201",
            total_price: {
              currency_code: "USD",
              value: "300.00",
            },
            item_price: {
              currency_code: "USD",
              value: "300.00",
            },
            item_count: "1",
          },
        ],
      },
    },
    receipt_info: {
      terminal_sales_time: new Date().toISOString(),
      retailer_transaction_id: uniqueId + "_transaction_id",
    },
  };
  return { qrcObj };
}

function getVaultToken(accessToken, apiConfiguration) {
  console.log("Is Vaulting Enabled " + apiConfiguration.isVaulting);
  console.log("CUSTOMER_ID ", apiConfiguration.CUSTOMER_ID);
  const url =
    apiConfiguration.GET_VAULT_TOKEN +
    "?customer_id=" +
    apiConfiguration.CUSTOMER_ID;
  console.log("URL ", url);
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url,
      headers: {
        authorization: "Bearer " + accessToken,
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      json: true,
    };
    console.log("Is Partner " + apiConfiguration.isPartner);

    console.log("Is MSP " + apiConfiguration.isMSP);

    if (apiConfiguration.isPartner && !apiConfiguration.isMSP) {
      options.headers["PayPal-Auth-Assertion"] = getAuthAssertion(
        apiConfiguration
      );
    }

    request(options, function (error, response, body) {
      if (error) {
        console.log(
          "Error in getting vault token from api " + JSON.stringify(error)
        );
        return resolve({
          vaultToken: "",
          vaultTokenResp: error,
          status: false,
          error: error,
          statusCode: response.statusCode,
          headers: response.headers,
        });
      } else {
        try {
          let vaultTokenResp = body;
          console.log(
            "Vault Token response is " + JSON.stringify(vaultTokenResp)
          );
          if (
            vaultTokenResp &&
            vaultTokenResp.payment_tokens &&
            vaultTokenResp.payment_tokens.length > 0
          ) {
            console.log("Found Vault Token ", vaultTokenResp.payment_tokens);
            return resolve({
              vaultToken: vaultTokenResp.payment_tokens,
              vaultTokenResp: vaultTokenResp,
              status: true,
              error: null,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          } else {
            return resolve({
              vaultToken: "",
              vaultTokenResp: vaultTokenResp,
              status: false,
              error: body,
              statusCode: response.statusCode,
              headers: response.headers,
            });
          }
        } catch (err) {
          console.log(
            "Error in Parsing Vault Token response " + JSON.stringify(err)
          );
          return resolve({
            vaultToken: "",
            vaultTokenResp: err,
            status: false,
            error: err,
            statusCode: 500,
            headers: {},
          });
        }
      }
    });
  });
}

exports.getAuthAssertion = getAuthAssertion;
exports.getAccessToken = getAccessToken;
exports.createOrder = createOrder;
exports.getOrder = getOrder;
exports.captureOrder = captureOrder;
exports.authOrder = authOrder;
exports.getClientToken = getClientToken;
exports.confirmPaymentSource = confirmPaymentSource;
exports.createPartnerReferral = createPartnerReferral;
exports.getSellerAccessToken = getSellerAccessToken;
exports.getSellerCredentials = getSellerCredentials;
exports.captureQRC = captureQRC;
exports.getCaptureQRCDetails = getCaptureQRCDetails;
exports.createCaptureDetailsQRPayload = createCaptureDetailsQRPayload;
exports.getVaultToken = getVaultToken;
