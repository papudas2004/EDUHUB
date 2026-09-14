// controllers/courseController.js
const Course = require('../model/coursemodel'); // 🟢 Switch to our clean Course schema

const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ error: "Title and Category fields are required." });
    }

    // 🟢 SAVES DIRECTLY TO THE CLEAN COURSES TABLE (No email/password requirements!)
    const newCourse = new Course({
      title,
      category
    });

    await newCourse.save();
    console.log(`🟢 Successfully saved "${title}" into the separate courses collection.`);

    res.status(201).json({ 
      success: true, 
      message: "Course published successfully onto separate course indexes!" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCourse };
