import React, { useState, useEffect, useRef } from "react";
// import  SavePicture  from "../../components/savePicture";
import SavePicture from "../../components/savePicture";
// import {useHistory} from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import * as api from "../../services/api";
import style from "./style.less";
export default function AddDish() {
  const [dishName, setDishName] = useState("菜名");
  const [dishTags, setDishTags] = useState([
    { 米饭: 11 },
    { 油: 1 },
    { 盐: 1 },
  ]);
  const [dishStep, setDishStep] = useState([
    { pic: "...", content: "将米洗净" },
  ]);
  const [materNum, setMaterNum] = useState([1, 2, 3]);
  const [stepNum, setStepNum] = useState([1, 2, 3]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [picResult, setPicResult] = useState([]);
  const navigate = useNavigate();
  const materRef = useRef(null);
  const stepRef = useRef(null);
  let picTemple = [];
  // for(let i=0;i<materNum.length;i++){
  //  eval("const inpRefRightMater"+i.toString()+"=useRef()") ;
  // }
  // 点击提交首先触发的函数
  async function changePicResult(item) {
    // console.log(item);
    // let picTemple = [...picResult];
    picTemple.push(item);
    // console.log(picTemple);
    if (picTemple.length === stepNum.length) {
      let mealTime = document.getElementById("mealTime").value;
      let dishTags = getDishTags();
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
          pic: stepPicTemple[i],
          content: stepContentTemple[i],
        };
        console.log(objTemple);
        dishStep.push(objTemple);
      }
      let res = await api.addDish(dishName, dishTags, dishStep, mealTime);
      //window.location.reload();
      console.log(res);
      if (res) {
        console.log(res);
        // navigate("/myInform");
      }
      // console.log(dishStep);
      // console.log(dishTags);
      // console.log(dishName);
    }

    // setPicResult(picTemple);
    // console.log(picResult);
  }
  function getDishTags() {
    let dishTagsTemple = [];
    let materList = materRef.current.childNodes;
    //节点组成的数组不能用map遍历
    for (let i = 0; i < materList.length; i++) {
      // 哪怕父节点只有一个子元素，子元素也要加上[0]
      let materName = materList[i].childNodes[0].childNodes[0].value;
      let materCount = Number(materList[i].childNodes[0].childNodes[1].value);
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
      let value =
        stepContentEle[i].childNodes[0].childNodes[1].childNodes[0].value;
      stepContentTemple.push(value);
    }
    return stepContentTemple;
  }
  // function submitAll() {
  // let dishTagsTemple = getDishTags();
  // if (!dishTagsTemple) {
  //   return false;
  // }
  // materList.map(function(item,index){
  //   console.log(item.childNodes.childNodes[0]);
  // })
  // console.log(inpRefRightMater0.value);
  // }
  return (
    <div className="addDish">
      <div className="title">添加菜品</div>
      <div className="addDishContent">
        菜名：
        <input
          type="text"
          onChange={(e) => {
            setDishName(e.target.value);
          }}
        />
        <div className="mealTime">
          建议用餐时间
          <select name="mealTime" id="mealTime">
            <option value="morning">早餐</option>
            <option value="noon">中/晚餐</option>
          </select>
        </div>
        <div className="material">
          材料标签：
          <ul ref={materRef}>
            {/* {(function () {
            let contentArr = [];
            let content;
            let contentTemple = `<li>
            <div className="line">
              <input
                className="materName"
                placeholder="食材：如鸡蛋"
                id="materName1"
              />
              <input
                className="materCount"
                placeholder="用量：如1只"
                id="materCount1"
              />
            </div>
          </li>`;
            for (let i = 0; i <= materNum; i++) {
              contentArr.push(contentTemple);
              content+=contentTemple;
            }
            let parser=new DOMParser();
            var doc=parser.parseFromString(content,"text/xml");
            console.log(doc);
            return doc.innerHTML;
            
            // let doc=[];
            // contentArr.map(function(item){
            //   doc.push(parser.parseFromString(item,"text/xml"))
            // })
            //  return doc;
            return contentArr;
          })()} */}
            {materNum.map(function (item, index) {
              return (
                <li key={item} data={item}>
                  <div className="line">
                    <input className="materName" placeholder="食材：如鸡蛋" />
                    <input
                      className="materCount"
                      placeholder="用量:以g为单位"
                    />
                    <button
                      onClick={(e) => {
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
                if (materNum.length > 0) {
                  // 数组赋值时最好换个地址，
                  // 否则改值时react无法接收
                  let materNumTemple = [...materNum];
                  materNumTemple.push(materNum[materNum.length - 1] + 1);
                  setMaterNum(materNumTemple);
                } else {
                  let materNumTemple = [0];
                  setMaterNum(materNumTemple);
                }
              }}
            >
              添加一行
            </span>
            <span
              className="editAll"
              onClick={() => {
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
              return (
                <li key={item} data={item}>
                  <div className="editStep">
                    <SavePicture
                      isSubmit={isSubmit}
                      data={index}
                      changePicResult={changePicResult}
                    />
                    <div className="content">
                      <textarea
                        name=""
                        id=""
                        cols="50"
                        rows="5"
                        placeholder="做法"
                      ></textarea>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <span
            onClick={() => {
              if (stepNum.length > 0) {
                let stepNumTemple = [...stepNum];
                // 每当通过其他变量赋值时都要考虑其他变量为空或者undefined的情况
                stepNumTemple.push(stepNum[stepNum.length - 1] + 1);
                setStepNum(stepNumTemple);
              } else {
                let stepNumTemple = [0];
                setStepNum(stepNumTemple);
              }
            }}
          >
            增加步骤
          </span>
          <span
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
      </div>
    </div>
  );
}
