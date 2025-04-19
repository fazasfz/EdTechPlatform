
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videos: [{
      url: String,
      transcript: String,
    }]
  }, { timestamps: true });
  
  module.exports = mongoose.model("Course", courseSchema);