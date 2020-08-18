const request = require("request");
const jwt = require('jsonwebtoken');

const { COUNTRY , LOCALES, CURRENCY, LANG, LOCALE_COUNTRY } = require("./constants");
const getConfig = require("./pcpConfig").getConfig;

function getAuthAssertion(apiConfiguration) {
  var token = jwt.sign({"iss": apiConfiguration.CLIENT_ID,
  "payer_id": apiConfiguration.MERCHANTID },null, { algorithm: 'none' });
  console.log("Get Auth Assertion value for "+ apiConfiguration.MERCHANTID);
  console.log("Auth Assertion "+token);
  return token;
}

function getAccessToken(apiConfiguration) {
   return new Promise((resolve,reject) => {
      var token  = apiConfiguration.CLIENT_ID+":"+apiConfiguration.SECRET,
          encodedKey = new Buffer(token).toString('base64'),
          payload = "grant_type=client_credentials&Content-Type=application%2Fx-www-form-urlencoded&response_type=token&return_authn_schemes=true&ignoreCache=true";
        
      var options = { 
        method: 'POST',
        url: apiConfiguration.ACCESS_TOKEN_URL,
        headers: {
              'authorization': "Basic "+encodedKey,
              'accept': "application/json",
              'accept-language': "en_US",
              'cache-control': "no-cache",
              'content-type': "application/x-www-form-urlencoded",
              'PayPal-Partner-Attribution-Id' : apiConfiguration.BN_CODE
            },
        body:payload
      }
    
      request(options, function (error, response, body) {
        if (error) {
          console.log("Error in getting access token from api "+ JSON.stringify(error));
          return resolve({
            accessToken:'',
            status: false,
            error:error,
            statusCode: response.statusCode
          });
        }
        else{
          try {
            let accessToken = JSON.parse(body).access_token;
            if(accessToken) {
              console.log("Found Access Token");
              return resolve({
                accessToken,
                status: true,
                error: null,
                statusCode: response.statusCode

              });
            } else {
              return resolve({
                accessToken :"",
                status: false,
                error: JSON.parse(body),
                statusCode: response.statusCode
              });
            }
          } catch(err) {
            console.log("Error in Parsing Access Token response " + JSON.stringify(err));
            return resolve({
              accessToken:'',
              status: false,
              error: err,
              statusCode: response.statusCode
            });
          }
        }
      });
    });
}

function getOrder(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    try {
      
      var options = {
        headers: {
          'content-type': "application/json",
          'authorization': "Bearer "+accessToken,
        },
        json: true
      }
    
      console.log("Is Partner "+ apiConfiguration.isPartner)
      console.log("Is MSP "+ apiConfiguration.isMSP)
    
      if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
      }

      request.get(apiConfiguration.GET_ORDER_URL + apiConfiguration.orderId, options , function (err, response, body) {
          if (err) {
              console.error(err);
              return resolve({
                getOrderResp: err,
                status : false,
                error: err,
                statusCode: response.statusCode,
                headers: response.headers
              })
          }
          console.log("*** GET Order Response ***");
          console.log(body);
          let getOrderResp = body;
          return resolve({
            getOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers
          })
        });
    } catch(err) {
      console.log("Some Error occurred in calling get orders api "+ JSON.stringify(err));
      return resolve({
        getOrderResp: err,
        status: false,
        error: err,
        statusCode: response.statusCode,
        headers: response.headers
      })
    }
  });
}

function createOrder(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    try {    

      var options = {
        headers: {
          'content-type': "application/json",
          'authorization': "Bearer "+accessToken,
        },
        body: apiConfiguration.payload,
        json: true
      }

      console.log("Is Partner "+ apiConfiguration.isPartner)
      console.log("Is MSP "+ apiConfiguration.isMSP)
    
      if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
      }

      request.post(apiConfiguration.CREATE_ORDER_URL, options, function (err, response, body) {
          if (err) {
              console.error(err);
              return resolve({
                orderResp: err,
                status : false,
                error: err,
                statusCode: response.statusCode,
                headers: response.headers
              })
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

          console.log ("Order ID is :"+orderResp.id);
          return resolve({
            orderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers
          })

      });
    } catch(err) {
      console.log("Some Error occurred in calling create orders api "+ JSON.stringify(err));
      return resolve({
        orderResp: err,
        status: false,
        error: err,
        statusCode: response.statusCode,
        headers: response.headers
      })
    }
  });
}

