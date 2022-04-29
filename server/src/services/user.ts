import { log } from "console";
import User from "../db/models/user";
import { countUserNutritionEnergy } from "../public/commonImplement";
import Dishes from "../db/models/dishes";
import { Context } from "koa";
import dishes from "../db/models/dishes";

interface Comment {
  dishId: String;
  commentId: String;
  userId: String;
  content: String;
}
interface DishItem {
  dishTags: [];
  dishMaterial: [];
  dishStep: [];
  dishLike: [];
  dishHate: [];
  dishComment: [];
  dishNutritionEnergy: [];
  dishNutritionWeight: [];
  dishEvaluate: [];
  _id: string;
  dishName: string;
  dishUploader: string;
  mealTime: string;
  __v: 0;
}
export default class UserService {
  async edit(
    userId: String,
    editContent: String | Object | Number,
    editType: String,
    editContent1: String = "",
    editContent2: String = ""
  ) {
    try {
      const user = await User.findOne({
        _id: userId,
      });
      // 查询用户
      if (!user) {
        // console.log("修改未查到");
        throw new Error("您未登录(￣o￣).zZ");
      }
      switch (editType) {
        case "userName":
          return await User.updateOne(
            { _id: userId },
            { $set: { userName: editContent } }
          );
        case "height":
          let res = await User.updateOne(
            { _id: userId },
            { $set: { userHeight: editContent } }
          );
          let user = await User.findOne({
            _id: userId,
          });
          const { userWeight, userHeight, userWorkout } = user;
          let energy = countUserNutritionEnergy(
            userWeight,
            userHeight,
            userWorkout
          );
          let res1 = await User.updateOne(
            { _id: userId },
            {
              $set: {
                userNutritionEnergy: energy.nutritionEnergy,
                userNutritionWeight: energy.nutritionWeight,
              },
            }
          );

          return res1;
          break;
        case "weight":
          await User.updateOne(
            { _id: userId },
            { $set: { userWeight: editContent } }
          );

          let user1 = await User.findOne({
            _id: userId,
          });
          let energy1 = countUserNutritionEnergy(
            user1.userWeight,
            user1.userHeight,
            user1.userWorkout
          );
          let res2 = await User.updateOne(
            { _id: userId },
            {
              $set: {
                userNutritionEnergy: energy1.nutritionEnergy,
                userNutritionWeight: energy1.nutritionWeight,
              },
            }
          );

          return res2;
          break;
        case "workout":
          await User.updateOne(
            { _id: userId },
            { $set: { userWorkout: editContent } }
          );
          let user2 = await User.findOne({
            _id: userId,
          });
          let energy2 = countUserNutritionEnergy(
            user2.userWeight,
            user2.userHeight,
            user2.userWorkout
          );
          let res3 = await User.updateOne(
            { _id: userId },
            {
              $set: {
                userNutritionEnergy: energy2.nutritionEnergy,
                userNutritionWeight: energy2.nutritionWeight,
              },
            }
          );

          return res3;
        case "icon":
          return await User.updateOne(
            { _id: userId },
            { $set: { userIcon: editContent } }
          );
        case "addUserComment":
          // console.log("tianjiapinglun ");

          // console.log(user);
          let commentId = Number(
            Math.random().toString().substring(3, 6) + Date.now()
          ).toString(36);
          let dishId = editContent1;
          let content = editContent;
          let objTemple = { dishId, commentId, content, userId };
          let newUserComment = user.userComment;
          newUserComment.push(objTemple);
          let resUser = await User.updateOne(
            { _id: userId },
            { $set: { userComment: newUserComment } }
          );

          const dish = await Dishes.findOne({
            _id: dishId,
          });
          // console.log(dish+"dish");

          let newDishComment = dish.dishComment;
          // console.log(newDishComment+"newDishComment");

          newDishComment.push(objTemple);
          let resDishes = await Dishes.updateOne(
            { _id: editContent1 },
            { $set: { dishComment: newDishComment } }
          );
          // console.log(resUser);
          // console.log(resDishes);

          return resUser;
        case "editUserComment":
          // console.log(user);
          // console.log("xiugaibiao");

          let commentIdTemple = editContent2;
          // console.log(editContent2);

          let dishIdTemple = editContent1;
          let contentTemple = editContent;
          let objTempleTemple = {
            dishId: dishIdTemple,
            commentId: commentIdTemple,
            content: contentTemple,
            userId,
          };
          let newUserCommentTemple = user.userComment;
          let flag = false;
          newUserCommentTemple.map(function (
            item: Comment,
            index: number,
            arr: Object[]
          ) {
            if (item["commentId"] === commentIdTemple) {
              arr[index] = objTempleTemple;
              flag = true;
            }
          });
          if (flag) {
            const dish = await Dishes.findOne({
              _id: dishIdTemple,
            });
            let newDishComment = dish.dishComment;
            newDishComment.map(function (
              item: Comment,
              index: number,
              arr: Object[]
            ) {
              if (item["commentId"] === commentIdTemple) {
                arr[index] = objTempleTemple;
              }
            });
            let resUserTemple = await User.updateOne(
              { _id: userId },
              { $set: { userComment: newUserCommentTemple } }
            );
            let resDishTemple = await Dishes.updateOne(
              { _id: dishIdTemple },
              { $set: { dishComment: newDishComment } }
            );
            return resUserTemple;
          } else {
            throw new Error("未找到评论(￣o￣).zZ");
          }
          break;
        case "deleteUserComment":
          let newUserComment1 = user.userComment;
          let flag1 = false;
          // console.log(editContent2 + "editContent2");

          newUserComment1.map(function (
            item: Comment,
            index: number,
            arr: Object[]
          ) {
            if (editContent2 === item["commentId"]) {
              arr.splice(index, 1);
              flag1 = true;
            }
          });
          if (flag1) {
            const dish = await Dishes.findOne({ _id: editContent1 });
            let newDishComment = dish.dishComment;
            newDishComment.map(function (
              item: Comment,
              index: number,
              arr: Object[]
            ) {
              if (editContent2 === item["commentId"]) {
                arr.splice(index, 1);
                flag1 = true;
              }
            });
            let resDishes = await Dishes.updateOne(
              { _id: editContent1 },
              { $set: { dishComment: newDishComment } }
            );
            return await User.updateOne(
              { _id: userId },
              { $set: { userComment: newUserComment1 } }
            );
          } else {
            throw new Error("未找到评论(￣o￣).zZ");
          }
        case "userDishes":
          return await User.updateOne(
            { _id: userId },
            { $set: { userDishes: user.userDishes.push(editContent) } }
          );
        case "psd":
          if (user.userPsd === editContent1) {
            return await User.updateOne(
              { _id: userId },
              { $set: { userPsd: editContent } }
            );
          } else {
            throw new Error("原密码错误(￣o￣).zZ");
          }

        // 修改用户名
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // 添加用户
  public async addUser(
    userName: String,
    userHeight: number,
    userWeight: number,
    userWorkout: String,
    userPsd: String
  ) {
    try {
      let userNutritionEnergy = countUserNutritionEnergy(
        userWeight,
        userHeight,
        userWorkout
      ).nutritionEnergy;
      let userNutritionWeight = countUserNutritionEnergy(
        userWeight,
        userHeight,
        userWorkout
      ).nutritionWeight;
      const user = new User({
        userName,
        userHeight,
        userWeight,
        userWorkout,
        userIcon: "",
        userComment: [],
        userDishes: [],
        userPsd,
        userLike: [],
        userDislike: [],
        userNutritionEnergy,
        userNutritionWeight,
        userRecommendation: {},
        userEvaluate: [],
      });
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        console.log("用户名已存在");

        // MongoError: E11000 duplicate key error collection
        throw new Error("用户名已存在 (￣o￣).zZ");
      } else {
        throw error;
      }
    }
  }
  // 用户免登录,获取用户信息
  public async loginFree(userId: String) {
    let obj = {};
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        obj = { userName: user.userName, userIcon: user.userIcon, user: user };
      } else {
        obj = { userName: "未登录", userIcon: "" };
      }
      return obj;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // 登录
  public async validUser(userName: String, userPsd: String) {
    try {
      const user = await User.findOne({
        userName,
      });
      // 查询用户
      if (!user) {
        throw new Error("用户不存在 (￣o￣).zZ");
      }
      // 校验密码
      if (userPsd === user.userPsd) {
        return user;
      }
      throw new Error("密码错误 (￣o￣).zZ");
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // 编辑用户名
  public async editUserName(userId: String, newUserName: String) {
    await this.edit(userId, newUserName, "userName");
    // console.log(userName+"biao");

    // try {
    //   const user = await User.findOne({
    //     _id:userId
    //   });
    //   // 查询用户
    //   if (!user) {
    //     // console.log("修改未查到");
    //     throw new Error("您未登录(￣o￣).zZ");
    //   }
    //   // 修改用户名
    //   return await User.updateOne(
    //     { _id:userId },
    //     { $set: { userName: newUserName } }
    //   );
    // } catch (error) {
    //   throw new Error(error.message);
    // }
  }
  // 编辑用户密码
  public async editUserPsd(userId: String, originPsd: String, newPsd: String) {
    await this.edit(userId, newPsd, "psd", originPsd);
  }
  public async editUserHeight(userId: String, newUserContent: Object) {
    await this.edit(userId, newUserContent, "height");
  }
  public async editUserWeight(userId: String, newUserContent: Object) {
    await this.edit(userId, newUserContent, "weight");
  }
  public async editUserWorkout(userId: String, newUserContent: Object) {
    await this.edit(userId, newUserContent, "workout");
  }
  public async editUserIcon(userId: String, newUserContent: Object) {
    await this.edit(userId, newUserContent, "icon");
  }
  public async editAddUserComment(
    userId: String,
    newUserContent: Object,
    dishId: String
  ) {
    await this.edit(userId, newUserContent, "addUserComment", dishId);
  }
  public async editEditUserComment(
    userId: String,
    newUserContent: Object,
    dishId: String,
    commentId: String
  ) {
    // console.log("service修改评论");
    // console.log(commentId + "commentId");

    await this.edit(
      userId,
      newUserContent,
      "editUserComment",
      dishId,
      commentId
    );
  }
  public async editDeleteUserComment(
    userId: String,
    dishId: String,
    commentId: String
  ) {
    // console.log("service修改评论");
    // console.log(commentId + "commentId");
    console.log("shanchu" + commentId);

    await this.edit(
      userId,
      "newUserContent",
      "deleteUserComment",
      dishId,
      commentId
    );
  }

  public async editUserDishes(userId: String, newUserContent: Object) {
    await this.edit(userId, newUserContent, "userDishes");
  }
  // public async uploadPicture(ctx:any){
  //   // app.use(koaStatic(path.join(__dirname), 'public'))
  //   const file = ctx.request.files.file;
  //   console.log(file);

  // ctx.body = { path: file.path };
  // const basename = path.basename(file.path);
  // // ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  // }
  public async searchDishes(searchContent: string) {
    let dishAll = await dishes.find();
    let dishResult: DishItem[] = [];
    dishAll.map(function (item: DishItem) {
      // 是正则表达式的匹配字段用变量表示
      // 相当于 /searchCotent的值/g
      let flag = 0;
      let isName = new RegExp(searchContent, "g");
      if (isName.test(item.dishName)) {
        dishResult.push(item);
        flag = 1;
        return;
      } else {
        item.dishTags.map(function (materItem) {
          let materName = Object.keys(materItem)[0];
          if (isName.test(materName) && flag === 0) {
            dishResult.push(item);
            flag = 1;
          }
        });
      }
    });
    return dishResult;
  }
}
