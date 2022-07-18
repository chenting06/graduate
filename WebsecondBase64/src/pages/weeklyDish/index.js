import React, { useEffect } from "react";
import { useState } from "react";
import * as api from "../../services/api";
import style from "./style.less";
import GoHome from "../../components/goHome";
import { useNavigate } from "react-router-dom";
export default function WeeklyDish() {
  const [res, setRes] = useState();
  const navigate = useNavigate();
  useEffect(async function () {
    let res = await api.getDishRecommendation();
    if (res.data && res.data.data && Object.keys(Object).length > 0) {
      setRes(res);
    } else {
      await api.countDishRecommendation();
      res = await api.getDishRecommendation();
      setRes(res);
    }
  }, []);
  function getDishMater(startIndex) {
    console.log(res);
    // 获取mater二维数组
    let dataMater = res.data.data.resultDishArr
      .slice(startIndex, startIndex + 4)
      .map(function (item, index) {
        return item.dishTags;
      });
    // es6二维转一维方法
    dataMater = [].concat(...dataMater);
    // console.log(dataMater);
    // 这个不能让二维转一维
    // dataMater=[...dataMater]
    // console.log(dataMater);
    let materNameArr = dataMater.map(function (item) {
      return Object.keys(item)[0];
    });
    // console.log(materNameArr);
    return materNameArr;
  }
  async function updateRecommendation() {
    await api.countDishRecommendation();
    let resTemple = await api.getDishRecommendation();
    setRes({ ...resTemple });
  }
  function getWeekDay(indexDay) {
    switch (indexDay) {
      case 0:
        return "星期一";
        break;
      case 1:
        return "星期二";
        break;
      case 2:
        return "星期三";
        break;
      case 3:
        return "星期四";
        break;
      case 4:
        return "星期五";
        break;
      case 5:
        return "星期六";
        break;
      case 6:
        return "星期天";
        break;
    }
  }
  return (
    <>
      {res ? (
        <div className="weeklyDish">
          <p className="weeklyTitle">
            星期食谱
            <span
              className="iconfont iconUpdate"
              onClick={() => {
                updateRecommendation();
              }}
            >
              &#xe7cb;
            </span>
            <GoHome />
          </p>
          <div className="weeklyTotal">
            <ul>
              {[0, 0, 0, 0, 0, 0, 0, 0].map(function (item, indexDay) {
                if (indexDay < 7) {
                  return (
                    <li>
                      <div
                        className="card"
                        onClick={() => {
                          let weekDay = indexDay + 1;
                          let dayliDishArr = res.data.data.resultDishArr.slice(
                            (weekDay - 1) * 4,
                            (weekDay - 1) * 4 + 4
                          );
                          let dayliDishEnergy =
                            res.data.data.resultEnergyWeight[indexDay];
                          // console.log(dayliDishArr);
                          navigate("/todayDish", {
                            state: { dayliDishArr, dayliDishEnergy },
                          });
                        }}
                      >
                        <p className="cardTitle">{getWeekDay(indexDay)}</p>
                        <div className="cardContent">
                          <p>
                            今日菜谱有：
                            {res.data.data.resultDishArr
                              .slice(indexDay * 4, indexDay * 4 + 4)
                              .map(function (item, index) {
                                // console.log(item.dishName);
                                return (
                                  <span className="title">{item.dishName}</span>
                                );
                              })}
                          </p>
                          <p>
                            需要的原料有：
                            {getDishMater(indexDay * 4).map(function (item) {
                              return item + "   ";
                            })}
                          </p>
                          <p>
                            今日能量为{" "}
                            {res.data.data.resultEnergyWeight[indexDay].map(
                              function (item, index) {
                                item = String(item).slice(
                                  0,
                                  String(item).indexOf(".") + 3
                                );
                                switch (index) {
                                  case 0:
                                    return "蛋白质" + item + "  ";
                                    break;
                                  case 1:
                                    return "脂质" + item + "  ";
                                    break;
                                  case 2:
                                    return "碳水" + item + "  g";
                                    break;
                                }
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                } else {
                  return (
                    <li>
                      <div
                        className="card arrCard"
                        onClick={() => {
                          let weekDay = new Date().getDay();
                          let dayliDishArr = res.data.data.resultDishArr.slice(
                            (weekDay - 1) * 4,
                            (weekDay - 1) * 4 + 4
                          );
                          let dayliDishEnergy =
                            res.data.data.resultEnergyWeight[weekDay];
                          // console.log(dayliDishArr);
                          navigate("/todayDish", {
                            state: { dayliDishArr, dayliDishEnergy },
                          });
                        }}
                      >
                        <p className="cardTitle">去今日食谱</p>
                        <span className="iconfont arr">&#xe6a8;</span>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      ) : (
        "weeklyDish"
      )}
    </>
  );
}
