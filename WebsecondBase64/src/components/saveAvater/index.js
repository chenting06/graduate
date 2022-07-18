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
  const [imgBa64, setImgBa64] = useState("");
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
    // userIconNameTemple = "http://localhost:8887/" + userIconNameTemple;
    setUserIcon((userIconNameTemple + "==").replaceAll(" ", "+"));
    // console.log(typeof userIconNameTemple);
    // document
    //   .querySelector("#reviewImg")
    //   .setAttribute("src", userIconNameTemple);
  }
  useEffect(function () {
    toLoginFree();
  }, []);

  function review() {
    let file = document.querySelector("#input").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (ev) {
      setImgBa64(ev.target.result);
      // console.log(ev.target.result);
      // console.log(imgBa64);
      // if (ev.target.result == userIcon) {
      //   console.log(true);
      // } else {
      //   console.log(false);
      //   console.log(ev.target.result);
      //   console.log(userIcon);
      // }
      // console.log(typeof imgBa64);
      document
        .querySelector("#reviewImg")
        .setAttribute("src", ev.target.result);
    };
  }
  function saveAvatar() {
    api.saveAvatar(imgBa64);
  }
  return (
    <div className="editAvatar">
      <img id="reviewImg" src={userIcon} alt="点我改头像" />
      <input type="file" id="input" onChange={review}></input>
      <button onClick={saveAvatar}>点我提交头像</button>
    </div>
  );
}
