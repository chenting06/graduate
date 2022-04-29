import * as React from "react";
import axios from "axios";
import { Form, Input, Select } from "antd";
import EnergyResult from "../../components/energyResult";
import beWritten from "../../components/beWrriten";
import { useState } from "react";
import * as api from "../../services/api";

// import * as api from "../../services/api";
const style = require("./style.less");
// const headers={
//   "accept": "*/*",
//   "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
//   "sec-fetch-dest": "empty",
//   "sec-fetch-mode": "cors",
//   "sec-fetch-site": "same-origin",
//   "cookie": "cookie: PHPSESSID=62tjcc0alrlp8pv5bn3a96s10h; gznotes-visited=true; SMMSrememberme=68568%3A3ff2977753fbad8c24b30f0857e3dfcb3cd04096; SM_FC=n49M5v28jWwzl1BJc2iyHsQeUZjgT7Y9bIElf5jtwMBYJzkQ2U4ning1j9gbsWYfwKUNyGjiTLcV",
//   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
// }
export default function Register() {
  const [componentSize, setComponentSize] = useState("");
  const [userName, setUserName] = useState("");
  const [userHeight, setUserHeight] = useState(0);
  const [userWeight, setUserWeight] = useState(0);
  const [userWorkout, setUserWorkout] = useState("soft");

  const [userPsd, setUserPsd] = useState("asdf");
  const [isResult, setIsResult] = useState(false);
  // result要用来传给子组件，不能用 let result;
  // 而要用useState,否则传给子组件的为undefined
  const [result,setResult]=useState({});
  
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  async function issue(userName, userHeight, userWeight, userWorkout, userPsd) {
    let res = await api.issue(
      userName,
      userHeight,
      userWeight,
      userWorkout,
      userPsd
    );
    console.log(res);
    if (res) {
      // result = res.data.data;
      
      // console.log(result);
      setResult({...(res.data.data)})
      setIsResult(true);
    }
  }

  return (
    
    <div className="registerTotal">
       <div className="title">注册</div>
      {!isResult ? (
        <div className="register">
         
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            initialValues={{
              size: componentSize,
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
          >
            <Form.Item label="用户名">
              <Input
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                required
              />
            </Form.Item>
            <Form.Item label="密码">
              <Input
                onChange={(e) => {
                  setUserPsd(e.target.value);
                }}
                required
              />
            </Form.Item>
            <Form.Item label="身高（以厘米为单位）">
              <Input
                onChange={(e) => {
                  setUserHeight(e.target.value);
                }}
                required
              />
            </Form.Item>
            <Form.Item label="体重（以公斤千克为单位）">
              <Input
                onChange={(e) => {
                  setUserWeight(e.target.value);
                }}
                required
              />
            </Form.Item>
            <Form.Item label="运动量">
              <Select
                onChange={(value) => {
                  setUserWorkout(value);
                }}
              >
                <Select.Option value="soft">
                  轻体力劳动者：75%时间坐或站立，25%时间站着活动，如从事办公室工作、修理电器、售货员等。
                </Select.Option>
                <Select.Option value="medium">
                  中体力劳动者：25%时间坐或站立，75%时间特殊职业活动，如学生日常生活、机动车驾驶员、电工、安装人员、车床操作者、从事金属切割的人员等。
                </Select.Option>
                <Select.Option value="hard">
                  重体力劳动者：40%时间坐或站立，60%时间特殊职业活动，如从事非机械化农业劳动，炼钢、舞蹈、体育活动、装卸、采矿等。
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
          <button
            onClick={() => {
              issue(userName, userHeight, userWeight, userWorkout, userPsd);
            }}
          >
            注册
          </button>
        </div>
      ) : (
        
        <EnergyResult a={result}/>
      )}

      {/* <img src="../defaultAvatar.jpg" alt="" /> */}
    </div>
  );
}
