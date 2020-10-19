module.exports = function (router) {
  router.get(["/onboarding/first-party"], function (req, res, next) {
    res.render("onboarding/first-party");
  });
};
