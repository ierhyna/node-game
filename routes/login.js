const express = require("express");
const users = require("../controllers/userController");

const router = express.Router();

/* GET login page. */
router.get("/", (req, res) => {
  res.send("login");
});

/* POST */
router.post("/", (req, res) => {
  users.login(req, res);
});

module.exports = router;
