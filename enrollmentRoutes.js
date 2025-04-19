const express = require("express");
const { enroll, getEnrollments } = require("../controllers/enrollmentController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, enroll);
router.get("/:courseId", auth, getEnrollments);

module.exports = router;