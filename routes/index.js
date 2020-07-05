var express = require('express');
var router = express.Router();

// using pcp
require("./pcp")(router);
require("./hw")(router);


module.exports = router;
