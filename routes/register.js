const express = require("express");
const users = require("../controllers/userController");

const router = express.Router();

/* GET register page. */
router.get("/", (req, res) => {
  res.send("register");
});

/* POST */
router.post("/", (req, res) => {
  users.register(req, res);
});

module.exports = router;
