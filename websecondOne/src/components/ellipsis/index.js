import React from "react";
import { useEffect } from "react";
import style from "./style.less"
export default function Ellipsis(props) {
  useEffect(() => {
    console.log(props.contentList);
    console.log(props.functionList);
  }, []);
  return (
    <div className="Ellipsis">
      <ul>
        {props.contentList.map(function (item, index) {
          return (
            <li>
              <span
                onClick={() => {
                  props.functionList[index]();
                }}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
