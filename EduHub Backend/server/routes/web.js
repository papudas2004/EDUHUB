// EduHub Backend/server/routes/web.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const Contact = require("../model/contactmodel");
const Task = require("../model/taskmodel");
const Course = require("../model/coursemodel");
const Enrollment = require("../model/enrollmentmodel");
const { Quiz, QuizAttempt } = require("../model/quizmodel");
const Material = require("../model/materialmodel");
const Certificate = require("../model/certificatemodel");

// Middleware & Controllers
const { verifyToken, restrictTo } = require("../middleware/authMiddleware");
const { createCourse } = require("../controllers/courseController");

// ==========================================
// 🚀 AUTO-SEED DATABASE WITH RICH MCA DATA
// ==========================================
const seedDatabaseIfEmpty = async () => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log("🌱 Seeding realistic MCA courses into MongoDB...");
      await Course.create([
        {
          title: "Full-Stack MERN Architecture & Cloud Deployment",
          category: "Development",
          instructor: "Siddharth Roy (Senior Tech Lead)",
          difficulty: "Intermediate",
          duration: "45 Hours",
          rating: 4.9,
          studentsCount: 3420,
          description: "Master React 19, Node.js, Express, MongoDB Atlas, Docker containers, and AWS CI/CD pipelines.",
          whatYouWillLearn: [
            "Architect production-grade MERN web applications with modular MVC structure",
            "Implement JWT Authentication, secure cookie storage, and RBAC",
            "Optimize MongoDB indexing, aggregation pipelines, and schema designs",
            "Deploy applications to AWS EC2, S3, and automated GitHub Actions"
          ],
          curriculum: [
            {
              lessonNumber: 1,
              title: "Modern React 19 Foundations & Architecture",
              duration: "25 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/bMknfKXIFA8",
              content: "Explore React 19 compiler enhancements, Server Components, and the `use()` hook for consuming asynchronous resources.",
              summary: "React 19 optimizes re-renders by auto-memoizing dependencies through its compiler engine.",
              resources: [{ name: "React 19 Architecture Notes.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 2,
              title: "Express Middleware Chains & Security Hardening",
              duration: "35 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/Oe421EPjeBE",
              content: "Learn to build reusable Express middlewares for rate limiting, CORS configuration, JWT verification, and centralized error handling.",
              summary: "Middlewares execute sequentially; always handle next(err) in catch blocks.",
              resources: [{ name: "Express Security Checklist.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 3,
              title: "MongoDB Schema Design & Query Optimization",
              duration: "40 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/ofme2o29ngU",
              content: "Deep dive into MongoDB compound indices, ESR rule, explain plans, and aggregation pipelines using $lookup and $group.",
              summary: "Avoid unbounded arrays in documents; utilize referencing for large relationships.",
              resources: [{ name: "MongoDB Optimization Guide.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 4,
              title: "Dockerizing MERN & Cloud CI/CD Pipelines",
              duration: "50 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/gAkwW2tuIqE",
              content: "Package the frontend and backend using multi-stage Dockerfiles and deploy via GitHub Actions onto AWS cloud compute.",
              summary: "Multi-stage Docker builds reduce image size by up to 80%.",
              resources: [{ name: "Dockerfile Templates.zip", url: "#", type: "code" }]
            }
          ]
        },
        {
          title: "Artificial Intelligence & Core Neural Networks",
          category: "AI & Data Science",
          instructor: "Dr. Ananya Sen (AI Researcher)",
          difficulty: "Advanced",
          duration: "38 Hours",
          rating: 4.95,
          studentsCount: 2150,
          description: "Hands-on PyTorch, LLM fine-tuning, RAG pipelines, prompt engineering, and production AI agents.",
          whatYouWillLearn: [
            "Understand mathematical foundations of Gradient Descent and Backpropagation",
            "Build and train Convolutional & Recurrent Neural Networks in PyTorch",
            "Implement Retrieval-Augmented Generation (RAG) with Vector Databases",
            "Integrate LLMs securely into production web applications"
          ],
          curriculum: [
            {
              lessonNumber: 1,
              title: "Neural Network Architecture & Backprop",
              duration: "30 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
              content: "Explore perceptrons, activation functions (ReLU, Sigmoid), and loss gradients.",
              summary: "Backpropagation uses the chain rule to update weights iteratively.",
              resources: [{ name: "Deep Learning Foundations.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 2,
              title: "Transformers & Attention Mechanism",
              duration: "45 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/wjZofJX0v4U",
              content: "Understanding self-attention, Query-Key-Value matrices, and Positional Encodings.",
              summary: "Attention allows parallel sequence processing without recurrence bottlenecks.",
              resources: [{ name: "Attention Is All You Need Notes.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 3,
              title: "Building RAG with Vector Embeddings",
              duration: "40 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/tcqEjkKJg1w",
              content: "Chunking strategies, embedding generation, vector similarity search, and prompt injection mitigation.",
              summary: "Cosine similarity across embeddings retrieves top-K relevant contextual chunks.",
              resources: [{ name: "RAG Architecture Blueprint.pdf", url: "#", type: "pdf" }]
            }
          ]
        },
        {
          title: "Data Structures, Algorithms & System Design for MCA",
          category: "Placement Track",
          instructor: "Vikram Malhotra (Ex-FAANG)",
          difficulty: "All Levels",
          duration: "60 Hours",
          rating: 4.88,
          studentsCount: 4890,
          description: "Ace campus placements with 250+ curated LeetCode problems, high-level and low-level system designs.",
          whatYouWillLearn: [
            "Master complex graph algorithms, dynamic programming, and heaps",
            "Design scalable systems handling 100k+ concurrent requests",
            "Crush coding rounds of Microsoft, Amazon, Google, and top product startups",
            "Learn behavioral interview techniques and resume optimization"
          ],
          curriculum: [
            {
              lessonNumber: 1,
              title: "Two Pointers & Sliding Window Mastery",
              duration: "35 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/MK-NZ4hN7Rs",
              content: "Solve subarray problems with linear time complexity using sliding window templates.",
              summary: "Sliding window reduces O(N^2) brute force loops into clean O(N) linear passes.",
              resources: [{ name: "Sliding Window Cheatsheet.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 2,
              title: "Binary Trees, BSTs & Trie Architectures",
              duration: "45 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/fAAZixBzIAI",
              content: "Inorder, Preorder, Postorder, and Level Order traversals, and auto-complete with Tries.",
              summary: "Recursion on trees mirrors mathematical induction.",
              resources: [{ name: "Tree Algorithms Matrix.pdf", url: "#", type: "pdf" }]
            },
            {
              lessonNumber: 3,
              title: "High-Level System Design: Designing EduHub",
              duration: "55 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/UzLMhqg3_Wc",
              content: "Load balancers, distributed caching with Redis, database sharding, and CDN asset delivery.",
              summary: "Cap theorem guides trade-offs between consistency and availability.",
              resources: [{ name: "System Design Framework.pdf", url: "#", type: "pdf" }]
            }
          ]
        }
      ]);
    }

    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      console.log("🌱 Seeding MCA quizzes into MongoDB...");
      await Quiz.create([
        {
          title: "React 19 & Frontend Engineering Assessment",
          category: "Frontend",
          difficulty: "Medium",
          durationMinutes: 10,
          description: "Evaluate your knowledge of React 19 hooks, component architecture, and state management.",
          questions: [
            {
              questionText: "What hook in React 19 allows reading the value of a Promise or Context synchronously?",
              options: ["useAsync()", "use()", "usePromise()", "useResource()"],
              correctOptionIndex: 1,
              explanation: "React 19 introduced the use() API to consume resources synchronously within render.",
              topic: "React 19"
            },
            {
              questionText: "Why does React require keys when rendering lists of elements?",
              options: [
                "To optimize CSS layout calculation",
                "To help React identify which items have changed, been added, or removed during reconciliation",
                "To bind event listeners to the window object",
                "To ensure synchronous database synchronization"
              ],
              correctOptionIndex: 1,
              explanation: "Keys give elements a stable identity so the diffing algorithm minimizes DOM mutations.",
              topic: "Virtual DOM"
            },
            {
              questionText: "Which hook should be used to memorize an expensive computed calculation?",
              options: ["useCallback", "useMemo", "useRef", "useEffect"],
              correctOptionIndex: 1,
              explanation: "useMemo caches the result of a calculation between re-renders.",
              topic: "Performance"
            },
            {
              questionText: "What does the Virtual DOM provide over direct DOM manipulation?",
              options: [
                "Eliminates the need for JavaScript entirely",
                "Batches updates and computes minimal diffs before applying changes to the actual DOM",
                "Replaces the browser's rendering engine with WebAssembly",
                "Stores HTML inside localStorage permanently"
              ],
              correctOptionIndex: 1,
              explanation: "Virtual DOM computes diffs in memory to minimize expensive layout repaints.",
              topic: "Virtual DOM"
            }
          ]
        },
        {
          title: "Node.js, Express & Database Systems Quiz",
          category: "Backend & DBMS",
          difficulty: "Medium",
          durationMinutes: 10,
          description: "Test your understanding of Node.js event loop, Express middleware, and MongoDB query design.",
          questions: [
            {
              questionText: "How does Node.js handle non-blocking asynchronous I/O operations?",
              options: [
                "By spawning a new operating system thread for every single HTTP request",
                "Using the Libuv event loop and an underlying thread pool for asynchronous tasks",
                "By executing all code synchronously on multiple CPU cores automatically",
                "By compiling JavaScript code into native C++ binaries at runtime"
              ],
              correctOptionIndex: 1,
              explanation: "Node.js relies on Libuv to handle event-driven, non-blocking I/O across a single main thread.",
              topic: "Node.js Internals"
            },
            {
              questionText: "What is the primary role of the 'next()' function in an Express middleware?",
              options: [
                "Terminates the HTTP connection immediately",
                "Passes control to the next middleware function in the stack",
                "Reroutes the user back to the login page",
                "Commits the active database transaction"
              ],
              correctOptionIndex: 1,
              explanation: "Calling next() tells Express to invoke the next middleware in the chain.",
              topic: "Express"
            },
            {
              questionText: "In MongoDB, what does the ESR rule stand for when designing compound indexes?",
              options: [
                "Entity, System, Relation",
                "Equality, Sort, Range",
                "Encrypted, Secure, Replicated",
                "Execute, Save, Rollback"
              ],
              correctOptionIndex: 1,
              explanation: "The ESR rule advises structuring index keys in Equality first, Sort second, and Range third.",
              topic: "MongoDB"
            },
            {
              questionText: "Which database normal form eliminates transitive dependencies?",
              options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "BCNF"],
              correctOptionIndex: 2,
              explanation: "3NF requires that a relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.",
              topic: "DBMS"
            }
          ]
        }
      ]);
    }

    const materialCount = await Material.countDocuments();
    if (materialCount === 0) {
      console.log("🌱 Seeding study materials into MongoDB...");
      await Material.create([
        {
          title: "Comprehensive MERN Stack Placement Guide & Interview Questions",
          category: "Frontend",
          type: "notes",
          description: "150+ high-frequency interview questions covering React hooks, Node.js event loop, MongoDB, and system architecture.",
          size: "6.4 KB",
          downloadsCount: 1420,
          tags: ["React", "Node.js", "Interview", "MCA"],
          fileName: "MERN_Stack_Placement_Guide.md",
          fileUrl: "/notes/MERN_Stack_Placement_Guide.md",
          isFeatured: true
        },
        {
          title: "Database Management Systems (DBMS) Complete Revision Notes",
          category: "Database",
          type: "notes",
          description: "Detailed notes on SQL vs NoSQL, Indexing, B-Trees, Normalization (1NF to BCNF), and ACID Transactions.",
          size: "6.0 KB",
          downloadsCount: 980,
          tags: ["DBMS", "SQL", "MongoDB", "Normalization"],
          fileName: "DBMS_Complete_Revision_Notes.md",
          fileUrl: "/notes/DBMS_Complete_Revision_Notes.md",
          isFeatured: true
        },
        {
          title: "Data Structures & Algorithms Cheat Sheet (Python & Java)",
          category: "DSA",
          type: "cheatsheet",
          description: "Quick reference formulas, time/space complexities, graph patterns, and dynamic programming state transitions.",
          size: "4.6 KB",
          downloadsCount: 2850,
          tags: ["DSA", "LeetCode", "Algorithms", "Placement"],
          fileName: "DSA_Cheat_Sheet_Java_Python.md",
          fileUrl: "/notes/DSA_Cheat_Sheet_Java_Python.md",
          isFeatured: true
        },
        {
          title: "Docker, Kubernetes & AWS Cloud DevOps Cheat Sheet",
          category: "Cloud",
          type: "notes",
          description: "Essential Dockerfile syntax, Kubernetes pods/services, EC2 deployment scripts, and CI/CD pipelines.",
          size: "4.4 KB",
          downloadsCount: 760,
          tags: ["Docker", "AWS", "DevOps", "Cloud"],
          fileName: "DevOps_Cloud_Architecture_Guide.md",
          fileUrl: "/notes/DevOps_Cloud_Architecture_Guide.md",
          isFeatured: true
        }
      ]);
    } else {
      // Sync fileNames for existing seeded materials
      await Material.updateOne(
        { title: { $regex: /MERN/i }, fileName: { $exists: false } },
        { $set: { fileName: "MERN_Stack_Placement_Guide.md", fileUrl: "/notes/MERN_Stack_Placement_Guide.md", type: "notes" } }
      );
      await Material.updateOne(
        { title: { $regex: /Database|DBMS/i }, fileName: { $exists: false } },
        { $set: { fileName: "DBMS_Complete_Revision_Notes.md", fileUrl: "/notes/DBMS_Complete_Revision_Notes.md", type: "notes" } }
      );
      await Material.updateOne(
        { title: { $regex: /Data Structures|Algorithms|DSA/i }, fileName: { $exists: false } },
        { $set: { fileName: "DSA_Cheat_Sheet_Java_Python.md", fileUrl: "/notes/DSA_Cheat_Sheet_Java_Python.md", type: "cheatsheet" } }
      );
      await Material.updateOne(
        { title: { $regex: /Docker|DevOps|AWS/i }, fileName: { $exists: false } },
        { $set: { fileName: "DevOps_Cloud_Architecture_Guide.md", fileUrl: "/notes/DevOps_Cloud_Architecture_Guide.md", type: "notes" } }
      );
    }
  } catch (seedErr) {
    console.warn("Database auto-seed notice:", seedErr.message);
  }
};

// Trigger seed asynchronously
seedDatabaseIfEmpty();

// ==========================================
// 📚 COURSE MANAGEMENT ENDPOINTS
// ==========================================

// Create course
router.post('/create-course', verifyToken, createCourse);

// Fetch all courses
router.get('/get-all-courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch single course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update course (admin/instructor)
router.put('/courses/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, message: "Course updated successfully", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete course (admin)
router.delete('/courses/:id', verifyToken, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 📈 COURSE PROGRESS & LEARNING TRACKER
// ==========================================

// Get user progress for a course
router.get('/progress/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.query.userId || req.headers['x-user-id'] || "default-user";

    const enrollment = await Enrollment.findOne({ courseId, userId });
    res.status(200).json({
      success: true,
      enrollment: enrollment || {
        courseId,
        userId,
        completedLessons: [],
        progressPercentage: 0,
        notes: [],
        isCompleted: false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Enroll in course
router.post('/enroll', async (req, res) => {
  try {
    const { courseId, userId, courseTitle } = req.body;
    if (!courseId || !userId) {
      return res.status(400).json({ success: false, message: "Course ID and User ID are required" });
    }

    let enrollment = await Enrollment.findOne({ courseId, userId });
    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: "Already enrolled in this course",
        enrollment
      });
    }

    const course = await Course.findById(courseId).catch(() => null);
    enrollment = new Enrollment({
      courseId,
      userId,
      courseTitle: courseTitle || (course ? course.title : "Course"),
      completedLessons: [],
      progressPercentage: 0,
      lastLessonIndex: 1
    });

    await enrollment.save();

    // Increment studentsCount in Course if valid
    if (course) {
      course.studentsCount = (course.studentsCount || 0) + 1;
      await course.save().catch(() => null);
    }

    res.status(201).json({
      success: true,
      message: "Enrolled in course successfully! 🎉",
      enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all enrolled courses for a student with course details
router.get('/my-learning/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ userId }).sort({ updatedAt: -1 });

    // Fetch course details for each enrollment
    const myLearning = await Promise.all(
      enrollments.map(async (enr) => {
        const course = await Course.findById(enr.courseId).catch(() => null);
        return {
          enrollmentId: enr._id,
          courseId: enr.courseId,
          title: course ? course.title : (enr.courseTitle || "Course"),
          category: course ? course.category : "Development",
          difficulty: course ? course.difficulty : "Intermediate",
          instructor: course ? course.instructor : "EduHub Faculty",
          duration: course ? course.duration : "40 Hours",
          rating: course ? course.rating : 4.9,
          totalLessons: course && course.curriculum ? course.curriculum.length : 4,
          completedLessons: enr.completedLessons,
          progressPercentage: enr.progressPercentage,
          lastLessonIndex: enr.lastLessonIndex || 1,
          isCompleted: enr.isCompleted,
          certificateId: enr.certificateId,
          updatedAt: enr.updatedAt
        };
      })
    );

    res.status(200).json({ success: true, myLearning });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle lesson completion & calculate progress %
router.post('/progress/toggle-lesson', async (req, res) => {
  try {
    const { courseId, userId, lessonNumber, totalLessons, studentName, studentEmail } = req.body;

    if (!courseId || !userId || lessonNumber === undefined) {
      return res.status(400).json({ success: false, message: "Missing course or lesson reference" });
    }

    let enrollment = await Enrollment.findOne({ courseId, userId });
    if (!enrollment) {
      enrollment = new Enrollment({
        courseId,
        userId,
        completedLessons: [],
        progressPercentage: 0
      });
    }

    const num = Number(lessonNumber);
    const index = enrollment.completedLessons.indexOf(num);
    let justCompleted = false;

    if (index > -1) {
      enrollment.completedLessons.splice(index, 1);
    } else {
      enrollment.completedLessons.push(num);
      justCompleted = true;
    }

    const total = totalLessons || 4;
    const percentage = Math.min(100, Math.round((enrollment.completedLessons.length / total) * 100));
    enrollment.progressPercentage = percentage;
    enrollment.lastLessonIndex = num;

    let certificateData = null;

    // Check if course has reached 100% completion
    if (percentage === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();

      // Auto-issue verified Certificate!
      const course = await Course.findById(courseId).catch(() => null);
      const courseTitle = course ? course.title : "Full-Stack Development Track";
      const certId = `EDUHUB-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`;

      const newCert = new Certificate({
        certificateId: certId,
        userId,
        studentName: studentName || "Papu Das",
        studentEmail: studentEmail || "papu@eduhub.com",
        courseId,
        courseTitle,
        grade: "Distinction (O)",
        instructorName: course ? course.instructor : "Siddharth Roy, Senior Tech Lead"
      });

      await newCert.save().catch(err => console.log("Cert save notice:", err.message));
      enrollment.certificateId = certId;
      certificateData = newCert;
    }

    await enrollment.save();

    // Award XP if just marked completed
    let xpAwarded = justCompleted ? 50 : 0;

    res.status(200).json({
      success: true,
      message: justCompleted ? "Lesson completed! +50 XP ⚡" : "Lesson marked as uncompleted",
      enrollment,
      xpAwarded,
      certificate: certificateData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save lesson note
router.post('/progress/save-note', async (req, res) => {
  try {
    const { courseId, userId, lessonIndex, noteText } = req.body;
    let enrollment = await Enrollment.findOne({ courseId, userId });
    if (!enrollment) {
      enrollment = new Enrollment({ courseId, userId, notes: [] });
    }

    const existingNoteIdx = enrollment.notes.findIndex(n => n.lessonIndex === lessonIndex);
    if (existingNoteIdx > -1) {
      enrollment.notes[existingNoteIdx].noteText = noteText;
      enrollment.notes[existingNoteIdx].updatedAt = new Date();
    } else {
      enrollment.notes.push({ lessonIndex, noteText, updatedAt: new Date() });
    }

    await enrollment.save();
    res.status(200).json({ success: true, message: "Note saved successfully!", notes: enrollment.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 🎯 QUIZZES & ASSESSMENTS ENDPOINTS
// ==========================================

// Get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.correctOptionIndex -questions.explanation");
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single quiz with questions for taking the test
router.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit quiz and calculate score, strong/weak topics, XP
router.post('/quizzes/submit', async (req, res) => {
  try {
    const { quizId, userId, answers, timeTakenSeconds } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    let correctCount = 0;
    const strongTopics = new Set();
    const weakTopics = new Set();
    const reviewDetails = [];

    quiz.questions.forEach((q, idx) => {
      const studentAns = answers ? answers[idx] : undefined;
      const isCorrect = studentAns === q.correctOptionIndex;

      if (isCorrect) {
        correctCount++;
        strongTopics.add(q.topic || "Core Concept");
      } else {
        weakTopics.add(q.topic || "Core Concept");
      }

      reviewDetails.push({
        questionText: q.questionText,
        options: q.options,
        studentAnswer: studentAns,
        correctAnswer: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic
      });
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const accuracy = score;
    const xpEarned = correctCount * 25 + 50;

    // Save attempt record
    const attempt = new QuizAttempt({
      userId: userId || "default-user",
      quizId,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timeTakenSeconds: timeTakenSeconds || 120,
      strongTopics: Array.from(strongTopics),
      weakTopics: Array.from(weakTopics),
      xpEarned
    });

    await attempt.save().catch(err => console.log("Attempt save notice:", err.message));

    res.status(200).json({
      success: true,
      result: {
        score,
        totalQuestions,
        correctCount,
        accuracy,
        timeTakenSeconds: timeTakenSeconds || 120,
        strongTopics: Array.from(strongTopics),
        weakTopics: Array.from(weakTopics),
        xpEarned,
        reviewDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's quiz attempt history
router.get('/quizzes/history/:userId', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 📖 STUDY MATERIALS RESOURCE LIBRARY
// ==========================================

// Get all study materials
router.get('/materials', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const materials = await Material.find(query).sort({ downloadsCount: -1 });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create study material / note (admin or student)
router.post('/materials/create', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let authorName = req.body.author || "EduHub Contributor";
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded && decoded.name) {
            authorName = decoded.name;
          }
        } catch {}
      }
    }

    const payload = {
      ...req.body,
      author: authorName,
      type: req.body.type || "notes",
      downloadsCount: req.body.downloadsCount || 0,
      size: req.body.size || "3.5 KB"
    };

    if (!payload.fileName && payload.title) {
      payload.fileName = payload.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() + ".md";
    }

    const material = new Material(payload);
    await material.save();
    res.status(201).json({ success: true, message: "Study notes published successfully!", material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Increment download count
router.post('/materials/download/:id', async (req, res) => {
  try {
    const mat = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
    res.status(200).json({ success: true, downloadsCount: mat ? mat.downloadsCount : 0, material: mat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct file download endpoint for browser/Chrome
router.get('/materials/download-file/:id', async (req, res) => {
  try {
    const mat = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
    if (!mat) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    const filename = mat.fileName || `${(mat.title || 'study_notes').replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');

    let body = mat.content;
    if (!body || !body.trim()) {
      body = `# ${mat.title}\n\n**Category:** ${mat.category}\n**Author:** ${mat.author || 'EduHub Faculty'}\n**Tags:** ${(mat.tags || []).join(', ')}\n\n## Overview\n${mat.description || 'Comprehensive study notes prepared for MCA examinations.'}\n\n## Table of Contents & Key Concepts\n- Core Definitions & Conceptual Foundations\n- Theoretical Frameworks and Architectural Patterns\n- Practical Implementation Guidelines\n- High-Yield MCA Placement Interview Questions\n`;
    }

    res.send(body);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 🏆 CERTIFICATES & VERIFICATION
// ==========================================

// Get all certificates earned by student
router.get('/certificates/user/:userId', async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public certificate verification endpoint
router.get('/certificates/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId });
    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or ID is invalid."
      });
    }
    res.status(200).json({
      success: true,
      certificate: cert,
      message: "Certificate verified officially by EduHub Academic Credential System."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Issue manual certificate (admin)
router.post('/certificates/issue', verifyToken, async (req, res) => {
  try {
    const { studentName, studentEmail, courseTitle, courseId, userId } = req.body;
    const certId = `EDUHUB-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`;

    const cert = new Certificate({
      certificateId: certId,
      userId: userId || "manual-user",
      studentName,
      studentEmail,
      courseTitle,
      courseId: courseId || "custom",
      grade: "Distinction (O)"
    });

    await cert.save();
    res.status(201).json({ success: true, message: "Certificate issued successfully", certificate: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 📊 ADMIN & ANALYTICS OVERVIEW
// ==========================================

router.get('/admin/stats', async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalQuizzes, totalMaterials, totalCertificates] = await Promise.all([
      Contact.countDocuments(),
      Course.countDocuments(),
      Quiz.countDocuments(),
      Material.countDocuments(),
      Certificate.countDocuments()
    ]);

    const recentUsers = await Contact.find().select("-password").sort({ createdAt: -1 }).limit(5);
    const recentCertificates = await Certificate.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents: Math.max(totalStudents, 35),
        totalCourses: Math.max(totalCourses, 4),
        totalQuizzes: Math.max(totalQuizzes, 2),
        totalMaterials: Math.max(totalMaterials, 4),
        totalCertificates: Math.max(totalCertificates, 12),
        placementRate: "98.4%",
        activeDemos: "Real-time"
      },
      recentUsers,
      recentCertificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ⚡ ACADEMIC TASK TRACKER (PRESERVED)
// ==========================================

router.get('/get-all-tasks', async (req, res) => {
  try {
    let tasks = await Task.find();
    if (tasks.length === 0) {
      tasks = [
        { _id: "T1", taskDetail: "MERN Stack Secure Authentication Lab", courseStream: "Full-Stack Development", dueDate: "2026-09-20", type: "Assignment", status: "Completed" },
        { _id: "T2", taskDetail: "MongoDB Aggregation Pipeline Benchmark", courseStream: "DBMS", dueDate: "2026-09-24", type: "Practical", status: "Pending" },
        { _id: "T3", taskDetail: "AI Transformer Architecture Quiz", courseStream: "Artificial Intelligence", dueDate: "2026-09-28", type: "Quiz", status: "Pending" }
      ];
    }
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/toggle-task-status/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task document not found" });
    }
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    await task.save();
    res.status(200).json({ success: true, message: `Task marked as ${task.status}!`, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 🔑 ACCOUNT SECURITY & IDENTITY (PRESERVED & ENHANCED)
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneno, city, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required",
      });
    }

    const existingUser = await Contact.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Contact({
      name,
      email,
      password: hashedPassword,
      phoneno,
      city,
      address,
      role: role || "student",
      xp: 150,
      streak: 5,
      level: 1,
      badges: ["🔥 7 Day Streak", "📚 Learning Champion"]
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        xp: newUser.xp,
        streak: newUser.streak,
        level: newUser.level
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Contact.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "student" },
      process.env.JWT_SECRET || "default_jwt_secret_key_12345",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
        city: user.city,
        address: user.address,
        role: user.role || "student",
        xp: user.xp || 240,
        streak: user.streak || 5,
        level: user.level || 2,
        badges: user.badges || ["🔥 7 Day Streak", "📚 Learning Champion"]
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Current user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await Contact.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phoneno, city, address } = req.body;
    const updated = await Contact.findByIdAndUpdate(
      req.user.id,
      { name, phoneno, city, address },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "Profile updated successfully", user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 📞 CRM GLOBAL CONTACT PATHS (PRESERVED)
// ==========================================

router.post("/create", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Contact Created Successfully", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/contact-list", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/find-by/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact Not Found" });
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update-contact-by-id/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) return res.status(404).json({ success: false, message: "Contact Not Found" });
    res.status(200).json({ success: true, message: "Contact Updated Successfully", contact: updatedContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete-contact-by-id/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) return res.status(404).json({ success: false, message: "Contact Not Found" });
    res.status(200).json({ success: true, message: "Contact Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
