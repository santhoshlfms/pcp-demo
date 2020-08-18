const {
  COUNTRY,
  LOCALES,
  CURRENCY,
  LANG,
  LOCALE_COUNTRY,
  APM,
} = require("./constants");

const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

// const adapter = new FileSync("orders.json");
// const db = low(adapter);

const adapter = new FileAsync("orders.json");

module.exports = function (router) {
  low(adapter).then((db) => {
    db._.mixin({
      upsert: function (collection, obj, key) {
        key = key || "id";
        for (var i = 0; i < collection.length; i++) {
          var el = collection[i];
          if (el[key] === obj[key]) {
            collection[i] = obj;
            return collection;
          }
        }
        collection.push(obj);
      },
    });

    db.defaults({ orders: [] }).write();
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

      const result = db
        .get("orders")
        .push({ orderId: orderId, status: "RETURNED" })
        .write();
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

      const result = db
        .get("orders")
        .push({ orderId: orderId, status: "CANCELLED" })
        .write();

      console.log(result);

      setTimeout(() => {
        res.render("buttonvariations/cancel-apm", {
          orderId: orderId,
          status: "CANCELLED",
        });
      }, 300);
    });

    router.post(["/unbranded-apms/webhooks"], async function (req, res, next) {
      let body = req.body;

      console.log("Incoming Webhook");

      console.log("**** webhook body **** ", body);
      console.log(body.event_type);
      console.log(body.resource.id);
      console.log(body.resource.status);
      res.end();

      if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
        const result = db
          .get("orders")
          .upsert(
            { orderId: body.resource.id, status: body.resource.status },
            "orderId"
          )
          .write();
      } else if (body.event_type === "CHECKOUT.PAYMENT-APPROVAL.REVERSED") {
        const result = db
          .get("orders")
          .upsert({ orderId: body.resource.id, status: "REVERSED" }, "orderId")
          .write();
      }
    });

    router.get("/orderStatus", async function (req, res, next) {
      console.log("GET ORDER STATUS FOR " + req.query.orderId);
      const order = db
        .get("orders")
        .find({ orderId: req.query.orderId })
        .value();

      res.json({ ...order });
    });
  });
};
