import React, { useEffect, useState } from "react";
import * as api from "../../services/api";
import DishGeneralHome from "../../components/dishGeneralHome";
import Navigater from "../../components/navigater";
import style from "./style.less";
export default function GuessYouLike() {
  useEffect(async () => {
    let res = await api.guessYouLike();
    console.log(res);
    setData(res.data.data);
  }, []);
  const [data, setData] = useState();
  return (
    <div className="guess">
      <Navigater></Navigater>
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
