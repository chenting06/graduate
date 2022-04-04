import Router from "koa-router";
import createRes from "../utils/response";
import FileService from "../services/file";
const fileRouter = new Router({ prefix: "/file" });
import path from "path";
const fileService = new FileService();
// const formidable = require("koa-formidable");
// const fs = require("fs");
export default (app: any) => {
  //获取文件
  // let addAvatar=FileService.addAvatar()
  const saveAvatar = async (ctx: any) => {
    let userId = ctx.cookies.get("userid");
    try {
      if (ctx.request.files) {
        const file = ctx.request.files;
        const files = file.files;
        let base = path.parse(files.path).base;
        let data = await fileService.addAvatar(userId, base);
        // throw new Error("同步error");
        // console.log("addAvatar函数下面的一行代码");
        if (data) {
          createRes({
            ctx,
            errorCode: 0,
            msg: "上传成功",
            data: base,
            statusCode: 201,
          });
        } else {
          throw new Error("后端未获取到到图片");
        }
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
        data: null,
      });
    }
  };
  const savePicture = async (ctx: any) => {
    const file = ctx.request.files;
    const files = file.files;
    let base = path.parse(files.path).base;
    createRes({
      ctx,
      errorCode: 0,
      msg: "上传成功",
      data: base,
      statusCode: 201,
    });
  };
  fileRouter.post("/savePicture", savePicture);
  fileRouter.post("/saveAvatar", saveAvatar);
  app.use(fileRouter.routes()).use(fileRouter.allowedMethods());
  //   app.use(fileRouter.routes());
};
