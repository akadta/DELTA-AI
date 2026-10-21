const express = require("express");
const router = express.Router();

const googleAuthController = require("../controllers/auth/googleAuthController");

router.post("/google", googleAuthController.googleAuth);

module.exports = router;
