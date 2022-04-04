// import dishes from "../db/models/dishes";
import Dishes from "../db/models/dishes";
import User from "../db/models/user";
// import { DishesTypes } from '../db/schemas/dishes';
export default class DishesService {
  public async addDishes(
    dishUploader: String,
    dishName: String,
    dishTags: Object[],
    // dishMaterial: String[],
    dishStep: Object[]
  ) {
    const dishes = new Dishes({
      dishName,
      dishTags,
      dishMaterial: [""],
      dishStep,
      dishLike: [],
      dishHate: [],
      dishComment: [],
      dishUploader,
    });
    try {
      let res = await dishes.save();
      let dishId = dishes.get("_id");
      const user = await User.findById(dishUploader);
      let userDishesNew = user.userDishes;
      userDishesNew.push(dishId);
      // console.log(userDishesNew+"userDishesNew");

      if (user) {
        await User.updateOne(
          { _id: dishUploader },
          { $set: { userDishes: userDishesNew } }
        );
      } else {
        throw new Error("您未登录");
      }
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async editDish(
    dishName: String,
    dishTags: Object[],
    dishStep: Object[],
    dishId: String
  ) {
    try {
      let dish = await Dishes.findById(dishId);
      if (dish) {
        let data = await Dishes.updateOne(
          { _id: dishId },
          { $set: { dishName, dishTags, dishStep } }
        );
        return data;
      } else {
        throw new Error("此菜品不存在");
      }
    } catch (error) {
      throw error;
    }
  }
  public async deleteDishes(dishId: string, userId: String) {
    try {
      const user = await User.findById(userId);
      if (user) {
        let userDishesTemple = user.userDishes;
        let index = userDishesTemple.findIndex((value: String) => {
          return value == dishId;
        });

        userDishesTemple.splice(index, 1);

        await User.updateOne(
          { _id: userId },
          { $set: { userDishes: userDishesTemple } }
        );
      } else {
        throw new Error("用户不存在或未登录");
      }
      return await Dishes.findByIdAndDelete(dishId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async addDishLike(dishId: String, userId: String) {
    const user = await User.findById(userId);
    const dishes = await Dishes.findById(dishId);
    try {
      if (user) {
        let userLikeTemple = user.userLike;
        let index = userLikeTemple.findIndex((value: String) => {
          return value === dishId;
        });
        if (index < 0) {
          userLikeTemple.push(dishId);
          await User.updateOne(
            { _id: userId },
            { $set: { userLike: userLikeTemple } }
          );

          if (dishes) {
            let dishLikeTemple = dishes.dishLike;
            let index = dishLikeTemple.findIndex((value: String) => {
              return value === userId;
            });
            if (index < 0) {
              dishLikeTemple.push(userId);
            }

            let res = await Dishes.updateOne(
              { _id: dishId },
              { $set: { dishLike: dishLikeTemple } }
            );
            return res;
          } else {
            throw new Error("菜品不存在或已删除");
          }
        } else {
          throw new Error("您已点过喜欢按钮了");
        }

        // 即使已经throw error了后面的代码还是会执行所以要放在if里
        // await User.updateOne(
        //   { _id: userId },
        //   { $set: { userLike: userLikeTemple } }
        // );
      } else {
        throw new Error("您未登录或用户不存在");
      }
    } catch (error) {
      throw error;
    }
  }
  public async deleteDishLike(dishId: String, userId: String) {
    const user = await User.findById(userId);
    const dishes = await Dishes.findById(dishId);
    if (user) {
      let userLikeTemple = user.userLike;
      let index = userLikeTemple.findIndex((value: String) => {
        return value === dishId;
      });
      if (index < 0) {
        throw new Error("您已取消喜欢按钮");
      } else {
        userLikeTemple.splice(index, 1);
      }
      await User.updateOne(
        { _id: userId },
        { $set: { userLike: userLikeTemple } }
      );
    } else {
      throw new Error("您未登录或用户不存在");
    }

    if (dishes) {
      let dishLikeTemple = dishes.dishLike;
      let index = dishLikeTemple.findIndex((value: String) => {
        return value === userId;
      });
      dishLikeTemple.splice(index, 1);
      let res = await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishLike: dishLikeTemple } }
      );
      return res;
    } else {
      throw new Error("菜品不存在或已删除");
    }
  }
  public async addDishHate(dishId: String, userId: String) {
    const user = await User.findById(userId);
    if (user) {
      let userDislikeTemple = user.userDislike;
      let index = userDislikeTemple.findIndex((value: String) => {
        return value === dishId;
      });
      if (index < 0) {
        userDislikeTemple.push(dishId);
      } else {
        throw new Error("您已点过讨厌按钮了");
      }
      // userDislikeTemple.push(dishId);
      await User.updateOne(
        { _id: userId },
        { $set: { userDislike: userDislikeTemple } }
      );
    } else {
      throw new Error("您未登录或用户不存在");
    }
    let dishes = await Dishes.findById(dishId);
    if (dishes) {
      let dishHateTemple = dishes.dishHate;
      dishHateTemple.push(userId);
      let res = await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishHate: dishHateTemple } }
      );
      return res;
    } else {
      throw new Error("菜品不存在或已删除");
    }
  }
  public async deleteDishHate(dishId: String, userId: String) {
    const user = await User.findById(userId);
    if (user) {
      let userDislikeTemple = user.userDislike;
      let index = userDislikeTemple.findIndex((value: String) => {
        return value === dishId;
      });
      if (index < 0) {
        throw new Error("您已取消讨厌按钮");
      } else {
        userDislikeTemple.splice(index, 1);
      }
      await User.updateOne(
        { _id: userId },
        { $set: { userDislike: userDislikeTemple } }
      );
    } else {
      throw new Error("您未登录或用户不存在");
    }
    let dishes = await Dishes.findById(dishId);
    if (dishes) {
      let dishHateTemple = dishes.dishHate;
      let index = dishHateTemple.findIndex((value: String) => {
        return value === userId;
      });
      dishHateTemple.splice(index, 1);
      let res = await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishHate: dishHateTemple } }
      );
      return res;
    } else {
      throw new Error("菜品不存在或已删除");
    }
  }
  public async editDishTags(dishId: String, dishTagsNew: Object[]) {
    try {
      let dishes = await Dishes.findById(dishId);
      if (dishes) {
        let res = await Dishes.updateOne(
          { _id: dishId },
          { $set: { dishTags: dishTagsNew } }
        );
        return res;
      } else {
        throw new Error("未能通过id找到菜品");
      }
    } catch {
      throw new Error("修改标签失败");
    }
  }
  public async editDishStep(dishId: String, dishStepNew: Object[]) {
    let dishes = await Dishes.findById(dishId);
    if (dishes) {
      let res = await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishStep: dishStepNew } }
      );
      return res;
    } else {
      throw new Error("未能通过id找到菜品");
    }
  }
  public async getAuthorDishes(userId: string) {
    try {
      const dishesRes = await Dishes.find({ dishUploader: userId });
      const userRes = await User.find({ _id: userId });
      // console.log({ dishesRes, userRes });
      return { dishesRes, userRes };
    } catch (error) {
      throw error;
    }
  }
  public async getDishInform(dishId: String) {
    try {
      let dishRes = await Dishes.findOne({ _id: dishId });
      if (!dishRes) {
        throw new Error("菜品未找到或已被删除");
      }
      let userRes = await User.findById(dishRes.dishUploader);
      if (!userRes) {
        throw new Error("创作者未找到或已注销");
      }
      return { dishRes, userRes };
    } catch (error) {
      throw error;
    }
  }
  // public async updateDishesStatus(dishId: string) {
  //   try {
  //     const oldRecord = await Dishes.findById(dishId);
  //     const record = await Dishes.findByIdAndUpdate(dishId, {
  //       status: !oldRecord?.status,
  //     });
  //     return record;
  //   } catch (error) {
  //     throw new Error("更新状态失败 (￣o￣).zZ");
  //   }
  // }
  // public async updateDishesContent(dishName: String,
  //   dishTags: String[],
  //   dishMaterial: Object[],
  //   dishStep: Object[],
  //   dishLike: String[],
  //   dishHate: String[],
  //   dishComment: Object[],
  //   dishUploader: string) {
  //   try {
  //     return await Dishes.findByIdAndUpdate(dishName);
  //   } catch (error) {
  //     throw new Error("更新内容失败 (￣o￣).zZ");
  //   }
  // }
  // public async searchDishes(userId: string, query: string) {
  //   try {
  //     // MongoDB Text Search 对中文支持不佳
  //     // e.g. 当 query 为“你好”，“你好张三"不匹配，”你好，张三“匹配
  //     // return await User.findById(userId).populate({
  //     //   path: 'Dishess',
  //     //   match: { $text: { $search: query } },
  //     // });
  //     return await User.findById(userId).populate({
  //       path: "dishess",
  //       match: { content: { $regex: new RegExp(query), $options: "i" } },
  //     });
  //   } catch (error) {
  //     throw new Error("查询失败 (￣o￣).zZ");
  //   }
  // }
}
