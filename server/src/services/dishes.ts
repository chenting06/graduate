// import dishes from "../db/models/dishes";
import Dishes from "../db/models/dishes";
import User from "../db/models/user";
import Question from "../db/models/question";
import {
  flavorComposition,
  nutrentComposition,
} from "../../src/public/commonImplement";
import dishes from "../db/models/dishes";
// import { DishesTypes } from '../db/schemas/dishes';
async function addDishEvaluate(dishId: String, userId: String, value: number) {
  try {
    console.log(userId + "userId");
    const user = await User.findOne({ _id: userId });
    const dish = await Dishes.findOne({ _id: dishId });
    if (!user || !dish) {
      throw new Error("用户或菜品不存在");
    }
    let userEvaluateTemple = user.userEvaluate;
    let dishEvaluateTemple = dish.dishEvaluate;
    // console.log(dish.dishEvaluate);
    // console.log("dish.dishEvaluate");

    let isEditUser = false;
    let isEditDish = false;
    if (userEvaluateTemple.length > 0) {
      userEvaluateTemple.map(function (item: any, index: number) {
        // console.log(typeof item.dishId + "item.dishId");
        // console.log(typeof dish._id + "dish._id");
        // dishId为String类型，dish._id为object类型
        if (item.dishId == dish._id) {
          userEvaluateTemple[index] = { dishId, value };
          isEditUser = true;
          // throw new Error("您已评价过了");
        }
      });
    }
    if (dishEvaluateTemple.length > 0) {
      dishEvaluateTemple.map(function (item: any, index: number) {
        if (item.userId == user._id) {
          // console.log("修改dish里的user ");
          dishEvaluateTemple[index] = { userId, value };
          isEditDish = true;
          // throw new Error("您已评价过了");
        }
      });
    }
    if (!isEditDish) {
      // console.log("增加dish里的user");

      // userEvaluateTemple.push({ dishId, value });
      dishEvaluateTemple.push({ userId, value });
      // console.log(dishEvaluateTemple);
    }
    if (!isEditUser) {
      userEvaluateTemple.push({ dishId, value });
      // dishEvaluateTemple.push({ userId, value });
    }

    await User.updateOne(
      { _id: userId },
      { $set: { userEvaluate: userEvaluateTemple } }
    );
    let res = await dishes.updateOne(
      { _id: dishId },
      { $set: { dishEvaluate: dishEvaluateTemple } }
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// 批量修改数据库里的数据
async function deleteUserEvaluate() {
  await User.updateMany({ userComment: [] }, { $set: { userEvaluate: [] } });
  await Dishes.updateMany({ dishComment: [] }, { $set: { dishEvaluate: [] } });
}
export default class DishesService {
  public async addDishes(
    dishUploader: String,
    dishName: String,
    dishTags: Object[],
    // dishMaterial: String[],
    dishStep: Object[],
    mealTime: String
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
      dishNutritionEnergy: [],
      dishNutritionWeight: [],
      mealTime,
      dishEvaluate: [],
    });
    try {
      let res = await dishes.save();
      let dishId = dishes.get("_id");
      let dishNutritionEnergy = [0, 0, 0];
      let dishNutritionWeight = [0, 0, 0];
      dishTags.map(async function (item, index) {
        let tagName = Object.keys(item)[0];
        let tagValue = Object.values(item)[0];
        let flavorTest = /.*(酱|末|碎|酒|汁|糖|片|段)$/;

        if (flavorTest.test(tagName)) {
          return;
        } else {
          if (flavorComposition.indexOf(tagName) < 0) {
            // console.log(Object.keys(nutrentComposition));
            // console.log(Object.keys(nutrentComposition).indexOf(tagName));
            let tagIndex = -1;
            nutrentComposition.map(function (item, index) {
              if (Object.keys(item)[0] === tagName) {
                tagIndex = index;
              }
            });
            if (tagIndex < 0) {
              let question = new Question({
                userId: dishUploader,
                dishId,
                questionContent: tagName,
              });
              await question.save();
            } else {
              Object.values(nutrentComposition[tagIndex])[0].map(function (
                item,
                index
              ) {
                dishNutritionWeight[index] +=
                  (Number(item) * Number(tagValue)) / 100;
                if (index === 1) {
                  dishNutritionEnergy[index] +=
                    ((Number(item) * Number(tagValue)) / 100) * 9;
                } else {
                  dishNutritionEnergy[index] +=
                    ((Number(item) * Number(tagValue)) / 100) * 4;
                }
              });
            }
          } else {
            return;
          }
        }
      });
      await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishNutritionEnergy, dishNutritionWeight } }
      );
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
    dishId: String,
    userId: String
  ) {
    try {
      let dish = await Dishes.findById(dishId);
      if (dish) {
        let dishNutritionEnergy = [0, 0, 0];
        let dishNutritionWeight = [0, 0, 0];
        dishTags.map(async function (item, index) {
          let tagName = Object.keys(item)[0];
          let tagValue = Object.values(item)[0];
          let flavorTest = /.*(酱|末|碎|油)$/;

          if (flavorTest.test(tagName) || tagValue < 20) {
            return;
          } else {
            // 测试名字和剂量是否符合调料
            if (flavorComposition.indexOf(tagName) < 0) {
              // console.log(Object.keys(nutrentComposition));
              // console.log(Object.keys(nutrentComposition).indexOf(tagName));
              let tagIndex = -1;
              nutrentComposition.map(function (item, index) {
                if (Object.keys(item)[0] === tagName) {
                  tagIndex = index;
                }
              });
              if (tagIndex < 0) {
                let question = new Question({
                  userId,
                  dishId,
                  questionContent: tagName,
                });
                await question.save();
              } else {
                Object.values(nutrentComposition[tagIndex])[0].map(function (
                  item,
                  index
                ) {
                  dishNutritionWeight[index] +=
                    (Number(item) * Number(tagValue)) / 100;
                  if (index === 1) {
                    dishNutritionEnergy[index] +=
                      ((Number(item) * Number(tagValue)) / 100) * 9;
                  } else {
                    dishNutritionEnergy[index] +=
                      ((Number(item) * Number(tagValue)) / 100) * 4;
                  }
                });
              }
            } else {
              return;
            }
          }
        });

        let data = await Dishes.updateOne(
          { _id: dishId },
          {
            $set: {
              dishName,
              dishTags,
              dishStep,
              dishNutritionEnergy,
              dishNutritionWeight,
            },
          }
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
  public async addDishEvaluate(dishId: String, userId: String, value: number) {
    try {
      console.log(userId + "userId");
      const user = await User.findOne({ _id: userId });
      const dish = await Dishes.findOne({ _id: dishId });
      if (!user || !dish) {
        throw new Error("用户或菜品不存在");
      }
      let userEvaluateTemple = user.userEvaluate;
      let dishEvaluateTemple = dish.dishEvaluate;
      let isEditUser = false;
      let isEditDish = false;
      if (userEvaluateTemple.length > 0) {
        userEvaluateTemple.map(function (item: any, index: number) {
          // console.log(typeof item.dishId + "item.dishId");
          // console.log(typeof dish._id + "dish._id");
          // dishId为String类型，dish._id为object类型
          if (item.dishId == dish._id) {
            userEvaluateTemple[index] = { dishId, value };
            isEditUser = true;
            // throw new Error("您已评价过了");
          }
        });
      }
      if (dishEvaluateTemple.length > 0) {
        dishEvaluateTemple.map(function (item: any, index: number) {
          if (item.userId == user._id) {
            console.log("修改dish里的user ");

            dishEvaluateTemple[index] = { userId, value };
            isEditDish = true;
            // throw new Error("您已评价过了");
          }
        });
      }
      if (!isEditUser) {
        userEvaluateTemple.push({ dishId, value });
        // dishEvaluateTemple.push({ userId, value });
      }
      if (!isEditDish) {
        console.log("增加dish里的user");

        // userEvaluateTemple.push({ dishId, value });
        dishEvaluateTemple.push({ userId, value });
      }
      await User.updateOne(
        { _id: userId },
        { $set: { userEvaluate: userEvaluateTemple } }
      );
      let res = await Dishes.updateOne(
        { _id: dishId },
        { $set: { dishEvaluate: dishEvaluateTemple } }
      );
      return res;
    } catch (error) {
      console.log(error);

      throw error;
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
  public async getAllDishes(page: number, size: number) {
    console.log(page);
    console.log(size);

    try {
      let result = await dishes.find();
      // console.log(result);
      // let resultTemple = result.slice(0,1);
      let resultTemple = result.slice(page * size, (page + 1) * size);
      // console.log(resultTemple);

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public async guessYouLike(userId: String) {
    try {
      let userAll = await User.find({});
      let dishAll = await Dishes.find({});
      // 不能用userAll.map(async function (item: any, index: number)循环
      // 因为循环体里面有异步函数
      for (let userIndex = 0; userIndex < userAll.length; userIndex++) {
        let dishIdNotChoosed = dishAll.map(function (item: any, index: any) {
          let id = String(item._id);
          return id;
        });
        userAll[userIndex].userEvaluate.map(function (
          item: any,
          index: number
        ) {
          let choosedIndex = dishIdNotChoosed.indexOf(item.dishId);
          if (choosedIndex > 0 || choosedIndex === 0) {
            dishIdNotChoosed.splice(choosedIndex, 1);
          }
        });
        for (let i = 0; i < dishIdNotChoosed.length; i++) {
          let id = String(userAll[userIndex]._id);
          await addDishEvaluate(String(dishIdNotChoosed[i]), String(id), 0);
        }
      }
      let userAllFinal = await User.find({}, "_id userEvaluate");
      let dishAllFianl = await Dishes.find({}, "_id");
      // 所有userEvaluate字段
      let dataFather: any = [];
      // userId的userEvaluate字段
      let dataChild: any = {};
      userAllFinal.map(function (
        item: {
          _id: String;
          userEvaluate: { dishId: String; value: number }[];
        },
        index: number
      ) {
        let userEvaluateObject: any = {};
        if (item.userEvaluate) {
          for (let i = 0; i < item.userEvaluate.length; i++) {
            // console.log(item.userEvaluate[i].value);
            // console.log(item.userEvaluate[i].dishId);
            // console.log(i);
            let value = item.userEvaluate[i].value;
            userEvaluateObject[
              item.userEvaluate[i].dishId as keyof typeof userEvaluateObject
            ] = value;
          }
        }
        if (item._id == userId) {
          dataChild[userId as keyof typeof dataChild] = userEvaluateObject;
        }
        dataFather[item._id as keyof typeof dataFather] = userEvaluateObject;
      });
      let pearson = (dataChild: any, dataFather: any) => {
        let arr = []; // 用于返回距离的数组
        let child = []; // 存放提取出的、被比较的子数据
        let father = []; // 存放提取出的所有
        /** 开始提取数据 **/
        for (let key in dataChild) {
          //  console.log(key);
          // console.log(dataChild[key]);
          child.push(dataChild[key]);
        }

        for (let key1 in dataFather) {
          let arr_child = [];
          for (let key2 in dataFather[key1])
            arr_child.push(dataFather[key1][key2]);
          father.push(arr_child);
        }
        // console.log(child,father)

        /**开始计算**/
        for (let i = 0; i < father.length; i++) {
          // 计算r-即去掉等于0的组别，剩下的组数
          let r = child.length;
          for (let j = 0; j < child.length; j++) {
            if (child[j] == 0 || father[i][j] == 0) r--;
          }

          // 计算x、y平均
          let _x = 0;
          let _y = 0;
          for (let j = 0; j < child.length; j++)
            if (child[j] != 0 && father[i][j] != 0) {
              _x += child[j];
              _y += father[i][j];
            }
          _x /= r;
          _y /= r;

          // 计算分子
          let fenzi = 0;
          for (let j = 0; j < child.length; j++)
            if (child[j] != 0 && father[i][j] != 0) {
              fenzi += (child[j] - _x) * (father[i][j] - _y);
            }
          // 计算分母
          let fenmu = 0;
          let fenmux = 0;
          let fenmuy = 0;
          for (let j = 0; j < child.length; j++)
            if (child[j] != 0 && father[i][j] != 0) {
              fenmux += Math.pow(child[j] - _x, 2);
              fenmuy += Math.pow(father[i][j] - _y, 2);
            }
          fenmu = Math.sqrt(fenmux * fenmuy);
          arr.push(fenzi / fenmu);
        }
        return arr;
      };
      // console.log(dataChild);
      // console.log(dataFather);
      let maxId = (arr: number[], userId: any) => {
        let indexLast = 0;
        // 因为dataFather是由对象形成的数组，
        // 所以在获取某一元素的键名时用Object.keys(dataFather)[0]
        // 而不是Object.keys(dataFather[0])[0]
        if (Object.keys(dataFather)[0] == userId) {
          indexLast = 1;
        }
        arr.map(function (item, index) {
          if (
            item > arr[indexLast] &&
            Object.keys(dataFather)[index] != userId
          ) {
            indexLast = index;
          }
        });
        return Object.keys(dataFather)[indexLast];
      };

      let relationValue = pearson(
        dataFather[userId as keyof typeof dataFather],
        dataFather
      );
      let resultId = maxId(relationValue, userId);
      console.log(resultId);
      let recommendUser = await User.findById(resultId);
      let recommendDishId: any = [];
      if (recommendUser.userLike.length > 0) {
        recommendDishId = [...recommendUser.userLike];
      }
      for (let i = 0; i < recommendUser.userEvaluate.length; i++) {
        if (recommendUser.userEvaluate[i].value > 3) {
          recommendDishId.push(recommendUser.userEvaluate[i].dishId);
        }
      }
      let recommendDish = [];
      for (let i = 0; i < recommendDishId.length; i++) {
        recommendDish[i] = await Dishes.findById(recommendDishId[i]);
      }
      console.log(recommendDishId);

      return recommendDish;
    } catch (error) {
      console.log(error);
    }
  }
  // public async getDishRecommendation(userId: string) {
  //   let user = await User.findById(userId);
  //   let dishesMorning = await Dishes.find({ mealTime: "morning" });
  //   let dishesNoon = await Dishes.find({ mealTime: "noon" });
  //   const { userNutritionWeight, userLike, userDislike } = user;
  //   let userLikeTemple = userLike;
  //   let dishesNoonOptional = [...dishesNoon];
  //   let dishesMorningOptional = [...dishesMorning];
  //   if (userDislike.length > 0) {
  //     dishesNoonOptional = dishesNoon.filter(function (item: any) {
  //       return userDislike.indexOf(item._id) < 0;
  //     });
  //     dishesMorningOptional = dishesMorning.filter(function (item: any) {
  //       return userDislike.indexOf(item._id) < 0;
  //     });
  //   }
  //   let resultDishArr: any = [];
  //   let resultEnergyWeight: any = [];
  //   try {
  //     for (let i = 0; i < 7; i++) {
  //       let likeIndex = Math.floor(Math.random() * 3);
  //       let randomIndex = (likeIndex + 1) % 3;
  //       let countIndex = (likeIndex + 2) % 3;
  //       for (let j = 0; j < 3; j++) {
  //         let absoluteIndex = i * 3 + j;
  //         if (j === 0) {
  //           if (j === likeIndex) {
  //             if (userLikeTemple.length > 0) {
  //               let targetIndex = Math.floor(
  //                 Math.random() * userLikeTemple.length
  //               );
  //               let dishId = userLikeTemple[targetIndex];
  //               let dish = await Dishes.findById(dishId);
  //               resultDishArr[absoluteIndex] = dish;
  //               userLikeTemple.splice(targetIndex, 1);
  //               let deleteIndex = -1;
  //               dishesMorningOptional.map(function (item, index) {
  //                 if (item._id === dishId) {
  //                   deleteIndex = index;
  //                 }
  //               });
  //               if (!(deleteIndex < 0)) {
  //                 dishesMorningOptional.splice(deleteIndex, 1);
  //               }
  //             } else {
  //               let targetIndex = Math.floor(
  //                 Math.random() * dishesMorningOptional.length
  //               );
  //               resultDishArr[absoluteIndex] =
  //                 dishesMorningOptional[targetIndex];
  //               dishesMorningOptional.splice(targetIndex, 1);
  //             }
  //           } else if (j === randomIndex) {
  //             let targetIndex = Math.floor(
  //               Math.random() * dishesMorningOptional.length
  //             );

  //             resultDishArr[absoluteIndex] = dishesMorningOptional[targetIndex];
  //             dishesMorningOptional.splice(targetIndex, 1);
  //           }
  //         } else {
  //           if (j === likeIndex) {
  //             if (userLikeTemple.length > 0) {
  //               let targetIndex = Math.floor(
  //                 Math.random() * userLikeTemple.length
  //               );
  //               let dishId = userLikeTemple[targetIndex];
  //               let dish = await Dishes.findById(dishId);
  //               resultDishArr[absoluteIndex] = dish;
  //               userLikeTemple.splice(targetIndex, 1);
  //               let deleteIndex = -1;
  //               dishesNoonOptional.map(function (item, index) {
  //                 if (item._id === dishId) {
  //                   deleteIndex = index;
  //                 }
  //               });
  //               if (!(deleteIndex < 0)) {
  //                 dishesNoonOptional.splice(deleteIndex, 1);
  //               }
  //             } else {
  //               let targetIndex = Math.floor(
  //                 Math.random() * dishesNoonOptional.length
  //               );
  //               resultDishArr[absoluteIndex] = dishesNoonOptional[targetIndex];
  //               dishesNoonOptional.splice(targetIndex, 1);
  //             }
  //           } else if (j === randomIndex) {
  //             let targetIndex = Math.floor(
  //               Math.random() * dishesNoonOptional.length
  //             );
  //             resultDishArr[absoluteIndex] = dishesNoonOptional[targetIndex];
  //             // console.log(dishesMorningOptional[targetIndex]);
  //             //   console.log(523+"dish resultDishArr");
  //             //   console.log(resultDishArr);
  //             dishesNoonOptional.splice(targetIndex, 1);
  //           }
  //         }
  //       }
  //       // console.log(535);

  //       // console.log(resultDishArr);
  //       // console.log(538);

  //       let likeIndexAbsolute = i * 3 + likeIndex;
  //       let randomIndexAbsolute = i * 3 + randomIndex;
  //       let countIndexAbsolute = i * 3 + countIndex;
  //       let exitNutritionWeight: number[] = [0, 0, 0];
  //       let leftNutritionWeight: number[] = [0, 0, 0];
  //       let totalNutritionWeight: number[] = [0, 0, 0];
  //       for (let i = 0; i < 3; i++) {
  //         exitNutritionWeight[i] =
  //           resultDishArr[likeIndexAbsolute].dishNutritionWeight[i] +
  //           resultDishArr[randomIndexAbsolute].dishNutritionWeight[i];
  //         leftNutritionWeight[i] =
  //           userNutritionWeight[i] - exitNutritionWeight[i];
  //       }
  //       if (countIndex === 0) {
  //         let targetIndex;
  //         let differentialValue = 200;
  //         for (let i = 0; i < dishesMorningOptional.length; i++) {
  //           let differential =
  //             Math.abs(
  //               dishesMorningOptional[i].dishNutritionWeight[0] -
  //                 leftNutritionWeight[0]
  //             ) +
  //             Math.abs(
  //               dishesMorningOptional[i].dishNutritionWeight[1] -
  //                 leftNutritionWeight[1]
  //             );
  //           if (differential < differentialValue) {
  //             differentialValue = differential;
  //             targetIndex = i;
  //           }
  //         }
  //         resultDishArr[countIndexAbsolute] = dishesNoonOptional[targetIndex];
  //         for (let i = 0; i < 3; i++) {
  //           totalNutritionWeight[i] =
  //           exitNutritionWeight[i] +
  //             dishesMorningOptional[targetIndex].dishNutritionWeight[i];
  //         }
  //         dishesMorningOptional.splice(targetIndex, 1);
  //       } else {
  //         let targetIndex;
  //         let differentialValue = 200;
  //         for (let i = 0; i < dishesNoonOptional.length; i++) {
  //           let differential =
  //             Math.abs(
  //               dishesNoonOptional[i].dishNutritionWeight[0] -
  //                 leftNutritionWeight[0]
  //             ) +
  //             Math.abs(
  //               dishesNoonOptional[i].dishNutritionWeight[1] -
  //                 leftNutritionWeight[1]
  //             );
  //           // console.log(differential);
  //           // console.log("differential");
  //           if (differential < differentialValue) {
  //             differentialValue = differential;
  //             targetIndex = i;
  //           }
  //         }
  //         // console.log(targetIndex);
  //         // console.log("targetIndex");

  //         resultDishArr[countIndexAbsolute] = dishesNoonOptional[targetIndex];
  //         for (let i = 0; i < 3; i++) {
  //           totalNutritionWeight[i] =
  //             exitNutritionWeight[i] +
  //             dishesNoonOptional[targetIndex].dishNutritionWeight[i];
  //         }
  //         dishesNoonOptional.splice(targetIndex, 1);
  //       }
  //       resultEnergyWeight[i] = totalNutritionWeight;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     // throw error;
  //   }

  //   return { resultDishArr, resultEnergyWeight };
  // }
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
  public async countDishRecommendation(userId: string) {
    let user = await User.findById(userId);
    let dishesMorning = await Dishes.find({ mealTime: "morning" });
    let dishesNoon = await Dishes.find({ mealTime: "noon" });
    const { userNutritionWeight, userLike, userDislike } = user;
    let userLikeTemple = userLike;
    let dishesNoonOptional = [...dishesNoon];
    let dishesMorningOptional = [...dishesMorning];
    if (userDislike.length > 0) {
      dishesNoonOptional = dishesNoon.filter(function (item: any) {
        return userDislike.indexOf(item._id) < 0;
      });
      dishesMorningOptional = dishesMorning.filter(function (item: any) {
        return userDislike.indexOf(item._id) < 0;
      });
    }
    let resultDishArr: any = [];
    let resultEnergyWeight: any = [];
    try {
      for (let i = 0; i < 7; i++) {
        let likeIndex = Math.floor(Math.random() * 4);
        let randomIndex = (likeIndex + 1) % 4;
        let randomIndex1 = (likeIndex + 3) % 4;
        let countIndex = (likeIndex + 2) % 4;
        for (let j = 0; j < 4; j++) {
          let absoluteIndex = i * 4 + j;
          if (j === 0) {
            if (j === likeIndex) {
              if (userLikeTemple.length > 0) {
                let targetIndex = Math.floor(
                  Math.random() * userLikeTemple.length
                );
                let dishId = userLikeTemple[targetIndex];
                let dish = await Dishes.findById(dishId);
                resultDishArr[absoluteIndex] = dish;
                userLikeTemple.splice(targetIndex, 1);
                let deleteIndex = -1;
                dishesMorningOptional.map(function (item, index) {
                  if (item._id === dishId) {
                    deleteIndex = index;
                  }
                });
                if (!(deleteIndex < 0)) {
                  dishesMorningOptional.splice(deleteIndex, 1);
                }
              } else {
                let targetIndex = Math.floor(
                  Math.random() * dishesMorningOptional.length
                );
                resultDishArr[absoluteIndex] =
                  dishesMorningOptional[targetIndex];
                dishesMorningOptional.splice(targetIndex, 1);
              }
            } else if (j === randomIndex || j === randomIndex1) {
              let targetIndex = Math.floor(
                Math.random() * dishesMorningOptional.length
              );

              resultDishArr[absoluteIndex] = dishesMorningOptional[targetIndex];
              dishesMorningOptional.splice(targetIndex, 1);
            }
          } else {
            if (j === likeIndex) {
              if (userLikeTemple.length > 0) {
                let targetIndex = Math.floor(
                  Math.random() * userLikeTemple.length
                );
                let dishId = userLikeTemple[targetIndex];
                let dish = await Dishes.findById(dishId);
                resultDishArr[absoluteIndex] = dish;
                userLikeTemple.splice(targetIndex, 1);
                let deleteIndex = -1;
                dishesNoonOptional.map(function (item, index) {
                  if (item._id === dishId) {
                    deleteIndex = index;
                  }
                });
                if (!(deleteIndex < 0)) {
                  dishesNoonOptional.splice(deleteIndex, 1);
                }
              } else {
                let targetIndex = Math.floor(
                  Math.random() * dishesNoonOptional.length
                );
                resultDishArr[absoluteIndex] = dishesNoonOptional[targetIndex];
                dishesNoonOptional.splice(targetIndex, 1);
              }
            } else if (j === randomIndex || j === randomIndex1) {
              let targetIndex = Math.floor(
                Math.random() * dishesNoonOptional.length
              );
              resultDishArr[absoluteIndex] = dishesNoonOptional[targetIndex];
              // console.log(dishesMorningOptional[targetIndex]);
              //   console.log(523+"dish resultDishArr");
              //   console.log(resultDishArr);
              dishesNoonOptional.splice(targetIndex, 1);
            }
          }
        }
        let likeIndexAbsolute = i * 4 + likeIndex;
        let randomIndexAbsolute = i * 4 + randomIndex;
        let randomIndexAbsolute1 = i * 4 + randomIndex1;
        let countIndexAbsolute = i * 4 + countIndex;
        let exitNutritionWeight: number[] = [0, 0, 0];
        let leftNutritionWeight: number[] = [0, 0, 0];
        let totalNutritionWeight: number[] = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          exitNutritionWeight[i] =
            resultDishArr[likeIndexAbsolute].dishNutritionWeight[i] +
            resultDishArr[randomIndexAbsolute].dishNutritionWeight[i] +
            resultDishArr[randomIndexAbsolute1].dishNutritionWeight[i];
          leftNutritionWeight[i] =
            userNutritionWeight[i] - exitNutritionWeight[i];
        }
        if (countIndex === 0) {
          let targetIndex;
          let differentialValue = 200;
          for (let i = 0; i < dishesMorningOptional.length; i++) {
            let differential =
              Math.abs(
                dishesMorningOptional[i].dishNutritionWeight[0] -
                  leftNutritionWeight[0]
              ) +
              Math.abs(
                dishesMorningOptional[i].dishNutritionWeight[1] -
                  leftNutritionWeight[1]
              );
            if (differential < differentialValue) {
              differentialValue = differential;
              targetIndex = i;
            }
          }
          resultDishArr[countIndexAbsolute] = dishesNoonOptional[targetIndex];
          for (let i = 0; i < 3; i++) {
            totalNutritionWeight[i] =
              exitNutritionWeight[i] +
              dishesMorningOptional[targetIndex].dishNutritionWeight[i];
          }
          dishesMorningOptional.splice(targetIndex, 1);
        } else {
          let targetIndex;
          let differentialValue = 200;
          for (let i = 0; i < dishesNoonOptional.length; i++) {
            let differential =
              Math.abs(
                dishesNoonOptional[i].dishNutritionWeight[0] -
                  leftNutritionWeight[0]
              ) +
              Math.abs(
                dishesNoonOptional[i].dishNutritionWeight[1] -
                  leftNutritionWeight[1]
              );
            if (differential < differentialValue) {
              differentialValue = differential;
              targetIndex = i;
            }
          }
          resultDishArr[countIndexAbsolute] = dishesNoonOptional[targetIndex];
          for (let i = 0; i < 3; i++) {
            totalNutritionWeight[i] =
              exitNutritionWeight[i] +
              dishesNoonOptional[targetIndex].dishNutritionWeight[i];
          }
          dishesNoonOptional.splice(targetIndex, 1);
        }
        resultEnergyWeight[i] = totalNutritionWeight;
      }
    } catch (error) {
      console.log(error);
      // throw error;
    }
    let res = await User.updateOne(
      { _id: userId },
      { $set: { userRecommendation: { resultDishArr, resultEnergyWeight } } }
    );
    return { resultDishArr, resultEnergyWeight };
  }
  public async getDishRecommmendation(userId: string) {
    try {
      let res = await User.findById(userId);
      res = res.userRecommendation;
      return res;
    } catch (error) {
      throw error;
    }
  }
  
}
