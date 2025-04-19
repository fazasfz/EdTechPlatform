const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-filleupload');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const chatRoutes = require('./routes/chatRoutes');
const enrollemnttRoutes = require('./routes/enrollemnttRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/auth',authRoutes);
app.use('/api/course',chatRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/enrollments',enrollemnttRoutes);

mongoes.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiendTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 500, () => console.log('Server started'));
})
.catch((err) => console.error(err));

// models/User
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
}, {timetamps: true });

module.exports.exports = mongoose.model('User', userSchema);

// models/Course.js 
 const courseSchema = new mongoose.Schema({ 
    title: String, 
    description: String, 
    thumbnail: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    videos: [{ url: String, transcript: String, }] },
    { timestamps: true }); 
    module.exports = mongoose.model('Course', courseSchema);

// models/ChatMessage.js 
 const chatMessageSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    message: String, replies: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String, createdAt: { type: Date, default: Date.now } }], 
    createdAt: { type: Date, default: Date.now } });
    module.exports = mongoose.model('ChatMessage', chatMessageSchema);

// models/Enrollment.js 
 const enrollmentSchema = new mongoose.Schema({ 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    progress: { type: Number, default: 0 } }, { timestamps: true }); 
    module.exports = mongoose.model('Enrollment', enrollmentSchema);


    // controllers/authController.js 
    const User = require('../models/User'); 
    const bcrypt = require('bcryptjs'); 
    const jwt = require('jsonwebtoken');

    exports.registerUser = async (req, res) => { 
        try { const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10); 
            const user = new User({ email, password: hashedPassword }); 
            await user.save(); 
            res.status(201).json({ message: 'User created' });
 
        } catch (err) { res.status(500).json({ error: err.message }); 
    }};
    
    exports.loginUser = async (req, res) => { 
        try { const { email, password } = req.body;
            const user = await User.findOne({ email }); 
            if (!user) return res.status(404).json({ error: 'User not found' });
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).json({ token });
    
        } catch (err) { res.status(500).json({ error: err.message }); 
    }};
    
// controllers/courseController.js
const Course = require('../models/Course');
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
    const videoUrl = req.files?.video?.name; // placeholder
    const transcript = `Transcript for ${videoUrl}`;
    const course = await Course.findById(courseId);
    course.videos.push({ url: videoUrl, transcript });
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/chatController.js
const ChatMessage = require('../models/ChatMessage');
exports.sendMessage = async (req, res) => {
  const { courseId } = req.params;
  const { message } = req.body;
  const newMsg = new ChatMessage({ courseId, userId: req.user.id, message });
  await newMsg.save();
  res.status(201).json(newMsg);
};

// controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
exports.enroll = async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;
  const existing = await Enrollment.findOne({ courseId, studentId });
  if (existing) return res.status(400).json({ error: 'Already enrolled' });
  const enrollment = new Enrollment({ courseId, studentId });
  await enrollment.save();
  res.status(201).json(enrollment);
};

exports.getEnrollments = async (req, res) => {
  const courseId = req.params.courseId;
  const enrolled = await Enrollment.find({ courseId }).populate('studentId', 'email');
  res.status(200).json(enrolled);
};

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
 
//routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser }= require('..?controllers/authController');
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;

//routes/courseRoutes.js
const express = require('express');
const { createCourse, uploadVideo } = require('../controllers/courseController');
const auth = require('../middleware/aaauthMiddleware');
const rooter = express.Rooter();
rooter.post('/', auth, createCourse);
rooter.post('/:courseId', auth, this.sendMessage);
module.exports = rooter;

//routes/chatRoutes.js
const express = require('express');
const { sendMessage }= require('..?controllers/chatController');
const auth = require('../middlewear/authMiddleware');
const  route = express.Router();
route.post('/:courseId', auth, sendMessage);
module.exports = route;

//routes/enrollments.js
const express = require('express');
const { enroll, getEnrollments } = require('../controllers/enrollemntController');
const auth = require('./middlewear/authMiddleware');
const root = express.Root();
root.post('/', auth,enroll);
root.post('/:courseID', auth, getEnrollments);
module.exports = root;