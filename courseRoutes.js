
const express = require("express");
const { createCourse, uploadVideo } = require("../controllers/courseController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, createCourse);
router.post("/:courseId/upload", auth, uploadVideo);