function captureOrder(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    try {    
      var options = {
        headers: {
          'content-type': "application/json",
          'authorization': "Bearer "+accessToken,
        },
        json: true,
        body : {}
      }
      
      console.log("Is Partner "+ apiConfiguration.isPartner)
      console.log("Is MSP "+ apiConfiguration.isMSP)
    
      if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
      }

      request.post(apiConfiguration.CAPTURE_ORDER_URL + apiConfiguration.orderId + '/capture', options, function (err, response, body) {
          if (err) {
              console.error(err);
              return resolve({
                captureOrderResp: err,
                status : false,
                error: err,
                statusCode: response.statusCode,
                headers: response.headers
              })
          }
          console.log("*** Capture Order Response ***");
          console.log(body);
          let captureOrderResp = body;
          return resolve({
            captureOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers
          })
        });
    } catch(err) {
      console.log("Some Error occurred in calling capture orders api "+ JSON.stringify(err));
      return resolve({
        captureOrderResp: err,
        status: false,
        error: err,
        statusCode: response.statusCode,
        headers: response.headers
      })
    }
  });
}

function authOrder(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    try {   
      
      var options = {
        headers: {
          'content-type': "application/json",
          'authorization': "Bearer "+accessToken,
        },
        json: true,
        body : {}
      }
      
      console.log("Is Partner "+ apiConfiguration.isPartner)
      console.log("Is MSP "+ apiConfiguration.isMSP)
    
      if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
      }

      request.post(apiConfiguration.AUTH_ORDER_URL + apiConfiguration.orderId + '/authorize', options , function (err, response, body) {
          if (err) {
              console.error(err);
              return resolve({
                authOrderResp: err,
                status : false,
                error: err,
                statusCode: response.statusCode,
                headers: response.headers
              })
          }
          console.log("*** Auth Order Response ***");
          console.log(body);
          let authOrderResp = body;
          return resolve({
            authOrderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers
          })
        });
    } catch(err) {
      console.log("Some Error occurred in calling auth orders api "+ JSON.stringify(err));
      return resolve({
        authOrderResp: err,
        status: false,
        error: err,
        statusCode: response.statusCode,
        headers: response.headers
      })
    }
  });
}

function getClientToken(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    var options = { 
      method: 'POST',
      url: apiConfiguration.GET_CLIENT_TOKEN,
      headers: {
            'authorization': "Bearer " + accessToken,
            'cache-control': "no-cache",
            'content-type': "application/json",
          },
     json: true
    }
    console.log("Is Partner "+ apiConfiguration.isPartner);
    
    console.log("Is MSP "+ apiConfiguration.isMSP)
    
    if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
      options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
    }

    console.log("Is Vaulting Enabled "+ apiConfiguration.isVaulting);

    if(apiConfiguration.isVaulting) {
      options.body = {
        customer_id : apiConfiguration.CUSTOMER_ID
      }
    }
    
    console.log("CUSTOMER_ID ", apiConfiguration.CUSTOMER_ID);

    request(options, function (error, response, body) {
      if (error) {
        console.log("Error in getting client token from api "+ JSON.stringify(error));
        return resolve({
          clientToken:'',
          status: false,
          error:error, 
          statusCode: response.statusCode,
          headers: response.headers
        });
      }
      else{
        try {
          let clientTokenResp = body;
          console.log("Client Token response is "+ JSON.stringify(clientTokenResp))
          if(clientTokenResp && clientTokenResp.client_token) {
            console.log("Found Client Token");
            return resolve({
              clientToken: clientTokenResp.client_token,
              status: true,
              error: null,
              statusCode: response.statusCode,
              headers: response.headers
            });
          } else {
            return resolve({
              clientToken :"",
              status: false,
              error: body,
              statusCode: response.statusCode,
              headers: response.headers
            });
          }
        } catch(err) {
          console.log("Error in Parsing Client Token response " + JSON.stringify(err));
          return resolve({
            clientToken:'',
            status: false,
            error: err,
            statusCode: response.statusCode,
            headers: response.headers
          });
        }
      }
    });
  });
}

function confirmPaymentSource(accessToken, apiConfiguration) {
  return new Promise((resolve,reject) => {
    try {    

      var options = {
        headers: {
          'content-type': "application/json",
          'authorization': "Bearer "+accessToken,
        },
        json: true
      }

      console.log("Is Partner "+ apiConfiguration.isPartner)
      console.log("Is MSP "+ apiConfiguration.isMSP)
    
      if(apiConfiguration.isPartner && !apiConfiguration.isMSP) {
        options.headers['PayPal-Auth-Assertion'] = getAuthAssertion(apiConfiguration);
      }

      let payload = apiConfiguration.payload;

      console.log(" Payload Confirm Order ", JSON.stringify(payload));

      options.body = payload;

      request.post(apiConfiguration.CONFIRM_PAYMENT_SOURCE + apiConfiguration.orderId + "/confirm-payment-source/",

        options, function (err, response, body) {
          if (err) {
              console.error(err);
              return resolve({
                orderResp: err,
                status : false,
                error: err,
                statusCode: response.statusCode,
                headers: response.headers
              })
          }
          
          console.log("*** Confirm Payment Source Response ***");
          
          console.log(JSON.stringify(body));
          
          let orderResp = body;

          console.log ("Order ID is :"+orderResp.id);

          return resolve({
            orderResp,
            status: true,
            error: null,
            statusCode: response.statusCode,
            headers: response.headers
          })

      });
    } catch(err) {
      console.log("Some Error occurred in calling confirm payment source api "+ JSON.stringify(err));
      return resolve({
        orderResp: err,
        status: false,
        error: err,
        statusCode: 500,
        headers: {}
      })
    }
  });
}



