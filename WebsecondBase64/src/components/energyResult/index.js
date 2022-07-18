import style from "./style.less";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function EnergyResult(props) {
  const navigate = useNavigate();
  console.log(props);
  const energy = props.a.userNutritionEnergy?props.a.userNutritionEnergy:props.a.dishNutritionEnergy;
  const weight = props.a.userNutritionWeight?props.a.userNutritionWeight:props.a.dishNutritionWeight;
  return (
    <div className="EnergyResult">
      <div>恭喜成功注册！</div>
      <span>据计算您每日所需能量及重量为</span>
      <table className="result">
        <tbody>
          <tr>
            <th></th>
            <th>蛋白质</th>
            <th>脂质</th>
            <th>碳水</th>
            <th>单位</th>
          </tr>
          <tr>
            <th>能量值</th>
            <th>{energy[0]}</th>
            <th>{energy[1]}</th>
            <th>{energy[2]}</th>
            <th>千卡</th>
          </tr>
          <tr>
            <th>重量值</th>
            <th>{weight[0]}</th>
            <th>{weight[1]}</th>
            <th>{weight[2]}</th>
            <th>克</th>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        去登陆
      </button>
    </div>
  );
}
