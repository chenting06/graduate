import React, { useEffect, useState } from "react";
import Navigater from "../../components/navigater";
import store from "../../store";
import axios from "axios";
import * as api from "../../services/api";
import { observer } from "mobx-react-lite";
import DishGeneralHome from "../../components/dishGeneralHome";
import style from "./style.less";
import { countScrollDistance } from "../../publicFunc/publicFunc";
import { data } from "browserslist";
function Home() {
  useEffect(async () => {
    let res = await api.getAllDishes(startPage);
    console.log(res);
    setData(res.data.data);
    window.addEventListener("scroll", judgeLoadMore);
    return function () {
      window.removeEventListener("scroll", judgeLoadMore, false);
    };
    // setPage(page + 1);
  }, []);
  const [startPage, setStartPage] = useState(0);
  const [scrollBottom, setScrollBottom] = useState(100);
  const [data, setData] = useState([]);
  function judgeLoadMore() {
    let scrollBottomTemple = countScrollDistance();
    setScrollBottom(scrollBottomTemple);
  }
  useEffect(async () => {
    if (scrollBottom < 2) {
      let res = await api.getAllDishes(startPage + 1);
      // console.log(res);
      // console.log(dataTemple.length);
      if (res.data.data) {
        setData([...data, ...res.data.data]);
        setStartPage(startPage + 1);
      }
    }
  }, [scrollBottom]);
  return (
    <div className="home">
      <Navigater />
      <div className="DishesAll">
        {data.length > 0 ? (
          data.map(function (item, index) {
            return (
              <DishGeneralHome
                item={item}
                key={item._id}
                data={item._id}
                // authorUsers={authorUsers}
              />
            );
          })
        ) : (
          <span> "暂无菜品"</span>
        )}
      </div>
    </div>
  );
}
export default observer(Home);
