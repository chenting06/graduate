import store from "../store";
import axios from "axios";
import beWritten from "../components/beWrriten";
import { useNavigate } from "react-router-dom";
function edit(editType, content, content1 = "", content2 = "") {
  let tranObj = {};
  axios.defaults.withCredentials = true;
  switch (editType) {
    case "Name":
      tranObj = { newUserName: content };
      break;
    case "Height":
      tranObj = { newHeight: content };
      break;
    case "Weight":
      tranObj = { newWeight: content };
      break;
    case "Workout":
      tranObj = { newWorkout: content };
      break;
    case "Icon":
      tranObj = { newIcon: content };
      break;
    case "AddComment":
      tranObj = { newUserComment: content, dishId: content1 };
      break;
    case "EditComment":
      // console.log(content2);
      tranObj = {
        newUserComment: content,
        dishId: content1,
        commentId: content2,
      };
      break;
    case "DeleteComment":
      tranObj = {
        dishId: content,
        commentId: content1,
      };
      console.log(tranObj);
      break;
    case "Dishes":
      tranObj = { newUserDishes: content };
      break;
    case "Psd":
      tranObj = { newPsd: content, originPsd: content1 };
      break;
  }
  axios
    .post("http://localhost:7777/api/users/editUser" + editType, tranObj)
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        alert("修改成功");
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
}
// 登录
export async function login(userName, userPsd) {
  let result;
  // 使网页存储cookie
  axios.defaults.withCredentials = true;
  await axios
    .post("http://localhost:7777/api/users/login", {
      userName,
      userPsd,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        alert("恭喜成功登录即将前往首页");
      }
      result = res;
    })
    .catch((err) => {
      console.log("Couldn't fetch data. Error: " + err);
      result = err;
    });
  return result;
}
// 免登录
export async function loginFree() {
  axios.defaults.withCredentials = true;
  //   在此处加了await
  await axios
    .post("http://localhost:7777/api/users/loginFree")
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        store.setUserInform(res.data.msg);
      }
      return res;
    })
    .catch((error) => {
      console.log("couldn't fetch data" + error.msg);
    });
}
// 获取用户添加的菜品
// 想要传出res就得async await不知道为啥
// Myinform里也得async await
export async function getAuthorDishes(startPage) {
  let result;
  axios.defaults.withCredentials = true;
  await axios
    .post("http://localhost:7777/api/dishes/getAuthorDishes", { startPage })
    .then((res) => {
      console.log(res);
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      }else {
        result = res;
      }
     
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 根据菜品id获取菜品信息，创作者信息
export async function getDishInform(dishId) {
  axios.defaults.withCredentials = true;
  let result;
  await axios
    .post("http://localhost:7777/api/dishes/getDishInform", {
      dishId,
    })
    .then((res) => {
      if (res.error_code === 1) {
        alert(res.data.msg);
      }
      // 不能在.then中直接return res作为整个函数的返回值
      // 否则外部是接不到的。。。
      // return res;
      result = res;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 修改用户名("Name", newUserName)
export function editUserName(newUserName) {
  edit("Name", newUserName);
}
// 修改用户密码("Psd", 原密码, 新密码)
export function editUserPsd(originPsd, newPsd) {
  edit("Psd", originPsd, newPsd);
}
// 修改用户身高("Height", 新身高)
export function editUserHeight(userHeight) {
  edit("Height", userHeight);
}
// 修改用户体重("Weight", 新体重)
export function editUserWeight(userWeight) {
  edit("Weight", userWeight);
}
// 修改用户运动量("Workout", 新运动量)
export function editUserWorkout(userWorkout) {
  edit("Workout", userWorkout);
}
// 注册
export async function issue(
  userName,
  userHeight,
  userWeight,
  userWorkout,
  userPsd
) {
  let result;
  if (
    beWritten(userName, "userName") ||
    beWritten(userHeight, "userHeight") ||
    beWritten(userWeight, "userWeight") ||
    beWritten(userWorkout, "userWorkout") ||
    beWritten(userPsd, "userPsd")
  ) {
    return;
  }
  await axios
    .post("http://localhost:7777/api/users/", {
      userName,
      userHeight,
      userWeight,
      userWorkout,
      userPsd,
    })
    .then((res) => {
      if (res.status != 201) {
        alert(res.data.msg);
        return;
      }
      result = res;
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
  return result;
}
// 添加菜品（菜名，标签，材料，步骤）
export async function addDish(dishName, dishTags, dishStep, mealTime) {
  axios.defaults.withCredentials = true;
  let result = false;
  await axios
    .post("http://localhost:7777/api/dishes/", {
      dishName,
      dishTags,
      // dishMaterial,
      dishStep,
      mealTime,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        alert("添加菜品成功");
        result = true;
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
  return result;
}
// 编辑菜品
export async function editDish(dishName, dishTags, dishStep, dishId) {
  axios.defaults.withCredentials = true;
  let answer = { result: false, res: "" };
  await axios
    .post("http://localhost:7777/api/dishes/editDish", {
      dishName,
      dishTags,
      dishStep,
      dishId,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        answer.res = res;
        alert(res.data.msg);
      } else {
        alert("编辑菜品成功,即将回到个人页面");
        answer.result = true;
        answer.res = res;
      }
    })
    .catch((error) => {
      alert(error);
    });
  return answer;
}
// 删除菜品（菜品Id）
export function deleteDishes(dishId) {
  console.log(dishId);
  axios.defaults.withCredentials = true;
  axios
    .delete(`http://localhost:7777/api/dishes/${dishId}`)
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        alert("删除成功");
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
}
// 喜欢菜品（菜品Id）
export function addDishLike(dishId) {
  axios.defaults.withCredentials = true;

  axios
    .post("http://localhost:7777/api/dishes/addDishLike", {
      dishId,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        console.log(res.data.msg);
      } else {
        console.log("添加喜欢成功");
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
}
// 取消喜欢菜品（菜品id）
export function deleteDishLike(dishId) {
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:7777/api/dishes/deleteDishLike", {
      dishId,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        console.log("取消喜欢成功");
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
}
// 添加讨厌（菜品id）
export function addDishHate(dishId) {
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:7777/api/dishes/addDishHate", {
      dishId,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        console.log("添加讨厌成功");
      }
      console.log(res);
    })
    .catch((err) => console.log("Couldn't fetch data. Error: " + err));
}
// 取消讨厌（菜品id）
export function deleteDishHate(dishId) {
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:7777/api/dishes/deleteDishHate", {
      dishId,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        console.log("取消讨厌成功");
      }
      console.log(res);
    })
    .catch((err) => console.log(err));
}
// 重新计算推荐食谱
export async function countDishRecommendation() {
  let result;
  axios.defaults.withCredentials = true;
  await axios
    .post("http://localhost:7777/api/dishes/countDishRecommendation")
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        console.log("计算推荐成功");
      }
      result = res;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      result = err;
    });
  return result;
}
// 获取菜品推荐
export async function getDishRecommendation() {
  let result;
  axios.defaults.withCredentials = true;
  await axios
    .post("http://localhost:7777/api/dishes/getDishRecommendation")
    .then((res) => {
      if (res.data.error_code === 1) {
        console.log(res.data.msg);
      } else {
        console.log(res);
        result = res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 去评分
export async function addDishEvakuate(dishId, value) {
  axios.defaults.withCredentials = true;
  let result;
  await axios
    .post("http://localhost:7777/api/dishes/addDishEvaluate", { dishId, value })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        result = res;
      }
    })
    .catch((error) => {
      alert(error);
    });
  return result;
}
// 分页获取所有菜品
export async function getAllDishes(startPage) {
  axios.defaults.withCredentials = true;
  let result;
  await axios
    .post("http://localhost:7777/api/dishes/getAllDishes", {
      startPage,
    })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      }
      result = res;
      // console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 猜你喜欢
export async function guessYouLike(startPage) {
  axios.defaults.withCredentials = true;
  let result;
  await axios
    .post("http://localhost:7777/api/dishes/guessYouLike",{startPage})
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      }
      result = res;
      // console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 搜索菜品
export async function searchDishes(searchContent, startPage) {
  let result;
  await axios
    .post("http://localhost:7777/api/users/searchDishes", {
      searchContent,
      startPage,
    })
    .then((res) => {
      console.log(res);
      result = res;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
// 上传头像
export async function saveAvatar(data) {
  axios.defaults.withCredentials = true;

  // let formdata = new FormData();
  // let file1 = document.querySelector("#input").files[0];
  // formdata.append("files", file1);
  await axios({
    url: "http://localhost:7777/file/saveAvatar",
    method: "post",
    // headers: { "Content-Type": "multipart/form-data" },
    data,
  })
    .then((res) => {
      if (res.data.error_code === 1) {
        alert(res.data.msg);
      } else {
        alert("上传头像成功");
        console.log(res);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
export async function getUserLike(startPage) {
  let result;
  axios.defaults.withCredentials = true;
 await axios
    .post("http://localhost:7777/api/users/getUserLike", { startPage })
    .then((res) => {
      if (res.data.error_code == 1) {
        alert(res.data.mse);
      } else {
        result = res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return result
}
export async function getUserDislike(startPage) {
  let result;
  axios.defaults.withCredentials = true;
await  axios
    .post("http://localhost:7777/api/users/getUserDislike", { startPage })
    .then((res) => {
      if (res.data.error_code == 1) {
        alert(res.data.mse);
      } else {
        result = res;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return result
}
