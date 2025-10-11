import { v4 as uuidv4 } from "uuid";
import db from "../config/dbConfig.js";

// ================== GET all questions ==================
export const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await db.query(
      `SELECT q.id, q.question_id, q.title, q.description, q.tag, q.created_at, q.updated_at, 
              u.username, u.user_id 
       FROM questions q 
       JOIN users u ON q.user_id = u.user_id 
       ORDER BY q.created_at DESC`
    );
    res.status(200).json({ message: "All questions retrieved", questions });
  } catch (err) {
    console.error("Get All Questions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== GET single question ==================
export const getSingleQuestion = async (req, res) => {
  const { question_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT q.id, q.question_id, q.title, q.description, q.tag, q.user_id, u.username FROM questions q JOIN users u ON q.user_id = u.user_id WHERE q.question_id = ?",
      [question_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ question: rows[0] });
  } catch (err) {
    console.error("Get Single Question Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== CREATE question ==================
export const createQuestion = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const question_id = uuidv4();
    await db.query(
      "INSERT INTO questions (question_id, user_id, title, description, tag, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [question_id, req.user.id, title, description, tag || null]
    );

    res
      .status(201)
      .json({ message: "Question created successfully", question_id });
  } catch (err) {
    console.error("Create Question Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================== UPDATE question ==================
export const updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const { title, description } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE questions SET title = ?, description = ? WHERE question_id = ?",
      [title, description, question_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

