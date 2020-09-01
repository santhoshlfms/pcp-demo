const {
  COUNTRY,
  LOCALES,
  CURRENCY,
  LANG,
  LOCALE_COUNTRY,
} = require("./constants");

const getConfig = require("./pcpConfig").getConfig;

const {
  getAccessToken,
  getOrder,
  getClientToken,
  createOrder,
  captureOrder,
  authOrder,
  confirmPaymentSource,
  createPartnerReferral,
  getSellerAccessToken,
  getSellerCredentials,
  captureQRC,
  getCaptureQRCDetails,
} = require("./util");

module.exports = function (router) {
  router.get(["/", "/pcp"], function (req, res, next) {
    var obj = {
      COUNTRY,
      LANG,
      LOCALES,
      CURRENCY,
      LOCALE_COUNTRY,
    };
    res.render("pcp/pcp", { config: obj });
  });

  router.post("/pcp-create-order", async function (req, res, next) {
    try {
      console.log("*** Create Order ***");

      if (!req.body.envObj || !req.body.orderObj) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(" ORDER OBJ *** " + JSON.stringify(req.body.orderObj));

      let { envObj, orderObj } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        res.status;
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = orderObj;

      let createOrderResp = await createOrder(accessToken, apiConfiguration);

      if (!createOrderResp.status || createOrderResp.statusCode > 201) {
        console.log("Error in Create Order call " + createOrderResp);
        return res
          .status(createOrderResp.statusCode)
          .json({ ...createOrderResp });
      }
      return res.json({
        ...createOrderResp.orderResp,
        ...createOrderResp.headers,
      });
    } catch (err) {
      console.log("Error occurred in making CREATE order call ", err);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-get-order", async function (req, res, next) {
    try {
      console.log("*** GET Order ***");

      if (!req.body.envObj || !req.query.id) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));

      let { envObj } = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      let getOrderResponse = await getOrder(accessToken, apiConfiguration);

      if (!getOrderResponse.status || getOrderResponse.statusCode > 201) {
        console.log(
          "Error in get Order call " + JSON.stringify(getOrderResponse)
        );
        return res
          .status(getOrderResponse.statusCode)
          .json({ ...getOrderResponse });
      }
      return res.json({
        ...getOrderResponse.getOrderResp,
        ...getOrderResponse.headers,
      });
    } catch (err) {
      console.log("Error occurred in making GET order call ", err.message);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-capture-order", async function (req, res, next) {
    try {
      console.log("*** Capture Order ***");

      if (!req.body.envObj || !req.query.id) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));

      let { envObj } = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      let captureOrderResponse = await captureOrder(
        accessToken,
        apiConfiguration
      );

      if (
        !captureOrderResponse.status ||
        captureOrderResponse.statusCode > 201
      ) {
        console.log(
          "Error in Capture Order call " + JSON.stringify(captureOrderResponse)
        );
        return res
          .status(captureOrderResponse.statusCode)
          .json({ ...captureOrderResponse });
      }
      return res.json({
        ...captureOrderResponse.captureOrderResp,
        ...captureOrderResponse.headers,
      });
    } catch (err) {
      console.log("Error occurred in making Capture order call ", err.message);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-auth-order", async function (req, res, next) {
    try {
      console.log("*** Auth Order ***");
      console.log("ENV OBJ *** " + JSON.stringify(req.body.envObj));

      if (!req.body.envObj || !req.query.id) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      let { envObj } = req.body;
      let orderId = req.query.id;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      let authOrderResponse = await authOrder(accessToken, apiConfiguration);

      if (!authOrderResponse.status || authOrderResponse.statusCode > 201) {
        console.log(
          "Error in Auth Order call " + JSON.stringify(authOrderResponse)
        );
        return res
          .status(authOrderResponse.statusCode)
          .json({ ...authOrderResponse });
      }
      return res.json({
        ...authOrderResponse.authOrderResp,
        ...authOrderResponse.headers,
      });
    } catch (err) {
      console.log("Error occurred in making Auth order call ", err.message);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-get-client-token", async function (req, res, next) {
    try {
      console.log("*** GET Client Token ***");

      if (!req.body.envObj) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }

      console.log("ENV OBJ *** " + JSON.stringify(req.body.envObj));

      let { envObj } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        CUSTOMER_ID: envObj.customerId,
        isVaulting: envObj.isVaulting,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        return res
          .status(accessTokenResp.statusCode)
          .json({ ...accessTokenResp });
      }

      let accessToken = accessTokenResp.accessToken;

      let getClientTokenResponse = await getClientToken(
        accessToken,
        apiConfiguration
      );

      if (
        !getClientTokenResponse.status ||
        getClientTokenResponse.statusCode > 201
      ) {
        console.log(
          "Error in getting client token call " +
            JSON.stringify(getClientTokenResponse)
        );
        return res
          .status(getClientTokenResponse.statusCode)
          .json({ ...getClientTokenResponse });
      }
      console.log("Returning back the Client token response ");
      return res.json({
        ...getClientTokenResponse,
      });
    } catch (err) {
      console.log("Error occurred in getting client token ", err.message);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-confirm-payment-source", async function (req, res, next) {
    try {
      console.log("*** Confirm Payment Source ***");

      if (!req.body.envObj || !req.body.confirmPaymentSourceObj) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(
        " Confirm Payment Source OBJ *** " +
          JSON.stringify(req.body.confirmPaymentSourceObj)
      );

      let { envObj, confirmPaymentSourceObj, orderId } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
        orderId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        res.status;
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = confirmPaymentSourceObj;

      let confirmPaymentSourceResp = await confirmPaymentSource(
        accessToken,
        apiConfiguration
      );

      if (
        !confirmPaymentSourceResp.statusCode ||
        confirmPaymentSourceResp.statusCode > 201
      ) {
        console.log(
          "Error in Confirm Payment Source call " +
            confirmPaymentSourceResp.orderResp
        );
        return res
          .status(confirmPaymentSourceResp.statusCode)
          .json({ ...confirmPaymentSourceResp });
      }
      return res.json({
        ...confirmPaymentSourceResp.orderResp,
        ...confirmPaymentSourceResp.headers,
        statusCode: confirmPaymentSourceResp.statusCode,
      });
    } catch (err) {
      console.log("Error occurred in making Confirm Payment Source call ", err);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-create-partner-referral", async function (req, res, next) {
    try {
      console.log("*** Create Partner Referral ***");

      if (!req.body.envObj || !req.body.partnerReferralObj) {
        return res.status(400);
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(
        " Create Partner Referral OBJ *** " +
          JSON.stringify(req.body.partnerReferralObj)
      );

      let { envObj, partnerReferralObj } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        res.status;
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = partnerReferralObj;

      let createPartnerReferralRespObj = await createPartnerReferral(
        accessToken,
        apiConfiguration
      );

      if (
        !createPartnerReferralRespObj.statusCode ||
        createPartnerReferralRespObj.statusCode > 201
      ) {
        console.log(
          "Error in Create Partner Referral call " +
            createPartnerReferralRespObj.resp
        );
        return res
          .status(createPartnerReferralRespObj.statusCode)
          .json({ ...createPartnerReferralRespObj });
      }
      return res.json({
        ...createPartnerReferralRespObj.resp,
        ...createPartnerReferralRespObj.headers,
        statusCode: createPartnerReferralRespObj.statusCode,
      });
    } catch (err) {
      console.log(
        "Error occurred in making Create Partner Referral call ",
        err
      );
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-seller-accesstoken", async function (req, res, next) {
    try {
      console.log("*** GET SELLER ACCESS TOKEN ***");

      if (!req.body.envObj || !req.body.sellerAccessTokenObj) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(
        " GET SELLER ACCESS TOKEN OBJ *** " +
          JSON.stringify(req.body.sellerAccessTokenObj)
      );

      let { envObj, sellerAccessTokenObj } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
      };

      apiConfiguration.payload = sellerAccessTokenObj;

      let sellerAccessTokenResp = await getSellerAccessToken(apiConfiguration);

      if (
        !sellerAccessTokenResp.status ||
        sellerAccessTokenResp.statusCode > 201
      ) {
        console.log(
          "Error in getting Seller Access Token " +
            JSON.stringify(sellerAccessTokenResp)
        );
        return res
          .status(sellerAccessTokenResp.statusCode)
          .json(sellerAccessTokenResp);
      }

      let accessToken = sellerAccessTokenResp.resp.access_token;

      console.log("Seller access token ", accessToken);

      return res.json({
        ...sellerAccessTokenResp.resp,
        ...sellerAccessTokenResp.headers,
        statusCode: sellerAccessTokenResp.statusCode,
      });
    } catch (err) {
      console.log(
        "Error occurred in making GET SELLER ACCESS TOKEN call ",
        err
      );
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-seller-credentials", async function (req, res, next) {
    try {
      console.log("*** GET SELLER Credentials ***");

      if (!req.body.envObj || !req.body.sellerCredentialsObj) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(
        " Seller credentials Obj *** " +
          JSON.stringify(req.body.sellerCredentialsObj)
      );

      let { envObj, sellerCredentialsObj } = req.body;
      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID,
        SECRET: envObj.clientSecret || defaultConfig.SECRET,
        MERCHANTID: envObj.merchantId,
      };

      apiConfiguration.payload = sellerCredentialsObj;

      let sellerCredentialsResp = await getSellerCredentials(apiConfiguration);

      if (
        !sellerCredentialsResp.status ||
        sellerCredentialsResp.statusCode > 201
      ) {
        console.log(
          "Error in getting Seller Credentials " +
            JSON.stringify(sellerCredentialsResp)
        );
        return res
          .status(sellerCredentialsResp.statusCode)
          .json(sellerCredentialsResp);
      }

      console.log("Seller Credentials ", sellerCredentialsResp.resp);

      return res.json({
        ...sellerCredentialsResp.resp,
        ...sellerCredentialsResp.headers,
        statusCode: sellerCredentialsResp.statusCode,
      });
    } catch (err) {
      console.log("Error occurred in making GET SELLER CREDENTIALS call ", err);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-qrc-capture", async function (req, res, next) {
    try {
      console.log("*** CAPTURE QRC DETAILS ***");

      if (!req.body.envObj || !req.body.qrcObj || !req.body.requestId) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));
      console.log(
        " CAPTURE QRC DETAILS OBJ *** " + JSON.stringify(req.body.qrcObj)
      );
      console.log("REQUEST ID " + req.body.requestId);

      let { envObj, qrcObj, requestId } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID_QRC,
        SECRET: envObj.clientSecret || defaultConfig.SECRET_QRC,
        MERCHANTID: envObj.merchantId,
        requestId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        res.status;
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = qrcObj;

      let captureQRCResp = await captureQRC(accessToken, apiConfiguration);

      if (!captureQRCResp.statusCode || captureQRCResp.statusCode > 202) {
        console.log(
          "Error in CAPTURE QRC DETAIL CALL " +
            JSON.stringify(captureQRCResp.resp)
        );
        return res.status(captureQRCResp.statusCode).json({
          ...captureQRCResp.resp,
          ...captureQRCResp.headers,
          statusCode: captureQRCResp.statusCode,
        });
      }
      return res.json({
        ...captureQRCResp.resp,
        ...captureQRCResp.headers,
        statusCode: captureQRCResp.statusCode,
      });
    } catch (err) {
      console.log("Error occurred in making CAPTURE QRC DETAILS call ", err);
      res.status(500).json({ err, message: err.message });
    }
  });

  router.post("/pcp-qrc-capture-retrieve", async function (req, res, next) {
    try {
      console.log("*** GET CAPTURE QRC DETAILS ***");

      if (!req.body.envObj || !req.body.reference_id || !req.body.requestId) {
        return res
          .status(400)
          .json({ message: "Invalid Request", statusCode: 400 });
      }
      console.log(" ENV OBJ *** " + JSON.stringify(req.body.envObj));

      console.log("REFERENCE ID " + req.body.reference_id);

      console.log("REQUEST ID " + req.body.requestId);

      let { envObj, reference_id, requestId } = req.body;

      let defaultConfig = getConfig(envObj.env);

      let apiConfiguration = {
        ...defaultConfig,
        ...envObj,
        CLIENT_ID: envObj.clientId || defaultConfig.CLIENT_ID_QRC,
        SECRET: envObj.clientSecret || defaultConfig.SECRET_QRC,
        MERCHANTID: envObj.merchantId,
        reference_id,
        requestId,
      };

      let accessTokenResp = await getAccessToken(apiConfiguration);

      if (!accessTokenResp.status || accessTokenResp.statusCode > 201) {
        console.log(
          "Error in getting Access Token " + JSON.stringify(accessTokenResp)
        );
        res.status;
        return res.status(accessTokenResp.statusCode).json(accessTokenResp);
      }

      let accessToken = accessTokenResp.accessToken;

      let getCaptureQRCDetailsResp = await getCaptureQRCDetails(
        accessToken,
        apiConfiguration
      );

      if (
        !getCaptureQRCDetailsResp.statusCode ||
        getCaptureQRCDetailsResp.statusCode > 201
      ) {
        console.log(
          "Error in GETTING CAPTURE QRC DETAILS CALL " +
            getCaptureQRCDetailsResp.resp
        );
        return res.status(getCaptureQRCDetailsResp.statusCode).json({
          ...getCaptureQRCDetailsResp.resp,
          ...getCaptureQRCDetailsResp.headers,
          statusCode: getCaptureQRCDetailsResp.statusCode,
        });
      }
      return res.json({
        ...getCaptureQRCDetailsResp.resp,
        ...getCaptureQRCDetailsResp.headers,
        statusCode: getCaptureQRCDetailsResp.statusCode,
      });
    } catch (err) {
      console.log(
        "Error occurred in making GET CAPTURE QRC DETAILS call ",
        err
      );
      res.status(500).json({ err, message: err.message });
    }
  });
};
