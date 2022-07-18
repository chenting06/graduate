import React from "react";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import GoHome from "../../components/goHome";
import style from "./style.less";
export default function TodayDish() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resTotal, setResTotal] = useState([]);
  const [dayliDishEnergyTemple, setDaylyDishEnergyTemple] = useState([]);
  if (location.state) {
    var { dayliDishArr, dayliDishEnergy } = location.state;
  }
  useEffect(async function () {
    if (!location.state) {
      let res = await api.getDishRecommendation();
      if (res.data && res.data.data) {
        console.log(res.data.data);
        // setResTotal(res);
      } else {
        await api.countDishRecommendation();
        res = await api.getDishRecommendation();
        // setResTotal(res);
      }
      let weekDay = new Date().getDay();
      dayliDishArr = res.data.data.resultDishArr.slice(
        (weekDay - 1) * 4,
        (weekDay - 1) * 4 + 4
      );
      dayliDishEnergy = res.data.data.resultEnergyWeight[weekDay];
      // console.log(dayliDishEnergy);
      setDaylyDishEnergyTemple(dayliDishEnergy);
      // navigate("/todayDish", {
      //   state: { dayliDishArr, dayliDishEnergy },
      // });
    }
    let total = [];
    for (let i = 0; i < 4; i++) {
      total[i] = await api.getDishInform(dayliDishArr[i]._id);
      total[i] = total[i].data.data.dishRes;
      console.log(total);
    }
    setResTotal([...total]);
    // console.log(resTotal);
  }, []);
  const baseURL = "http://localhost:8887/";
  // console.log(dayliDishArr, dayliDishEnergy);
  return (
    <div className="today">
      <div className="title">
        <span>今日食谱</span>
        <GoHome />{" "}
      </div>
      <div className="todayDish">
        {resTotal.length > 0
          ? [0, 0, 0, 0].map(function (item, indexTemple) {
              return (
                <div
                  className="morning"
                  onClick={() => {
                    // console.log(item);
                    // navigate("/detailDish", { state: { item, authorIcon } });
                    navigate("/detailDish", {
                      state: { item: resTotal[indexTemple] },
                    });
                  }}
                >
                  <img
                    src={resTotal[indexTemple].dishStep[0].pic.replaceAll(
                      " ",
                      "+"
                    )}
                    alt=""
                  />
                  <div className="content">
                    <div className="dishName">
                      {resTotal[indexTemple].dishName}
                    </div>
                    <div className="dishTag">
                      <ul>
                        {resTotal[indexTemple].dishTags.map(function (
                          item,
                          index
                        ) {
                          return (
                            <li>
                              <span>{Object.keys(item)[0]}</span>
                              <span>{Object.values(item)[0]}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="dishStep">
                      <ul>
                        {resTotal[indexTemple].dishStep.map(function (
                          item,
                          index
                        ) {
                          return (
                            <li>
                              步骤{index + 1}:
                              <div>
                                {/* <img src={baseURL + item.pic} alt="" /> */}
                              </div>
                              <div>{item.content}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="energy">
                      {resTotal[indexTemple].dishNutritionWeight.map(function (
                        item,
                        index
                      ) {
                        let itemTemple = String(item).slice(
                          0,
                          String(item).indexOf(".") + 3
                        );
                        switch (index) {
                          case 0:
                            return "蛋白质为：" + itemTemple + "g";
                            break;
                          case 1:
                            return "脂质为：" + itemTemple + "g";
                            break;
                          case 2:
                            return "碳水为：" + itemTemple + "g";
                            break;
                        }
                      })}
                    </div>
                    <div className="energy">
                      {dayliDishEnergyTemple.map(function (item, index) {
                        let itemTemple = String(item).slice(
                          0,
                          String(item).indexOf(".") + 3
                        );
                        switch (index) {
                          case 0:
                            return "蛋白质为：" + itemTemple + "g";
                            break;
                          case 1:
                            return "脂质为：" + itemTemple + "g";
                            break;
                          case 2:
                            return "碳水为：" + itemTemple + "g";
                            break;
                        }
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
