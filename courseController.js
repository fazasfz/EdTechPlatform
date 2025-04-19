const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnail = req.files?.thumbnail?.name || null;
    const creator = req.user.id;
    const course = new Course({ title, description, thumbnail, creator });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const videoUrl = req.files?.video?.name;
    const transcript = `Transcript for ${videoUrl}`;
    const course = await Course.findById(courseId);
    course.videos.push({ url: videoUrl, transcript });
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
