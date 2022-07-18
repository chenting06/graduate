import React from "react";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import style from "./style.less";
export default function DishGeneralHome(props) {
  const [isShow, setIsShow] = useState(false);
  const item = props.item;
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(props.item);
    // console.log(props.authorUsers);
  }, []);
  return (
    <div className="dishGeneral">
      <img
        src={item.dishStep[0].pic.replaceAll(" ", "+")}
        alt=""
        className="cover"
        onClick={() => {
          // console.log(item);
          // navigate("/detailDish", { state: { item, authorIcon } });
          navigate("/detailDish", { state: { item } });
        }}
      />
      <div className="title">{item.dishName}</div>
      <div className="isLike"></div>
      <div className="author">
        <span>{item.dishLike.length}人收藏</span>
        <span>{item.dishHate.length}人屏蔽</span>
        <span>
          平均得分:
          {item.dishEvaluate.length
            ? // 对象数组累加对象的某个属性值时要加pre值
            String(item.dishEvaluate.reduce(function (pre, cur) {
              return pre + cur.value;
            }, 0) / item.dishEvaluate.length).slice(
              0,
              String(item.dishEvaluate.reduce(function (pre, cur) {
                return pre + cur.value;
              }, 0) / item.dishEvaluate.length).indexOf(".") + 3
            )
            : "暂无评分"}
        </span>
      </div>
    </div>
  );
}
