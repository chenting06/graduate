import { model } from "mongoose";
import { QuestionSchema } from "../schemas/question";
export default model("Question",QuestionSchema,'questions')