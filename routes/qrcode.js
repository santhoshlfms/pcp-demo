const EventSource = require("eventsource");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const adapter = new FileAsync("qrcodes.json");

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}

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

    db.defaults({ qrcodes: [] }).write();

    setTimeout(() => {
      db.get("qrcodes").remove({}).write();
    }, 18000000);

    router.get(["/qrcode/cpqrc"], function (req, res, next) {
      res.render("qrcode/cpqrc");
    });

    router.get(["/qrcode/mpqrc"], function (req, res, next) {
      res.render("qrcode/mpqrc");
    });

    router.all("/mpqrc/callback", function (req, res, next) {
      let query = req.query;
      let body = req.body;

      let { merchant_ref_id, qrc_refid } = query || {};

      console.log("Incoming MPQRC Webhook");

      console.log("**** webhook query **** ", query);

      console.log("**** webhook body **** ", body);

      const result = db
        .get("qrcodes")
        .upsert(
          { merchant_ref_id: merchant_ref_id, qrc_refid: qrc_refid },
          "merchant_ref_id"
        )
        .write();

      res.end();
    });

    router.get("/mpqrc/status", async function (req, res, next) {
      let query = req.query;
      let merchant_ref_id = query.merchant_ref_id || "";

      console.log("SSE mpqrc status for " + merchant_ref_id);

      res.set("Cache-control", "no-cache");
      res.set("Content-type", "text/event-stream");
      res.set("Connection", "keep-alive");
      res.set("X-Accel-Buffering", "no");
      let done = false;
      let attempts = 1;
      do {
        try {
          console.log("Checking DB **** " + merchant_ref_id);
          const qrCode = db
            .get("qrcodes")
            .find({ merchant_ref_id: merchant_ref_id })
            .value();

          console.log("qrc  " + JSON.stringify(qrCode));

          console.log("QR Code is ");

          let { qrc_refid } = qrCode || {};
          console.log(qrc_refid);

          if (qrc_refid) {
            done = true;
            sendEvent(req, res, "QRC_ID", {
              merchant_ref_id,
              qrc_refid: qrc_refid,
            });
          } else {
            await delay(8000);
          }
          attempts++;
        } catch (err) {
          console.log("error in getting QRC ID from db " + err);
          done = true;
          sendEvent(req, res, "EXCEPTION", { message: err.message });
        }
      } while (!done && attempts < 15);

      if (attempts >= 15) {
        console.log("TIMED OUT");
        sendEvent(req, res, "EXCEPTION", { message: "TIMED OUT" });
      }

      function sendEvent(req, res, status, data) {
        const END_OF_RECORD = "\n";
        const record = [
          "event: " + status,
          "data: " + JSON.stringify(data),
          END_OF_RECORD,
        ].join("\n");
        console.log(`(posterminal) Sending record: ${record}`);
        res.write(record);
      }

      res.end();
    }); // router end

    router.get("/mpqrc/qrcId", async function (req, res, next) {
      console.log("GET QRC ID FOR " + req.query.merchant_ref_id);
      const qrcode = db
        .get("qrcodes")
        .find({ merchant_ref_id: req.query.merchant_ref_id })
        .value();

      console.log("Qr code obj");
      console.log(qrcode);

      res.json({ ...qrcode });
    });

    router.get("/clearQrcs", function (req, res, next) {
      db.get("qrcodes").remove({}).write();
      res.json({ status: "DONE" });
    });
  }); // db end
};
