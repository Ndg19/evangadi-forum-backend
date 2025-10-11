import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);

// PUT route for editing a question
router.put("/edit/:question_id", updateQuestion);

export default router;
