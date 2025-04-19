
const ChatMessage = require("../models/ChatMessage");

exports.sendMessage = async (req, res) => {
  const { courseId } = req.params;
  const { message } = req.body;
  const newMsg = new ChatMessage({ courseId, userId: req.user.id, message });
  await newMsg.save();
  res.status(201).json(newMsg);
};
