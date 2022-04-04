import { Document, Schema } from "mongoose";
export interface DishesTypes {
  dishName: String;
  dishTags: Object[];
  dishMaterial: Object[];
  dishStep: Object[];
  dishLike: String[];
  dishHate: String[];
  dishComment: Object[];
  dishUploader: string;
}
export const DishesSchema: Schema = new Schema({
  dishName: {
    type: String,  
  },
  dishTags: Array,
  dishMaterial: Array,
  dishStep: Array,
  dishLike: Array,
  dishHate: Array,
  dishComment: Array,
  dishUploader: String,
});
