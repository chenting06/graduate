import { Document, Schema } from "mongoose";

export const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  // userName:String,
  userHeight: Number,
  userWeight: Number,
  userWorkout: String,
  userIcon: String,
  userComment: Array,
  userDishes: Array,
  userPsd: String,
  userLike: Array,
  userDislike: Array,
  userNutritionEnergy: Array,
  userNutritionWeight: Array,
  userRecommendation: Object,
  userEvaluate:Array
});
