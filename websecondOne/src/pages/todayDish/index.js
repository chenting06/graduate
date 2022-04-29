import React from "react";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./style.less";
export default function TodayDish() {
  const location = useLocation();
  const navigate = useNavigate();
  const [res, setRes] = useState();
  if (location.state) {
    var { dayliDishArr, dayliDishEnergy } = location.state;
  }
  useEffect(async function () {
    if (!location.state) {
      let res = await api.getDishRecommendation();
      if (res.data && res.data.data) {
        setRes(res);
      } else {
        await api.countDishRecommendation();
        res = await api.getDishRecommendation();
        setRes(res);
      }
      let weekDay = new Date().getDay();
      dayliDishArr = res.data.data.resultDishArr.slice(
        (weekDay - 1) * 4,
        (weekDay - 1) * 4 + 4
      );
      dayliDishEnergy = res.data.data.resultEnergyWeight[weekDay];
      // console.log(dayliDishArr);
      navigate("/todayDish", {
        state: { dayliDishArr, dayliDishEnergy },
      });
    }
  }, []);
  const baseURL = "http://localhost:8887/";
  // console.log(dayliDishArr, dayliDishEnergy);
  return (
    <div className="today">
      <div className="title">今日食谱</div>
      <div className="todayDish">
        {dayliDishArr
          ? [0, 0, 0, 0].map(function (item, indexTemple) {
              return (
                <div className="morning">
                  <img
                    src={baseURL + dayliDishArr[indexTemple].dishStep[0].pic}
                    alt=""
                  />
                  <div className="content">
                    <div className="dishName">
                      {dayliDishArr[indexTemple].dishName}
                    </div>
                    <div className="dishTag">
                      <ul>
                        {dayliDishArr[indexTemple].dishTags.map(function (
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
                        {dayliDishArr[indexTemple].dishStep.map(function (
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
                      {dayliDishArr[indexTemple].dishNutritionWeight.map(
                        function (item, index) {
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
                        }
                      )}
                    </div>
                    <div className="energy">
                      {dayliDishEnergy.map(function (item, index) {
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
          : "暂未获取今日食谱"}
      </div>
    </div>
  );
}
