const path = require('path');
const express = require("express");
const users = require("../controllers/userController");

const router = express.Router();

/* GET login page. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"))
});

/* POST */
router.post("/", (req, res) => {
  users.login(req, res);
});

module.exports = router;
