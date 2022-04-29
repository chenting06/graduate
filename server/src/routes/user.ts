import { log } from "console";
import { Context, Request } from "koa";
import Router from "koa-router";

import UserService from "../services/user";
import { StatusCode } from "../utils/enum";
import createRes from "../utils/response";
const fs = require("fs");
const userService = new UserService();
const multer: any = require("koa-multer");
const path = require("path");
const userRouter = new Router({
  prefix: "/api/users",
});
// const upload = multer({
//   dest: 'uploads/'
// });

// const types = upload.single('avatar');

// const file = require("file");

// var storage = multer.diskStorage({
//   //文件保存路径
//   destination: function (req: any, file: any, cb: any) {
//     cb(null, "public/uploads/");
//   },
//   filename: function (req: any, file: any, cb: any) {
//     var fileFormat = file.originalname.split(".");
//     cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   },
// });
// var upload = multer({ storage: storage });
async function edit(ctx: Context, editContent: String) {
  const payload = ctx.request.body;
  let userId = ctx.cookies.get("userid");
  let content = "";
  let content1 = "";
  let content2 = "";
  let user: any;
  switch (editContent) {
    case "userName":
      content = payload.newUserName;
      break;
    case "height":
      content = payload.newHeight;
      break;
    case "weight":
      content = payload.newWeight;
      break;
    case "workout":
      content = payload.newWorkout;
      break;
    case "icon":
      content = payload.newIcon;
      break;
    case "addUserComment":
      content = payload.newUserComment;
      content1 = payload.dishId;
      break;
    case "editUserComment":
      // console.log("浏览器传来"+payload.commentId);

      content = payload.newUserComment;
      content1 = payload.dishId;
      content2 = payload.commentId;
      break;
    case "deleteUserComment":
      // console.log(payload.commentId+"payload.commentId");

      content1 = payload.dishId;
      content2 = payload.commentId;
      break;
    case "userDishes":
      content = payload.newUserDishes;
      break;
    case "psd":
      content = payload.newPsd;
      content1 = payload.originPsd;
      break;
  }

  try {
    switch (editContent) {
      case "loginFree":
        user = await userService.loginFree(userId);
        break;
      case "userName":
        user = await userService.editUserName(userId, content);
        break;
      case "height":
        user = await userService.editUserHeight(userId, content);
        break;
      case "weight":
        user = await userService.editUserWeight(userId, content);
        break;
      case "workout":
        user = await userService.editUserWorkout(userId, content);
        break;
      case "icon":
        user = await userService.editUserIcon(userId, content);
        break;
      case "addUserComment":
        user = await userService.editAddUserComment(userId, content, content1);
        break;
      case "editUserComment":
        user = await userService.editEditUserComment(
          userId,
          content,
          content1,
          content2
        );
        break;
      case "deleteUserComment":
        user = await userService.editDeleteUserComment(
          userId,
          content1,
          content2
        );
        break;
      case "userDishes":
        user = await userService.editUserDishes(userId, content);
        break;
      case "psd":
        user = await userService.editUserPsd(userId, content1, content);
        break;
    }
    createRes({
      ctx,
      statusCode: StatusCode.Created,
      msg: user,
    });
  } catch (error) {
    createRes({
      ctx,
      errorCode: 1,
      msg: error.message,
    });
  }
}
userRouter
  .post("/loginFree", async (ctx: Context) => {
    await edit(ctx, "loginFree");
  })
  .post("/login", async (ctx: Context) => {
    // ctx.set("Access-Control-Allow-Credentials"," *");
    // ctx.set("Access-Control-Allow-Origin", "http://localhost:3001");
    // ctx.set("Access-Control-Allow-Origin", "*");
    // ctx.set(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
    // );
    // ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    // const { method, url } = ctx;
    // ctx.cookies.set("username", 1231312);

    const payload = ctx.request.body;
    const { userName, userPsd } = payload;
    try {
      const user = await userService.validUser(userName, userPsd);
      // 中文在cookie中无法存储，转换下使其合法
      // 转换回中文：Buffer.from(userNameTemple, 'base64').toString()
      // let userNameTemple = Buffer.from(userName).toString("base64");
      // 设置cookie过期时间
      let the_date = new Date("December 31, 2088");
      // ctx.cookies.set("username", userNameTemple, {expires: the_date});
      // ctx.cookies.set("username", userNameTemple);
      ctx.cookies.set("userid", user._id, {
        expires: the_date,
        httpOnly: false,
        signed: false,
      });
      // let test=ctx.cookies.get("username");
      // console.log(test+"test");

      createRes({
        ctx,
        data: {
          userId: user._id,
          username: user.userName,
        },
      });
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  .post("/editUserName", async (ctx: Context) => {
    await edit(ctx, "userName");
  })
  .post("/editUserPsd", async (ctx: Context) => {
    await edit(ctx, "psd");
  })
  .post("/editUserHeight", async (ctx: Context) => {
    await edit(ctx, "height");
  })
  .post("/editUserWeight", async (ctx: Context) => {
    await edit(ctx, "weight");
  })
  .post("/editUserWorkout", async (ctx: Context) => {
    await edit(ctx, "workout");
  })
  .post("/editUserIcon", async (ctx: Context) => {
    // await edit(ctx, "icon");
  })
  .post("/editUserAddComment", async (ctx: Context) => {
    await edit(ctx, "addUserComment");
  })
  .post("/editUserEditComment", async (ctx: Context) => {
    await edit(ctx, "editUserComment");
  })
  .post("/editUserDeleteComment", async (ctx: Context) => {
    await edit(ctx, "deleteUserComment");
  })
  .post("/editUserDishes", async (ctx: Context) => {
    await edit(ctx, "userDishes");
  })
  .post("/searchDishes", async (ctx: Context) => {
    const payload = ctx.request.body;
    let searchContent = payload.searchContent;
    let data: any = await userService.searchDishes(searchContent);
    if (data) {
      createRes({
        ctx,
        data,
        statusCode: 201,
      });
    } else {
      createRes({ ctx, data, errorCode: 1 });
    }
  })
  // 注册
  .post("/", async (ctx: Context) => {
    // console.log("routes连上");
    const payload = ctx.request.body;
    const { userName, userHeight, userWeight, userWorkout, userPsd } = payload;
    try {
      const data = await userService.addUser(
        userName,
        userHeight,
        userWeight,
        userWorkout,

        userPsd
      );
      if (data) {
        // console.log("huoqudata");
        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      // console.log("huoquerro");
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  });

//   .get('/upload', async (ctx:any, next) => {
//     await ctx.render('upload')
//     .post('/profile', types, async  (ctx:any, next:any) => {
//       const { originalname, path: out_path, mimetype} = ctx.req.file;
//       let newName = out_path + path.parse(originalname).ext;
//       let err = fs.renameSync(out_path, newName);
//       let result;
//       if(err){
//         result = JSON.stringify(err);
//       } else {
//         result = `<h1>upload success</h1>`;
//       }
//       ctx.body = result;
//   });
// })

// .post('/uploadPic',async(ctx:any)=>{
//   await userService.uploadPicture(ctx)
// });

export default userRouter;
