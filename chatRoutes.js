
const express = require("express");
const { sendMessage } = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/:courseId", auth, sendMessage);

module.exports = router;
