module.exports = function (router) {
  router.get(["/qrcode/cpqrc"], function (req, res, next) {
    res.render("qrcode/cpqrc");
  });
};
