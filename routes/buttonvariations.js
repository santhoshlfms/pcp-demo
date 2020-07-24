

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
}  