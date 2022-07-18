// @ts-nocheck
import Koa from "koa";
// 为传图片改方式
// import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import Config from "./config";
import connectDB from "./db";
import dishesRouter from "./routes/dishes";
import userRouter from "./routes/user";
import fileRouter from "./routes/file";
import bodyParser from "koa-bodyparser";
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
const router = new Router();
const multer = require("koa-multer");
const formidable = require("koa2-formidable");
// const formidable = require("koa-formidable");
// 为传图片新增
const koaBody = require("koa-body");
// const koaStatic=require("koa-static");
// const path = require("path");

const app = new Koa();

connectDB(Config.MONGODB_URI);
// connectDB("mongodb://localhost:27017/food");
app
  .use(cors({ origin: "http://localhost:3001", credentials: true }))
  // .use(bodyParser.json({limit : "2100000kb"}))
  .use(
    koaBody({
      multipart: true, // 支持文件上传
      // encoding:'gzip',
      formLimit: "10mb",
      jsonLimit: "10mb",
      textLimit: "10mb",
      formidable: {
        uploadDir: path.join(__dirname, "public/upload/"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name: any, file: any) => {
          // 文件上传前的设置
          // console.log(`name: ${name}`);
          // console.log(file);
        },
      },
    })
  );

fileRouter(app);
app.use(userRouter.routes()).use(dishesRouter.routes());

app.listen(Config.PORT, () => {
  console.log(`server starts successful: http://localhost:${Config.PORT}`);
});
