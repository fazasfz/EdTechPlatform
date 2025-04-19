
const Enrollment = require("../models/Enrollment");

exports.enroll = async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;
  const existing = await Enrollment.findOne({ courseId, studentId });
  if (existing) return res.status(400).json({ error: "Already enrolled" });
  const enrollment = new Enrollment({ courseId, studentId });
  await enrollment.save();
  res.status(201).json(enrollment);
};

exports.getEnrollments = async (req, res) => {
  const courseId = req.params.courseId;
  const enrolled = await Enrollment.find({ courseId }).populate("studentId", "email");
  res.status(200).json(enrolled);
};