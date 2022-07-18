import React from "react";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import Ellipsis from "../ellipsis";
import style from "./style.less";
export default function DishGeneral(props) {
  const [isShow, setIsShow] = useState(false);
  const baseURL = "http://localhost:8887/";
  const item = props.item;
  // const authorIcon = props.authorUsers.userIcon;
  // console.log(authorIcon);
  let contentList = ["编辑", "删除"];
  let functionList = [toEdit, toDelete];
  const navigate = useNavigate();
  function toEdit() {
    navigate("/editDish", { state: { item } });
  }
  function toDelete() {
    api.deleteDishes(item._id);
    window.location.reload();
  }
  useEffect(() => {
    // console.log(props.item);
    // console.log(props.authorUsers);
  }, []);
  return (
    <div className="dishGeneral">
      <img
        src={(item.dishStep[0].pic).replaceAll(" ","+")}
        alt=""
        className="cover"
        onClick={() => {
          // console.log(item);
          // navigate("/detailDish", { state: { item, authorIcon } });
          navigate("/detailDish", { state: { item} });
        }}
      />
      <div className="title">{item.dishName}</div>
      <div className="isLike"></div>
      <div className="author">
        {/* <img
          src={baseURL + props.authorUsers.userIcon}
          alt=""
          className="authorImg"
        /> */}
        <span>{item.dishLike.length}人喜欢</span>
        <span>{item.dishHate.length}人讨厌</span>
        <span
          className="iconfont iconfontImg"
          onClick={() => {
            setIsShow(!isShow);
          }}
        >
          &#xe603;
        </span>
        <div className="ellipsis">
          {isShow ? (
            <Ellipsis contentList={contentList} functionList={functionList} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
