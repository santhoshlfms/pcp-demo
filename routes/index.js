var express = require('express');
var router = express.Router();

// using pcp
require("./pcp")(router);
require("./hw")(router);
require("./buttonvariations")(router);


module.exports = router;
