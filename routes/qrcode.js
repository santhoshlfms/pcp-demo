module.exports = function (router) {
  router.get(["/qrcode/cpqrc"], function (req, res, next) {
    res.render("qrcode/cpqrc");
  });

  router.get(["/qrcode/mpqrc"], function (req, res, next) {
    res.render("qrcode/mpqrc");
  });

  router.all("/mpqrc/callback", function (req, res, next) {
    let query = req.query;
    let body = req.body;

    console.log("Incoming MPQRC Webhook");

    console.log("**** webhook query **** ", query);

    console.log("**** webhook body **** ", body);

    res.end();
  });
};
