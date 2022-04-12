import { Context } from "koa";
import Router from "koa-router";
// import UserService from "../services/dishes";

import DishesService from "../services/dishes";
import { StatusCode } from "../utils/enum";
import createRes from "../utils/response";

const dishesService = new DishesService();
const dishesRouter = new Router({
  prefix: "/api/dishes",
});

dishesRouter
  // .get('/search', async (ctx: Context) => {
  //   const { userId, query } = ctx.query;
  //   try {
  //     const data = await dishesService.searchDishes(
  //       userId as string,
  //       query as string
  //     );
  //     if (data) {
  //       createRes({
  //         ctx,
  //         data,
  //       });
  //     }
  //   } catch (error) {
  //     createRes({
  //       ctx,
  //       errorCode: 1,
  //       msg: error.message,
  //     });
  //   }
  // })
  .get("/getAuthorDishes", async (ctx: Context) => {
    const userId = ctx.cookies.get("userid");
    try {
      const data = await dishesService.getAuthorDishes(userId);
      if (data) {
        createRes({
          ctx,
          data,
        });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  .post("/editDish", async (ctx: Context) => {
    const userId = ctx.cookies.get("userid");
    const payload = ctx.request.body;
    const { dishName, dishTags, dishStep, dishId } = payload;
    try {
      const data: any = await dishesService.editDish(
        dishName,
        dishTags,
        dishStep,
        dishId,
        userId
      );
      if (data) {
        createRes({ ctx, statusCode: 201, data });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // .put('/status', async (ctx: Context) => {
  //   const payload = ctx.request.body;
  //   const { dishesId } = payload;
  //   try {
  //     const data = await dishesService.updateDishesStatus(dishesId);
  //     if (data) {
  //       createRes({ ctx, statusCode: StatusCode.Accepted });
  //     }
  //   } catch (error) {
  //     createRes({
  //       ctx,
  //       errorCode: 1,
  //       msg: error.message,
  //     });
  //   }
  // })
  // .put('/content', async (ctx: Context) => {
  //   const payload = ctx.request.body;
  //   const { dishesId, content } = payload;
  //   try {
  //     const data = await dishesService.updateDishesContent(dishesId, content);
  //     if (data) {
  //       createRes({ ctx, statusCode: StatusCode.Accepted });
  //     }
  //   } catch (error) {
  //     createRes({
  //       ctx,
  //       errorCode: 1,
  //       msg: error.message,
  //     });
  //   }
  // })
  // 添加菜品
  .post("/", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    // console.log(userId+"route");

    const payload = ctx.request.body;
    // const { dishName, dishTags, dishMaterial, dishStep } = payload;
    const { dishName, dishTags, dishStep, mealTime } = payload;
    try {
      const data = await dishesService.addDishes(
        userId,
        dishName,
        dishTags,
        // dishMaterial,
        dishStep,
        mealTime
      );
      if (data) {
        // console.log("data存在");

        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      // console.log("data失败");

      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  // 计算推荐的星期食谱
  .post("/countDishRecommendation", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    console.log(userId);

    if (!userId) {
      throw new Error("您未登录或用户不存在");
    }
    try {
      const data = await dishesService.countDishRecommendation(userId);
      if (data) {
        createRes({ ctx, data, statusCode: 201 });
      } else {
        createRes({ ctx, data, errorCode: 1 });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // 获取星期食谱
  .post("/getDishRecommendation", async (ctx: Context) => {
    try {
      let userId = ctx.cookies.get("userid");

      let data = await dishesService.getDishRecommmendation(userId);
      createRes({
        data,
        statusCode: 201,
        ctx,
      });
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // 获取所有食谱
  .post("/getAllDishes", async (ctx: Context) => {
    const payload = ctx.request.body;
    const { page, size } = payload;
    try {
      let data = await dishesService.getAllDishes(page, size);
      if (data) {
        createRes({ data, ctx, statusCode: 201 });
      } else {
        createRes({ ctx, errorCode: 1 });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // 添加用户评分
  .post("/addDishEvaluate", async (ctx: Context) => {
    try {
      let userId = ctx.cookies.get("userid");
      const payload = ctx.request.body;
      let { value, dishId } = payload;
      let data = await dishesService.addDishEvaluate(dishId, userId, value);

      createRes({ data, ctx, statusCode: 201 });
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // 添加用户喜欢
  .post("/addDishLike", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    console.log(userId);

    if (!userId) {
      throw new Error("您未登录或用户不存在");
    }
    const payload = ctx.request.body;
    const { dishId } = payload;
    try {
      // const data:Document= await dishesService.addDishLike(dishId, userId);
      const data: any = await dishesService.addDishLike(dishId, userId);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  // 删除用户喜欢
  .post("/deleteDishLike", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("您未登录或用户不存在");
    }
    const payload = ctx.request.body;
    const { dishId } = payload;
    try {
      // const data:Document= await dishesService.addDishLike(dishId, userId);
      const data: any = await dishesService.deleteDishLike(dishId, userId);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  // 添加用户讨厌
  .post("/addDishHate", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("您未登录或用户不存在");
    }
    const payload = ctx.request.body;
    const { dishId } = payload;
    try {
      // const data:Document= await dishesService.addDishLike(dishId, userId);
      const data: any = await dishesService.addDishHate(dishId, userId);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  .post("/deleteDishHate", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("您未登录或用户不存在");
    }
    const payload = ctx.request.body;
    const { dishId } = payload;
    try {
      // const data:Document= await dishesService.addDishLike(dishId, userId);
      const data: any = await dishesService.deleteDishHate(dishId, userId);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  .post("/editDishTags", async (ctx: Context) => {
    const payload = ctx.request.body;
    const { dishId, dishTagsNew } = payload;
    let userId = ctx.cookies.get("userid");
    try {
      const data = await dishesService.editDishTags(dishId, dishTagsNew);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Accepted,
          data,
        });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  .post("/editDishStep", async (ctx: Context) => {
    const payload = ctx.request.body;
    const { dishId, dishStepNew } = payload;
    let userId = ctx.cookies.get("userid");
    try {
      const data = await dishesService.editDishTags(dishId, dishStepNew);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Accepted,
          data,
        });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  .post("/getDishInform", async (ctx: Context) => {
    console.log("jieshou");

    const payload = ctx.request.body;
    const { dishId } = payload;
    try {
      let data = await dishesService.getDishInform(dishId);
      if (data) {
        createRes({
          ctx,
          statusCode: StatusCode.Accepted,
          data,
        });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  .delete("/:dishesId", async (ctx: Context) => {
    const dishesId = ctx.params.dishesId;
    const userId = ctx.cookies.get("userid");
    try {
      const data = await dishesService.deleteDishes(dishesId, userId);
      if (data) {
        createRes({ ctx, statusCode: StatusCode.NoContent });
      }
    } catch (error) {
      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  .post("/guessYouLike", async (ctx: Context) => {
    try {
      const userId = ctx.cookies.get("userid");
      let data: any = await dishesService.guessYouLike(userId);
      createRes({ data, ctx, statusCode: 201 });
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  });

export default dishesRouter;
