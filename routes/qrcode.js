module.exports = function (router) {
  router.get(["/qrcode/cpqrc"], function (req, res, next) {
    res.render("qrcode/cpqrc");
  });

  router.post("/mpqrc/callback", function (req, res, next) {
    let body = req.body;

    console.log("Incoming MPQRC Webhook");

    console.log("**** webhook body **** ", body);

    res.end();
  });
};
