var express = require('express');
var router = express.Router();

// using pcp
require("./pcp")(router);


module.exports = router;
