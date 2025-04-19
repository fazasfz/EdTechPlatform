
const enrollmentSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    progress: { type: Number, default: 0 }
  }, { timestamps: true });
  
  module.exports = mongoose.model("Enrollment", enrollmentSchema);