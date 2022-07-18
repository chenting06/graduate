import React from "react";
import style from "./style.less";
export default function EnergyCommon(props) {
    const energy = props.a.userNutritionEnergy?props.a.userNutritionEnergy:props.a.dishNutritionEnergy;
  const weight = props.a.userNutritionWeight?props.a.userNutritionWeight:props.a.dishNutritionWeight;
  return (
    <div className="energy">
      <table>
        <tr className="title">
          <th></th>
          <th>蛋白质</th>
          <th>脂质</th>
          <th>碳水</th>
          <th>单位</th>
        </tr>
        <tr>
          <th>能量</th>
          <th>
            {String(energy[0]).slice(
              0,
              String(energy[0]).indexOf(".") + 3
            )}
          </th>
          <th>
            {String(energy[1]).slice(
              0,
              String(energy[1]).indexOf(".") + 3
            )}
          </th>
          <th>
            {String(energy[2]).slice(
              0,
              String(energy[2]).indexOf(".") + 3
            )}
          </th>
          <th>kcal</th>
        </tr>
        <tr>
          <th>重量</th>
          <th>
            {String(weight[0]).slice(
              0,
              String(weight[0]).indexOf(".") + 3
            )}
          </th>
          <th>
            {String(weight[1]).slice(
              0,
              String(weight[1]).indexOf(".") + 3
            )}
          </th>
          <th>
            {String(weight[2]).slice(
              0,
              String(weight[2]).indexOf(".") + 3
            )}
          </th>
          <th>g</th>
        </tr>
      </table>
    </div>
  );
}
