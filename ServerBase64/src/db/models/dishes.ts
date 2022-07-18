import { model } from "mongoose";

import { DishesSchema } from "../schemas/dishes";

export default model("Dishes", DishesSchema,'dishes');
