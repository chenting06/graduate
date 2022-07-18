import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import GoHome from "../../components/goHome";
import style from "./style.less";
import * as api from "../../services/api";
import EnergyResult from "../../components/energyResult";
export default function DetailDish() {
  const location = useLocation();
  const item = location.state.item;
  let selfIdIndex = document.cookie.indexOf("userid");
  let selfId = document.cookie.slice(selfIdIndex + 7);
  const [isLike, setIsLike] = useState();
  const [isHate, setIsHate] = useState();
  const [dishRes, setDishRes] = useState();
  const [userRes, setUserRes] = useState();
  const [evaluateValue, setEvaluateValue] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [evaluateNum,setEvaluateNum]=useState(0);
  useEffect(async () => {
    let res = await api.getDishInform(item._id);
    console.log(res);
    setDishRes(res.data.data.dishRes);
    setUserRes(res.data.data.userRes);
    // 因为setDishRes修改的值只在下一次重新渲染时被更新
    // 所以此时不能立即使用dishRes,而是res.data.data.dishRes
    setIsLike(!(res.data.data.dishRes.dishLike.indexOf(selfId) < 0));
    setIsHate(!(res.data.data.dishRes.dishHate.indexOf(selfId) < 0));
    let evaluateNumTem=res.data.data.dishRes.dishEvaluate.length;
    for(let i=0;i<res.data.data.dishRes.dishEvaluate.length;i++){
      if(res.data.data.dishRes.dishEvaluate[i].value===0){
        evaluateNumTem--;
      }
    }
    setEvaluateNum(evaluateNumTem)
    // console.log(res);
  }, [isUpdate]);
  function mouseEnteraddClass(e) {
    let target = e.target;
    target.classList.add("self");
    while (target.previousSibling) {
      target = target.previousSibling;
      target.classList.add("self");
    }
  }
  function mouseLeaveEvaluate(e) {
    let target = e.target.parentNode.children[4];
    // console.log(target.previousSibling);
    target.setAttribute("class", "iconfont");
    while (target.previousSibling) {
      target = target.previousSibling;
      target.setAttribute("class", "iconfont");
    }
  }
  function myEvaluate() {
    let myValue;
    dishRes.dishEvaluate.map(function (item, index) {
      console.log(item.userId);
      console.log(selfId);
      if (item.userId == selfId) {
        myValue = item.value;
      }
    });
    return myValue;
  }
  // useEffect(async () => {
  //   if (isLike === true) {
  //     let res = await api.addDishLike(item._id);
  //   } else if (isLike === false) {
  //     let res = await api.deleteDishLike(item._id);
  //   }
  // }, [isLike]);
  // useEffect(async () => {
  //   if (isHate === true) {
  //     let res = await api.addDishHate(item._id);
  //   } else if (isHate === false) {
  //     let res = await api.deleteDishHate(item._id);
  //   }
  // }, [isHate]);
  const navigate = useNavigate();
  return (
    <div className="detailDishTotal">
      {/* 因为hooks useEffect没有组件加载前执行函数的生命周期
    所以可以先给一个空的组件，在执行完函数后，再给出真正的组件 */}
      {userRes && dishRes ? (
        <div className="detailDish">
          <div className="title"><span>{dishRes.dishName}</span><GoHome/></div>
          <div className="dishTag">
            用料：
            <ul>
              {dishRes.dishTags.map(function (item, index) {
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
              {dishRes.dishStep.map(function (item, index) {
                return (
                  <li>
                    步骤{index + 1}:
                    <div>
                      <img src={item.pic.replaceAll(" ", "+")} alt="" />
                    </div>
                    <div>{item.content}</div>
                  </li>
                );
              })}
              <li>
                <div className="energy">
                  <table>
                    <tr>
                      <th></th>
                      <th>蛋白质</th>
                      <th>脂质</th>
                      <th>碳水</th>
                      <th>单位</th>
                    </tr>
                    <tr>
                      <th>能量</th>
                      <th>
                        {String(dishRes.dishNutritionEnergy[0]).slice(
                          0,
                          String(dishRes.dishNutritionEnergy[0]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>
                        {String(dishRes.dishNutritionEnergy[1]).slice(
                          0,
                          String(dishRes.dishNutritionEnergy[1]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>
                        {String(dishRes.dishNutritionEnergy[2]).slice(
                          0,
                          String(dishRes.dishNutritionEnergy[2]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>kcal</th>
                    </tr>
                    <tr>
                      <th>重量</th>
                      <th>
                        {String(dishRes.dishNutritionWeight[0]).slice(
                          0,
                          String(dishRes.dishNutritionWeight[0]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>
                        {String(dishRes.dishNutritionWeight[1]).slice(
                          0,
                          String(dishRes.dishNutritionWeight[1]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>
                        {String(dishRes.dishNutritionWeight[2]).slice(
                          0,
                          String(dishRes.dishNutritionWeight[2]).indexOf(".") +
                            3
                        )}
                      </th>
                      <th>g</th>
                    </tr>
                  </table>
                </div>
                <div className="evaluate">
                  <div className="equalize">
                    <span>平均得分：</span>
                    <span>  
                      {dishRes.dishEvaluate.length
                        ? // 对象数组累加对象的某个属性值时要加pre值
                          String(dishRes.dishEvaluate.reduce(function (pre, cur) {
                            return pre + cur.value;
                          }, 0) / evaluateNum).slice(0,3)
                        : "暂无评分"}
                    </span>
                  </div>
                  <div className="myEvaluate">
                    <span>我的评分：</span>
                    {myEvaluate() ? myEvaluate() : "暂无评分"}
                  </div>
                  <div className="personalEvaluate">
                    <span
                      className="iconfont"
                      data-key="value1"
                      // onMouseOver={(e) => {
                      //   mouseLeaveEvaluate(e);
                      //   mouseEnteraddClass(e);
                      // }}
                      onClick={(e) => {
                        mouseLeaveEvaluate(e);
                        mouseEnteraddClass(e);

                        setEvaluateValue(
                          Number(e.target.getAttribute("data-key").slice(5))
                        );
                      }}
                    >
                      &#xe86f;
                    </span>
                    <span
                      className="iconfont"
                      data-key="value2"
                      // onMouseOver={(e) => {
                      //   mouseLeaveEvaluate(e);
                      //   mouseEnteraddClass(e);
                      // }}
                      onClick={(e) => {
                        mouseLeaveEvaluate(e);
                        mouseEnteraddClass(e);
                        setEvaluateValue(
                          Number(e.target.getAttribute("data-key").slice(5))
                        );
                      }}
                    >
                      &#xe86f;
                    </span>
                    <span
                      className="iconfont"
                      data-key="value3"
                      // onMouseOver={(e) => {
                      //   mouseLeaveEvaluate(e);
                      //   mouseEnteraddClass(e);
                      // }}
                      onClick={(e) => {
                        mouseLeaveEvaluate(e);
                        mouseEnteraddClass(e);
                        setEvaluateValue(
                          Number(e.target.getAttribute("data-key").slice(5))
                        );
                      }}
                    >
                      &#xe86f;
                    </span>
                    <span
                      className="iconfont"
                      data-key="value4"
                      // onMouseOver={(e) => {
                      //   mouseLeaveEvaluate(e);
                      //   mouseEnteraddClass(e);
                      // }}
                      onClick={(e) => {
                        mouseLeaveEvaluate(e);
                        mouseEnteraddClass(e);
                        setEvaluateValue(
                          Number(e.target.getAttribute("data-key").slice(5))
                        );
                      }}
                    >
                      &#xe86f;
                    </span>
                    <span
                      className="iconfont"
                      data-key="value5"
                      // onMouseOver={(e) => {
                      //   mouseLeaveEvaluate(e);
                      //   mouseEnteraddClass(e);
                      // }}
                      onClick={(e) => {
                        mouseLeaveEvaluate(e);
                        mouseEnteraddClass(e);
                        setEvaluateValue(
                          Number(e.target.getAttribute("data-key").slice(5))
                        );
                      }}
                    >
                      &#xe86f;
                    </span>

                    <button
                      onClick={async () => {
                        if (evaluateValue) {
                          console.log(evaluateValue);
                          let res = await api.addDishEvakuate(
                            dishRes._id,
                            evaluateValue
                          );
                          if (res.status === 201) {
                            alert("恭喜修改成功");
                            setIsUpdate(!isUpdate);
                          }
                          // console.log(res);
                        } else {
                          alert("您还未点击具体评分");
                          return;
                        }
                      }}
                    >
                      修改评分
                    </button>
                  </div>
                </div>
                <div className="collect">
                  <span
                    onClick={async () => {
                      setIsLike(!isLike);
                      if (!isLike === true) {
                        let res = await api.addDishLike(item._id);
                        let dishResTemple = dishRes;
                        dishResTemple.dishLike.push(0);
                        setDishRes({ ...dishResTemple });
                      } else if (!isLike === false) {
                        let res = await api.deleteDishLike(item._id);
                        let dishResTemple = dishRes;
                        dishResTemple.dishLike.pop();
                        setDishRes({ ...dishResTemple });
                      }
                      // console.log(isLike);
                    }}
                  >
                    <span
                      className={
                        !isLike
                          ? "iconfont iconfontPlus"
                          : "iconfont self iconfontPlus"
                      }
                    >
                      &#xeca7;
                    </span>
                    收藏人数： {dishRes.dishLike.length}
                  </span>
                  <span
                    onClick={async () => {
                      setIsHate(!isHate);
                      if (!isHate === true) {
                        let res = await api.addDishHate(item._id);
                        let dishResTemple = dishRes;
                        dishResTemple.dishHate.push(0);
                        setDishRes({ ...dishResTemple });
                      } else if (!isHate === false) {
                        let res = await api.deleteDishHate(item._id);
                        let dishResTemple = dishRes;
                        dishResTemple.dishHate.pop();
                        setDishRes({ ...dishResTemple });
                      }
                    }}
                  >
                    <span
                      className={
                        !isHate
                          ? "iconfont iconfontPlus"
                          : "iconfont self iconfontPlus"
                      }
                    >
                      &#xe6c5;
                    </span>
                    屏蔽人数： {dishRes.dishHate.length}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        " userRes"
      )}
    </div>
  );
}
