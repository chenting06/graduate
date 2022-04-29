import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import style from "./style.less";
import store from "../../store";
import { observer } from "mobx-react-lite";
import * as api from "../../services/api";
import home from "../../pages/home";
import { toJS } from "mobx";
function Navigater() {
  const [userName, setUserName] = useState("");
  const [userIcon, setUserIcon] = useState(
    "http://localhost:8887/notLogin.png"
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
    console.log(store.userInform.userIcon);
    let userIconNameTemple = store.userInform.userIcon
      ? store.userInform.userIcon
      : "notLogin.png";
    userIconNameTemple = "http://localhost:8887/" + userIconNameTemple;
    setUserIcon(userIconNameTemple);
  }
  useEffect(function () {
    toLoginFree();
  }, []);

  return (
    <div>
      <div className="navigater">
        {/* <img src="http://localhost:8887/logo.png" alt="logo" /> */}
        {/* */}
        <nav>
          <ul className="redirection">
            <li>
              <NavLink to="/searchResult">搜索</NavLink>
            </li>
            <li>
              <NavLink to="/guessYouLike" className="activeLink">
                猜你喜欢
              </NavLink>
            </li>
            <li>
              <NavLink to="/todayDish" className="activeLink">
                今日食谱
              </NavLink>
            </li>
            <li>
              <NavLink to="/weeklyDish" className="activeLink">
                星期食谱
              </NavLink>
            </li>
            <li className="title">
              <NavLink to="/" className="activeLink">
                膳食记
              </NavLink>
            </li>
            <li>
              <NavLink to="/myInform" className="activeLink">
                我的
              </NavLink>
            </li>
            <li>
              <NavLink to="/home">首页</NavLink>
            </li>
            <li>
              <NavLink to="/login" className="activeLink">
                登录
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="activeLink">
                注册
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export default observer(Navigater);
