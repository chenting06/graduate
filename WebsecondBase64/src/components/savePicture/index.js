import React, { useState } from "react";
import axios from "axios";
import style from "./style.less";
import store from "../../store";
import { baseUrl } from "../beWrriten";
import { useEffect } from "react";
// import {upload} from "../../../public/img"
export default function SavePicture(props) {
  const [picBase, setPicBase] = useState("");
  useEffect(
    function () {
      if (props.isSubmit == true) {
        savePicture();
      }
    },
    [props.isSubmit]
  );
  function review() {
    console.log("监听到change事件");
    let file = document.querySelector("#input" + props.data).files[0];
    console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (ev) {
      setPicBase(ev.target.result);
      document
        .querySelector("#reviewImg" + props.data)
        .setAttribute("src", ev.target.result);
    };
  }
  function savePicture() {
    // axios.defaults.withCredentials = true;
    // let formdata = new FormData();
    // let file1 = document.querySelector("#input"+props.data).files[0];
    // if(file1){
    //   formdata.append("files", file1);
    //   axios({
    //     url: "http://localhost:7777/file/savePicture",
    //     method: "post",
    //     headers: { "Content-Type": "multipart/form-data" },
    //     data: formdata,
    //   })
    //     .then((res) => {
    //       if (res.data.error_code === 1) {
    //         alert(res.data.msg);
    //       } else {
    //         // alert("上传头像成功");
    //         // console.log(res);
    //         // console.log(res.data.data);
    //         let objTemple = { index: props.data, picId: res.data.data };
    //         // console.log(objTemple);
    //         props.changePicResult(objTemple);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }else{
    //   let objTemple={index:props.data,picId:""}
    //   props.changePicResult(objTemple);
    // }
    props.changePicResult(picBase);
  }
  return (
    <div className="editPic">
      <img
        id={`reviewImg${props.data}`}
        src={
          props.defaultSrc
            ? props.defaultSrc.replaceAll(" ", "+")
            : require("../../upload.png")
        }
        alt="点我改头像"
      />
      <input type="file" id={`input${props.data}`} onChange={review}></input>
      {/* <button onClick={savePicture}>点我提交头像</button> */}
    </div>
  );
}
