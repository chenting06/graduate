import React, { useState } from "react";
import { searchDishes } from "../../services/api";
import DishGeneralHome from "../../components/dishGeneralHome";
import style from "./style.less";
export default function SearchResult() {
  const [searchContent, setSearchContent] = useState("");
  const [dishResult, setDishResult] = useState();
  return (
    <div className="searchResult">
      <div className="search">
        <input
          type="text"
          placeholder="搜菜谱食谱作者"
          onChange={(e) => {
            setSearchContent(e.target.value);
          }}
        />

        <span
          className="iconfont searchfont"
          onClick={async () => {
            // console.log(searchContent);
            let res = await searchDishes(searchContent);
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
