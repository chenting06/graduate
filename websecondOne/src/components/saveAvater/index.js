import React, { useState, useEffect } from "react";
import * as api from "../../services/api";
import { toJS } from "mobx";
import axios from "axios";
import style from "./style.less";
import store from "../../store";
export default function SaveAvatar() {
  const [userName, setUserName] = useState("");
  const [userIcon, setUserIcon] = useState(
    "http://localhost:8887/defaultAvatar.png"
  );
  async function toLoginFree() {
    let res = await api.loginFree();
    // console.log(res);
    // console.log(toJS(store.userInform.userName));
    setUserName(
      toJS(store.userInform.userName)
        ? toJS(store.userInform.userName)
        : "未登录"
    );
    // console.log(store.userInform.userIcon);
    let userIconNameTemple = store.userInform.userIcon
      ? store.userInform.userIcon
      : "defaultAvatar.png";
    userIconNameTemple = "http://localhost:8887/" + userIconNameTemple;
    setUserIcon(userIconNameTemple);
  }
  useEffect(function () {
    toLoginFree();
  }, []);

  function review() {
    let file = document.querySelector("#input").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (ev) {
      document
        .querySelector("#reviewImg")
        .setAttribute("src", ev.target.result);
    };
  }
  function saveAvatar() {
    axios.defaults.withCredentials = true;
    let formdata = new FormData();
    let file1 = document.querySelector("#input").files[0];
    formdata.append("files", file1);
    axios({
      url: "http://localhost:7777/file/saveAvatar",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: formdata,
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
  return (
    <div className="editAvatar">
      <img
        id="reviewImg"
        src={userIcon}
        alt="点我改头像"
      />
      <input type="file" id="input" onChange={review}></input>
      <button onClick={saveAvatar}>点我提交头像</button>
    </div>
  );
}
