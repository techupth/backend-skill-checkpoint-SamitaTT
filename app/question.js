import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

questionRouter.get("/", async function (req, res) {
  try {
    const title = req.query.keyword;
    const categories = req.query.categories;
    const query = {};
    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (categories) {
      query.categories = new RegExp(categories, "i");
    }

    const collection = db.collection("questions");
    const questions = await collection.find(query).limit(10).toArray();

    return res.json({ data: questions });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load Data server",
    });
  }
});

questionRouter.get("/:questionId", async function (req, res) {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.questionId);
    const questionById = await collection.findOne({ _id: questionId });

    return res.json({ data: questionById });
  } catch (error) {
    return res.status(404).json({
      message: "Question Not Found",
    });
  }
});

questionRouter.post("/", async function (req, res) {
  try {
    const collection = db.collection("questions");
    const questionData = { ...req.body, created_at: new Date() };
    const questions = await collection.insertOne(questionData);

    return res.json({
      message: "Question has been created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid assignment data",
    });
  }
});

questionRouter.put("/:questionId", async function (req, res) {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.questionId);
    const newQuestionData = { ...req.body, modified_at: new Date() };
    await collection.updateOne({ _id: questionId }, { $set: newQuestionData });
    return res.json({
      message: "Question has been updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid assignment data",
    });
  }
});

questionRouter.delete("/:questionId", async function (req, res) {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.questionId);
    await collection.deleteOne({ _id: questionId });
    return res.json({
      message: "Question has been deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: "Question Not Found",
    });
  }
});

questionRouter.post("/:questionId", async function (req, res) {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.questionId);
    const answerData = { ...req.body, created_at: new Date() };

    const answer = await collection.updateOne(
      { _id: questionId },
      { $push: { comments: { answerData } } }
    );
    return res.json({
      message: "Answer has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default questionRouter;
