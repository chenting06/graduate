import React, { useEffect, useState } from "react";
import Navigater from "../../components/navigater";
import store from "../../store";
import axios from "axios";
import * as api from "../../services/api";
import { observer } from "mobx-react-lite";
import DishGeneralHome from "../../components/dishGeneralHome";
import style from "./style.less"
function Home() {
  const size = 6;
  useEffect(async () => {
    let res = await api.getAllDishes(page, size);
    console.log(res);
    setData(res.data.data);
    setPage(page + 1);
  }, []);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
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
