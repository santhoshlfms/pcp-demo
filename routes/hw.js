const { COUNTRY, LOCALES, CURRENCY, LANG } = require("./constants");
var Hyperwallet = require("hyperwallet-sdk");

module.exports = function (router) {
  router.get(["/hw"], function (req, res, next) {
    var obj = {
      COUNTRY,
      LANG,
      LOCALES,
      CURRENCY,
    };
    res.render("hw/hw", { config: obj });
  });

  router.post("/hw-create-user", (req, res, next) => {
    try {
      var { username, password, state, ...userBody } = req.body;
      console.log(req.body);
      var client = new Hyperwallet({
        username: username,
        password: password,
        server: "https://api.sandbox.hyperwallet.com",
      });

      client.createUser(userBody, function (error, body, response) {
        // handle response body here
        console.log("*** Create User Status ***", response.statusCode);

        if (error) {
          console.log("errror in creating user ", error);
          return res.status(response.statusCode).json({ error: error });
        }
        console.log(body);

        return res.status(response.statusCode).json({ data: body });
      });
    } catch (error) {
      console.log("errror in creating user ", error);
      return res.status(500).json({ error: error });
    }
  });

  router.post("/hw-auth-token", (req, res, next) => {
    try {
      var { username, password, userToken } = req.body;
      console.log(req.body);
      var client = new Hyperwallet({
        username: username,
        password: password,
        server: "https://api.sandbox.hyperwallet.com",
      });

      client.getAuthenticationToken(userToken, function (
        error,
        body,
        response
      ) {
        // handle response body here
        console.log("*** Auth Token ***", response.statusCode);

        if (error) {
          console.log("error in getting auth token ", error);
          return res.status(response.statusCode).json({ error: error });
        }
        console.log(body);

        return res.status(response.statusCode).json({ data: body });
      });
    } catch (error) {
      console.log("error in getting auth token ", error);
      return res.status(500).json({ error: error });
    }
  });

  router.post("/hw-make-payment", (req, res, next) => {
    try {
      var { username, password, ...paymentData } = req.body;
      console.log(req.body);
      var client = new Hyperwallet({
        username: username,
        password: password,
        server: "https://api.sandbox.hyperwallet.com",
      });

      client.createPayment(paymentData, function (error, body, response) {
        // handle response body here
        console.log("*** Make payment ***", response.statusCode);

        if (error) {
          console.log("errror in making payment ", error);
          return res.status(response.statusCode).json({ error: error });
        }
        console.log(body);

        return res.status(response.statusCode).json({ data: body });
      });
    } catch (error) {
      console.log("errror in making payment ", error);
      return res.status(500).json({ error: error });
    }
  });
};
