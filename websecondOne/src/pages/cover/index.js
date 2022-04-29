import React from "react";
import Navigater from "../../components/navigater";
import { useNavigate } from "react-router-dom";
import style from "./style.less";
import { NavLink } from "react-router-dom";
export default function Cover() {
  const navigate=useNavigate();
  return (
    <div className="Cover">
      <div className="mask"></div>
      <nav>
        <ul className="redirection">
          <li>
            <NavLink to="/home" className="activeLink">
              首页
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
          <li className="title">膳食记</li>
          <li>
            <NavLink to="/myInform" className="activeLink">
              我的
            </NavLink>
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
      <div className="information">
        <div className="title">膳食记</div>
        <div className="informDetail">
          <div className="informDetailDetail">
            <div className="title">膳食记</div>
            <div className="content">
              健康食谱推荐系统，根据用户的运动量和健康状况得出每日所需营养的具体信息。
              根据所需营养，用户喜恶通过系统推算定制出健康美味，营养均衡的每日食谱。
              让用户在繁忙的工作中仅需少量时间就可吃出营养吃出健康
            </div>
            <div className="toRedirection">
              <span onClick={()=>{navigate("login")}}>去登陆</span>
              <span onClick={()=>{navigate("register")}}>去注册</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
