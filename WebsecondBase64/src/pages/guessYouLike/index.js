import React, { useEffect, useState } from "react";
import * as api from "../../services/api";
import DishGeneralHome from "../../components/dishGeneralHome";
import Navigater from "../../components/navigater";
import { countScrollDistance } from "../../publicFunc/publicFunc";
import style from "./style.less";
export default function GuessYouLike() {
  useEffect(async () => {
    let res = await api.guessYouLike(startPage);
    // let  dataTemple=res.data.data;
    window.addEventListener("scroll", judgeBottomDistance);
    console.log(res);
    setData(res.data.data);
  }, []);

  const [data, setData] = useState();
  const [startPage, setStartPage] = useState(0);
  const [bottomDistance, setBottomDistance] = useState(100);
  function judgeBottomDistance() {
    let bottomDistanceTemple = countScrollDistance();
    setBottomDistance(bottomDistanceTemple);
  }
  useEffect(async () => {
    if (bottomDistance < 2) {
      let res = await api.guessYouLike(startPage + 1);
      let dataTemple = res.data.data;
      if (dataTemple.length > 0) {
        setData([...data, ...dataTemple]);
        setStartPage(startPage + 1);
      } else {
        console.log("已加载完成");
      }
    }
  }, [bottomDistance]);
  return (
    <div className="guess">
      <Navigater></Navigater>
      <div className="guessTitle">猜你喜欢</div>
      <div className="guessYouLike">
        {data
          ? data.map(function (item, index) {
              return (
                <DishGeneralHome item={item} key={item._id} data={item._id} />
              );
            })
          : "GuessYouLike"}
      </div>
    </div>
  );
}
