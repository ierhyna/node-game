const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  req.session = null; // destroy session
  res.redirect("/"); // redirect to homepage
});

module.exports = router;
