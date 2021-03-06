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
  .post("/getAuthorDishes", async (ctx: Context) => {
    const userId = ctx.cookies.get("userid");
    const payload = ctx.request.body;
    const { startPage } = payload;
    try {
      const data = await dishesService.getAuthorDishes(userId, startPage);
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
      // for(let i=0;i<60;i++){
      //   let mealTime=i%4==0?"morning":"noon";
      //  await dishesService.addDishes(
      //     userId,
      //    dishName+i,
      //     dishTags,
      //     // dishMaterial,
      //     dishStep,
      //     mealTime
      //   );
      // }
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
  // ????????????
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
        // console.log("data??????");

        createRes({
          ctx,
          statusCode: StatusCode.Created,
          data,
        });
      }
    } catch (error) {
      // console.log("data??????");

      createRes({
        ctx,
        errorCode: 1,
        msg: error.message,
      });
    }
  })
  // ???????????????????????????
  .post("/countDishRecommendation", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    console.log(userId);

    if (!userId) {
      throw new Error("??????????????????????????????");
    }
    try {
      const data = await dishesService.countDishRecommendation(userId);
      // console.log(data);

      if (data) {
        createRes({ ctx, data, statusCode: 201 });
      } else {
        createRes({ ctx, data, errorCode: 1 });
      }
    } catch (error) {
      console.log(error.message);

      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // ??????????????????
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
  // ??????????????????
  .post("/getAllDishes", async (ctx: Context) => {
    const payload = ctx.request.body;
    const { startPage } = payload;
    try {
      let data = await dishesService.getAllDishes(startPage);
      if (data) {
        createRes({ data, ctx, statusCode: 201 });
      } else {
        createRes({ ctx, errorCode: 1 });
      }
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  })
  // ??????????????????
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
  // ??????????????????
  .post("/addDishLike", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    console.log(userId);

    if (!userId) {
      throw new Error("??????????????????????????????");
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
  // ??????????????????
  .post("/deleteDishLike", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("??????????????????????????????");
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
  // ??????????????????
  .post("/addDishHate", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("??????????????????????????????");
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
  // ??????????????????
  .post("/deleteDishHate", async (ctx: Context) => {
    let userId = ctx.cookies.get("userid");
    if (!userId) {
      throw new Error("??????????????????????????????");
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
      const payload = ctx.request.body;
      const { startPage } = payload;
      let data: any = await dishesService.guessYouLike(userId, startPage);
      createRes({ data, ctx, statusCode: 201 });
    } catch (error) {
      createRes({ ctx, errorCode: 1, msg: error.message });
    }
  });

export default dishesRouter;
