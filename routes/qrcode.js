const request = require("request");
const events = require("events");
let eventEmitter = new events.EventEmitter();

const getConfig = require("./pcpConfig").getConfig;

const { getAccessToken, createCaptureDetailsQRPayload } = require("./util");

const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const adapter = new FileAsync("qrcodes.json");

async function delay(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
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
      let method = req.method;

      let { merchant_ref_id, qrc_refid } = query || {};

      console.log("Incoming MPQRC Webhook");

      console.log("Request Method is " + method);

      console.log("**** webhook query **** ", query);

      console.log("**** webhook body **** ", body);

      // emit back the qrc id for the given merchant ref id
      console.log("Emit QRC ID for merchant ref id " + merchant_ref_id);
      eventEmitter.emit(merchant_ref_id, qrc_refid);

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
          sendEvent(req, res, "MSG", { attempts: attempts });
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

  // cpqrc handler
  router.get("/pcp-qrc-cpqrc-sse", async function (req, res, next) {
    try {
      console.log("*** CPQRC Capture DETAILS SSE ***");

      console.log("Input Query CPQRC " + JSON.stringify(req.query));

      res.set("Cache-control", "no-cache");
      res.set("Content-type", "text/event-stream");
      res.set("Connection", "keep-alive");
      res.set("X-Accel-Buffering", "no");

      // sendEvent(req, res, "STATUS", {
      //   data: {
      //     status: "AWAITING_USER_INPUT",
      //     isDirect: true,
      //   },
      // });

      // await delay(1000);

      req.query.qrType = "cpqrc";

      qrcProcess(req, res);
    } catch (e) {
      console.log("Error occurred in CPQRC capture " + e.message);
      res.end();
    }
  });

  // mpqrc handler
  router.get("/pcp-qrc-mpqrc-sse", async function (req, res, next) {
    let attempts = 1;
    try {
      console.log("*** MPQRC Capture DETAILS SSE ***");

      console.log("Input Query MPQRC " + JSON.stringify(req.query));

      res.set("Cache-control", "no-cache");
      res.set("Content-type", "text/event-stream");
      res.set("Connection", "keep-alive");
      res.set("X-Accel-Buffering", "no");

      let { merchant_ref_id } = req.query;
      console.log("Set up Attempts Timer");
      let interval = setInterval(() => {
        if (attempts > 25) {
          console.log("Removing Attempts Timer");
          clearInterval(interval);
        }
        sendEvent(req, res, "MSG", { attempts: attempts++ });
      }, 3000);

      console.log("Setting up listener on Merchant Id " + merchant_ref_id);
      // listen on the merchant ref id to get the qrc id
      eventEmitter.on(merchant_ref_id, callbackListener);

      async function callbackListener(mpqrcData) {
        console.log(
          `Event fired for merchant ref id ${merchant_ref_id} with ${mpqrcData}`
        );
        let qrc_refid = mpqrcData || "";

        clearInterval(interval);

        sendEvent(req, res, "CALLBACK_RECVD", {
          data: {
            qrc_refid,
            merchant_ref_id,
          },
        });

        //await delay(3000);

        // sendEvent(req, res, "STATUS", {
        //   data: {
        //     status: "AWAITING_USER_INPUT",
        //     isDirect: true,
        //   },
        // });

        req.query.qrCode = qrc_refid;

        req.query.qrType = "mpqrc";

        qrcProcess(req, res, callbackListener);
      }
    } catch (e) {
      console.log("Error occurred in MPQRC capture " + e.message);
      res.end();
    }
  });

  async function qrcProcess(req, res, listener) {
    let isResSent = false;
    try {
      let { uniqueId, qrCode, env, merchant_ref_id, qrType } = req.query;

      // remove event listener for mpqrc once fired
      if (listener) eventEmitter.off(merchant_ref_id, listener);

      let requestId = uniqueId;

      let envObj = {
        env,
      };

      let { qrcObj } = createCaptureDetailsQRPayload(uniqueId, qrCode);

      sendEvent(req, res, "PAYLOAD", {
        data: qrcObj,
      });
      console.log(uniqueId, qrCode, env, qrType);

      if (!uniqueId || !qrCode || !env || !qrType) {
        console.log("Input values missing");
        sendEvent(req, res, "EXCEPTION", { message: "Invalid Request" });
        if (!isResSent) res.end();
        isResSent = true;
        return;
      }

      // if (qrType === "cpqrc") {
      //   sendEvent(req, res, "STATUS", {
      //     data: {
      //       status: "AWAITING_USER_INPUT",
      //       isDirect: true,
      //     },
      //   });
      //   await delay(2000);
      // }

      console.log(" ENV OBJ *** " + JSON.stringify(envObj));
      console.log(" CAPTURE QRC DETAILS OBJ *** " + JSON.stringify(qrcObj));
      console.log("REQUEST ID " + requestId);

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
        sendEvent(req, res, "EXCEPTION", {
          message: "Error In getting access token",
        });
        if (!isResSent) res.end();
        isResSent = true;
        return;
      }

      let accessToken = accessTokenResp.accessToken;

      apiConfiguration.payload = qrcObj;

      // do sse with capture qrc
      var options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "text/event-stream",
          "PayPal-Request-Id": apiConfiguration.requestId,
        },
        body: apiConfiguration.payload,
        json: true,
      };

      const eventSource = request.post(apiConfiguration.CAPTURE_QRC, options);

      eventSource.on("data", function (event) {
        console.log("Incoming Event ");
        let bufferStr = event.toString();

        console.log(bufferStr);

        let indexStr = bufferStr.indexOf("{");
        let dataStr = bufferStr.substr(indexStr);
        try {
          sendEvent(req, res, "STATUS", dataStr);
        } catch (e) {
          sendEvent(req, res, "EXCEPTION", { message: e.message });
          if (!isResSent) res.end();
          isResSent = true;
        }
      });

      eventSource.on("close", function () {
        console.log("Stream Over");
        sendEvent(req, res, "CLOSE", { status: "CLOSE" });
        if (!isResSent) res.end();
        isResSent = true;
      });
    } catch (err) {
      console.log("Error occurred in making CAPTURE QRC DETAILS call ", err);
      if (!isResSent)
        sendEvent(req, res, "EXCEPTION", {
          message:
            "Error occurred in making CAPTURE QRC DETAILS call " + err.message,
        });
      isResSent = true;
      res.end();
    }
  }
};
