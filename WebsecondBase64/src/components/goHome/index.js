import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import style from "./style.less"
export default function GoHome() {
    const navigate=useNavigate();
  return (
    <div className='goHome'>
        <img src={require("../../../src/Home.png")} alt="" 
        onClick={()=>{navigate("/home")}}
        />
    </div>
  )
}
