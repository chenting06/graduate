import React, { useState, useEffect, useRef } from "react";
// import  SavePicture  from "../../components/savePicture";
import SavePicture from "../../components/savePicture";
// import {useHistory} from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import * as api from "../../services/api";
import style from "./style.less";
import { useLocation } from "react-router-dom";
export default function EditDish() {
  const location = useLocation();
  // let dish = await api.getDishInform(location.state.item._id);
  const [dish, setDish] = useState(null);
  const [dishName, setDishName] = useState("菜名");
  const [dishTags, setDishTags] = useState([
    { 米饭: 11 },
    { 油: 1 },
    { 盐: 1 },
  ]);
  const [dishStep, setDishStep] = useState([
    { pic: "...", content: "将米洗净" },
  ]);
  const [materNum, setMaterNum] = useState([0]);
  const [stepNum, setStepNum] = useState([0]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [picResult, setPicResult] = useState([]);
  const navigate = useNavigate();
  const materRef = useRef(null);
  const stepRef = useRef(null);
  let picTemple = [];
  useEffect(async () => {
    let res = await api.getDishInform(location.state.item._id);
    if (res) {
      setDish(res.data.data.dishRes);
    }
    console.log(res.data.data);
    setDishName(res.data.data.dishRes.dishName);
    let materNumTemple = [];
    let stepNumTemple = [];
    console.log(res.data.data.dishRes.dishTags.length);
    // 因为setState()函数为异步的，最好不要在循环里用setState()函数赋值，否则可能只有最后一次赋值成功
    // for (let j = 1; j < dish.dishTags.length; j++) {
    //   setMaterNum([...materNum, j]);
    //   console.log(materNum);
    // }
    // for (let i = 1; i < dish.dishStep.length; i++) {
    //   setStepNum([...stepNum, i]);
    // }
    for (let i = 0; i < res.data.data.dishRes.dishTags.length; i++) {
      materNumTemple.push(i);
    }
    for (let i = 0; i < res.data.data.dishRes.dishStep.length; i++) {
      stepNumTemple.push(i);
    }
    setMaterNum(materNumTemple);
    setStepNum(stepNumTemple);
  }, []);
  // 点击提交首先触发的函数
  async function changePicResult(item) {
    // console.log(item);
    // let picTemple = [...picResult];
    picTemple.push(item);
    // console.log(item);
    // console.log(picTemple);
    if (picTemple.length === stepNum.length) {
      let dishTags = getDishTags();
      if (!dishTags) {
        alert("编辑失败");
        return;
      }
      let stepContentTemple = getDishStepContent();
      let stepPicTemple = picTemple;
      let dishStep = [];
      for (let i = 0; i < stepNum.length; i++) {
        // let indexTemple = 0;
        // stepPicTemple.map(function (item, index) {
        //   if (item.index === i) {
        //     indexTemple = index;
        //   }
        // });
        let objTemple = {
          pic: stepPicTemple[i]
            ? stepPicTemple[i]
            : dish.dishStep[i]
            ? dish.dishStep[i].pic
            : "",
          content: stepContentTemple[i],
        };
        // console.log(objTemple);
        dishStep.push(objTemple);
      }
      let answer = await api.editDish(dishName, dishTags, dishStep, dish._id);
      console.log(answer);
      if (answer.result) {
        navigate("/myInform");
      }
    }
  }
  function getDishTags() {
    let dishTagsTemple = [];
    let materList = materRef.current.childNodes;
    //节点组成的数组不能用map遍历
    for (let i = 0; i < materList.length; i++) {
      // console.dir(materList[i].childNodes[0].childNodes[1]);
      // console.log(materList[i].childNodes[0].childNodes[1].value);
      // if (!"") {
      //   console.log("空在if中判断为假");
      // }
      // if (!0) {
      //   console.log("0在if中判断为假");
      // }
      // 哪怕父节点只有一个子元素，子元素也要加上[0]
      let materName =
        materList[i].childNodes[0].childNodes[0].value != ""
          ? materList[i].childNodes[0].childNodes[0].value
          : dish.dishTags[i]
          ? Object.keys(dish.dishTags[i])[0]
          : "";
      let materCount =
        materList[i].childNodes[0].childNodes[1].value != ""
          ? materList[i].childNodes[0].childNodes[1].value
          : dish.dishTags[i]
          ? // 因为Object.values获取到的值为数组，所以要加[0]
            // 意义为获取对象的所有属性值
            Object.values(dish.dishTags[i])[0]
          : 0;
      if (!materName || !materCount) {
        alert("材料名，质量不能为空");
        return false;
      }
      let objTemple = {};
      objTemple[materName] = materCount;
      dishTagsTemple[i] = objTemple;
    }
    // console.log(dishTagsTemple);
    return dishTagsTemple;
  }
  function getDishStepContent() {
    let stepContentTemple = [];
    let stepContentEle = stepRef.current.childNodes;
    // console.log(stepContentEle);
    for (let i = 0; i < stepNum.length; i++) {
      // console.log(stepContentEle[i].childNodes[0]);
      let value = stepContentEle[i].childNodes[0].childNodes[1].childNodes[0]
        .value
        ? stepContentEle[i].childNodes[0].childNodes[1].childNodes[0].value
        : dish.dishStep[i]
        ? dish.dishStep[i].content
        : "";
      stepContentTemple.push(value);
    }
    return stepContentTemple;
  }
  return (
    <div className="addDish">
      {dish ? (
        <>
          <input
            type="text"
            onChange={(e) => {
              setDishName(e.target.value);
            }}
            value={dishName}
          />
          <div className="material">
            材料标签：
            
            <ul ref={materRef}>
              {materNum.map(function (item, index) {
                // console.log(materNum);
                return (
                  <li key={item} data={item}>
                    <div className="line">
                      <input
                        className="materName"
                        placeholder={
                          dish.dishTags[item]
                            ? Object.keys(dish.dishTags[item])
                            : ""
                        }
                      />
                      <input
                        className="materCount"
                        placeholder={
                          dish.dishTags[item]
                            ? Object.values(dish.dishTags[item])
                            : 0
                        }
                      />
                      <button
                        onClick={(e) => {
                          // console.log("删除本行");
                          // key为保留属性，好像获取不到他的值，此时另建一个属性就可
                          // console.log(e.target.parentNode.parentNode.getAttribute("key"));
                          // 因为获取的属性值都为String所以要和数值比较的话得转换一下
                          let data = Number(
                            e.target.parentNode.parentNode.getAttribute("data")
                          );
                          let materNumTemple = [...materNum];
                          let index = materNumTemple.indexOf(data);
                          // console.log(materNumTemple);
                          // console.log(index);
                          materNumTemple.splice(index, 1);
                          setMaterNum(materNumTemple);
                        }}
                      >
                        删除本行
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="editLine">
              <span
                className="addLine"
                onClick={() => {
                  // console.log("添加一行");
                  if (materNum.length > 0) {
                    // 数组赋值时最好换个地址，
                    // 否则改值时react无法接收
                    let materNumTemple = [...materNum];
                    materNumTemple.push(materNum[materNum.length - 1] + 1);
                    setMaterNum(materNumTemple);
                    // console.log(materNum);
                  } else {
                    let materNumTemple = [0];
                    setMaterNum(materNumTemple);
                  }
                }}
              >
                添加一行
              </span>
              <span
                className="deleteLine"
                onClick={() => {
                  // console.log("删除最后一行");
                  if (materNum.length > 0) {
                    let materNumTemple = [...materNum];
                    materNumTemple.pop();
                    setMaterNum(materNumTemple);
                  } else {
                    alert("材料标签已全部删除");
                  }
                }}
              >
                删除最后一行
              </span>
            </div>
          </div>
          做法：
          <div className="editStepAll">
            <ul ref={stepRef}>
              {stepNum.map(function (item, index) {
                // console.log(stepNum);
                return (
                  <li key={item} data={item}>
                    <div className="editStep">
                      <SavePicture
                        isSubmit={isSubmit}
                        data={index}
                        changePicResult={changePicResult}
                        defaultSrc={
                          dish.dishStep[item] ? dish.dishStep[item].pic : ""
                        }
                      />
                      <div className="content">
                        <textarea
                          name=""
                          cols="50"
                          rows="5"
                          placeholder={
                            dish.dishStep[item]
                              ? dish.dishStep[item].content
                              : ""
                          }
                        ></textarea>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <span
            className="addLine"
              onClick={() => {
                if (stepNum.length > 0) {
                  let stepNumTemple = [...stepNum];
                  // 每当通过其他变量赋值时都要考虑其他变量为空或者undefined的情况
                  stepNumTemple.push(stepNum[stepNum.length - 1] + 1);
                  setStepNum(stepNumTemple);
                  // console.log(stepNum);
                } else {
                  let stepNumTemple = [0];
                  setStepNum(stepNumTemple);
                }
              }}
            >
              增加步骤
            </span>
            <span
            className="deleteLine"
              onClick={() => {
                if (stepNum.length > 0) {
                  // console.log("监听到删除");
                  let stepNumTemple = [...stepNum];
                  stepNumTemple.pop();
                  setStepNum(stepNumTemple);
                } else {
                  alert("步骤已为空");
                }
              }}
            >
              删除步骤
            </span>
          </div>
          <button
            onClick={() => {
              setIsSubmit(!isSubmit);
              // submitAll();
            }}
          >
            提交
          </button>
        </>
      ) : (
        "加载中"
      )}
    </div>
  );
}
