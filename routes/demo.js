/**
  This is purely to demo the product

*/
var express = require("express");
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "demo.html"));
});

module.exports = router;
