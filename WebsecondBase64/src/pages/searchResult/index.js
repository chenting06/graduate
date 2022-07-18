import React, { useEffect, useState } from "react";
import { searchDishes } from "../../services/api";
import DishGeneralHome from "../../components/dishGeneralHome";
import { countScrollDistance } from "../../publicFunc/publicFunc";
import Navigater from "../../components/navigater";
import style from "./style.less";
import { data } from "browserslist";
export default function SearchResult() {
  const [searchContent, setSearchContent] = useState("");
  const [dishResult, setDishResult] = useState();
  const [bottomDistance,setBottomDistance]=useState(100);
  const [startPage,setStartPage]=useState(0);
 function judgeLoadMore(){
  let bottomDistanceTemple=countScrollDistance();
  setBottomDistance(bottomDistanceTemple);
 }
  useEffect(()=>{
    window.addEventListener("scroll",judgeLoadMore)
  },[])
  useEffect(async()=>{
    if(bottomDistance<2){
      let res = await searchDishes(searchContent,startPage+1);
            console.log(res);
            if (res.data.data) {
              setDishResult([...dishResult,...res.data.data]);
              setStartPage(startPage+1)
            } else {
              alert("已加载完毕");
            }
    }
  },[bottomDistance])
  return (
    <div className="searchResult">
      <Navigater  />
      <div className="search">
        <input
          type="text"
          placeholder="可以根据菜谱名，原料搜索"
          onChange={(e) => {
            setSearchContent(e.target.value);
            setStartPage(0);
          }}
        />

        <span
          className="iconfont searchfont"
          onClick={async () => {
            // console.log(searchContent);
            let res = await searchDishes(searchContent,startPage);
            console.log(res);
            if (res.data.data) {
              setDishResult(res.data.data);
            } else {
              alert("搜索结果为空");
            }
          }}
        >
          &#xe604;
        </span>
      </div>
      <div className="result">
        {dishResult
          ? dishResult.map(function (item) {
              return <DishGeneralHome item={item} />;
            })
          : ""}
      </div>
    </div>
  );
}