module.exports = function(router) {


  router.get(['/','/pcp'], function(req, res, next) {
    var obj = {
      COUNTRY, LANG, LOCALES, CURRENCY, LOCALE_COUNTRY
    }
    res.render("pcp/pcp", {config : obj});
  });


  router.post("/pcp-create-order", async function(req,res,next) {
    try {
      console.log("*** Create Order ***");

      if(!req.body.envObj || !req.body.orderObj) {
        return res.status(400);
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj))
      console.log(" ORDER OBJ *** " + JSON.stringify(req.body.orderObj))
      
      let { envObj, orderObj} = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
      }

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        res.status
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      } 

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = orderObj;

      let createOrderResp = await createOrder(accessToken, apiConfiguration);

      if(!createOrderResp.status || createOrderResp.statusCode > 201) {
        console.log("Error in Create Order call "+ createOrderResp);
        return res.status(createOrderResp.statusCode).json({...createOrderResp});
      }
      return res.json({
        ...createOrderResp.orderResp,
        ...createOrderResp.headers
      }) 

    } catch(err) {
      console.log("Error occurred in making CREATE order call ", err);
      res.status(500).json(err);
    }
  })

  router.post("/pcp-get-order", async function(req,res,next) {
    try {
      console.log("*** GET Order ***");

      if(!req.body.envObj || !req.query.id) {
        return res.status(400);
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj))
          
      let { envObj } = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId
      }

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
         console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      } 

      let accessToken = accessTokenResp.accessToken;

      let getOrderResponse = await getOrder(accessToken, apiConfiguration);

      if(!getOrderResponse.status || getOrderResponse.statusCode > 201) {
        console.log("Error in get Order call "+ JSON.stringify(getOrderResponse));
        return res.status(getOrderResponse.statusCode).json({...getOrderResponse});
      }
      return res.json({
        ...getOrderResponse.getOrderResp,
        ...getOrderResponse.headers
      }) 

    } catch(err) {
      console.log("Error occurred in making GET order call ", err.message);
      res.status(500).json(err);
    }
  })

  router.post("/pcp-capture-order", async function(req,res,next) {
    try {
      console.log("*** Capture Order ***");
      
      if(!req.body.envObj || !req.query.id) {
        return res.status(400);
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj))

      let { envObj} = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId
      }

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
         console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      } 

      let accessToken = accessTokenResp.accessToken;

      let captureOrderResponse = await captureOrder(accessToken, apiConfiguration);

      if(!captureOrderResponse.status || captureOrderResponse.statusCode > 201) {
        console.log("Error in Capture Order call "+ JSON.stringify(captureOrderResponse));
        return res.status(captureOrderResponse.statusCode).json({...captureOrderResponse});
      }
      return res.json({
        ...captureOrderResponse.captureOrderResp,
        ...captureOrderResponse.headers
      }) 

    } catch(err) {
      console.log("Error occurred in making Capture order call ", err.message);
      res.status(500).json(err);
    }
  })

  router.post("/pcp-auth-order", async function(req,res,next) {
    try {
      console.log("*** Auth Order ***");
      console.log("ENV OBJ *** " + JSON.stringify(req.body.envObj))
      
      if(!req.body.envObj || !req.query.id) {
        return res.status(400);
      }
      let { envObj} = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId
      }

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      } 

      let accessToken = accessTokenResp.accessToken;

      let authOrderResponse = await authOrder(accessToken, apiConfiguration);

      if(!authOrderResponse.status || authOrderResponse.statusCode > 201) {
        console.log("Error in Auth Order call "+ JSON.stringify(authOrderResponse));
        return res.status(authOrderResponse.statusCode).json({...authOrderResponse});
      }
      return res.json({
        ...authOrderResponse.authOrderResp,
        ...authOrderResponse.headers
      }) 

    } catch(err) {
      console.log("Error occurred in making Auth order call ", err.message);
      res.status(500).json(err);
    }
  })

  router.post("/pcp-get-client-token", async function(req,res,next) {
    try {
      console.log("*** GET Client Token ***");

      
      if(!req.body.envObj) {
        return res.status(400);
      }

      console.log("ENV OBJ *** " + JSON.stringify(req.body.envObj))
            
      let { envObj} = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        CUSTOMER_ID: envObj.customerId,
        isVaulting: envObj.isVaulting,
      }
    
      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
         console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        return res.status(accessTokenResp.statusCode).json({...accessTokenResp});
      } 

      let accessToken = accessTokenResp.accessToken;

      let getClientTokenResponse = await getClientToken(accessToken, apiConfiguration);

      if(!getClientTokenResponse.status || getClientTokenResponse.statusCode > 201) {
        console.log("Error in getting client token call "+ JSON.stringify(getClientTokenResponse));
        return res.status(getClientTokenResponse.statusCode).json({...getClientTokenResponse});
      }
      console.log("Returning back the Client token response ");
      return res.json({
        ...getClientTokenResponse
      }) 

    } catch(err) {
      console.log("Error occurred in getting client token ", err.message);
      res.status(500).json(err);
    }
  
  })

  router.post("/pcp-confirm-payment-source", async function(req,res,next) {
    try {
      console.log("*** Confirm Payment Source ***");

      if(!req.body.envObj || !req.body.confirmPaymentSourceObj) {
        return res.status(400);
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj))
      console.log(" Confirm Payment Source OBJ *** " + JSON.stringify(req.body.confirmPaymentSourceObj))
      
      let { envObj, confirmPaymentSourceObj, orderId } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId
      }

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if(!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log("Error in getting Access Token "+ JSON.stringify(accessTokenResp));
        res.status
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      } 

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = confirmPaymentSourceObj;

      let confirmPaymentSourceResp = await confirmPaymentSource(accessToken, apiConfiguration);

      if(!confirmPaymentSourceResp.statusCode || confirmPaymentSourceResp.statusCode > 201) {
        console.log("Error in Confirm Payment Source call "+ confirmPaymentSourceResp.orderResp);
        return res.status(confirmPaymentSourceResp.statusCode).json({...confirmPaymentSourceResp});
      }
      return res.json({
        ...confirmPaymentSourceResp.orderResp,
        ...confirmPaymentSourceResp.headers
      }) 

    } catch(err) {
      console.log("Error occurred in making Confirm Payment Source call ", err);
      res.status(500).json(err);
    }
  });

}
