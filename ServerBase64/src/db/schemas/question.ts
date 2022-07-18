import { Document, Schema } from "mongoose";

export const QuestionSchema = new Schema({
  userId: String,
  dishId: String,
  questionContent: String,
});
