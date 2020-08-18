const {
  COUNTRY,
  LOCALES,
  CURRENCY,
  LANG,
  LOCALE_COUNTRY,
  APM,
} = require("./constants");

module.exports = function (router) {
  router.get(["/buttonvariations"], function (req, res, next) {
    res.render("buttonvariations/index");
  });

  router.get(["/standalone"], function (req, res, next) {
    res.render("buttonvariations/standalone");
  });

  router.get(["/pp-marks"], function (req, res, next) {
    res.render("buttonvariations/pp-marks");
  });

  router.get(["/ba-flow"], function (req, res, next) {
    res.render("buttonvariations/ba-flow");
  });

  router.get(["/unbranded-apms"], function (req, res, next) {
    var obj = {
      COUNTRY,
      LANG,
      LOCALES,
      CURRENCY,
      LOCALE_COUNTRY,
      APM,
    };
    res.render("buttonvariations/unbranded-apms", { config: obj });
  });

  router.get(["/unbranded-apms/return"], async function (req, res, next) {
    
    let orderId = req.query.token;

    console.log("order id ", orderId);

    setTimeout(() => {
      res.render("buttonvariations/return-apm", {
        orderId: orderId,
        status: "RETURNED",
      });
    }, 300);
  });

  router.get(["/unbranded-apms/cancel"], async function (req, res, next) {

    let orderId = req.query.token;

    console.log("order id ", orderId);
    setTimeout(() => {
      res.render("buttonvariations/cancel-apm", {
        orderId: orderId,
        status: "CANCELLED",
      });
    }, 300);
  });


  router.post(["/unbranded-apms/webhooks"], async function (req, res, next) {

    let body = req.body;

    console.log("webhook body ", body);
    console.log(body.eventType);
    console.log(body.resource.id);
    console.log(body.resource.status);

  
    if(body.eventType === "CHECKOUT.ORDER.APPROVED") {
      return res.status(200).render("buttonvariations/return-apm", {
        orderId: body.resource.id,
        status: body.resource.status
      });
    }
    res.status(200).end();
  });

};
