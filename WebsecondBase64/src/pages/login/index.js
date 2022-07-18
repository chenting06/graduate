import style from "./style.less";
import { React, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toJS } from "mobx";
import store from "../../store";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import * as api from "../../services/api";
// const style = require("./style.less");

function Login() {
  // console.log(style.login_form);
  const [userName, setUserName] = useState("");
  const [userPsd, setUserPsd] = useState("");
  const navigate = useNavigate();
  async function login(userName, userPsd) {
    let res = await api.login(userName, userPsd);
    //  console.log(res);
    if (res.data.error_code === 0) {
      navigate("/home");
    }
  }
  return (
    <div className="login">
      {/* <img src="../../../public/dafaultAvatar.jpg" alt="" /> */}
      {/* <div className="mask"></div> */}
      <div className="loginTotal">
        <div className="maskLogin">
          <p className="loginTitle">登录</p>
          <Form
            name="normal_login"
            className="login_form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site_form_item_icon" />}
                placeholder="用户名"
                className="loginButton"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site_form_item_icon" />}
                type="password"
                className="loginButton"
                placeholder="密码"
                onChange={(e) => {
                  setUserPsd(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="loginButton"
                onClick={() => {
                  login(userName, userPsd);
                  //  navigate("/home");
                }}
              >
                确认登录
              </Button>
              {/* Or <a href="/register">去注册</a>
          <a href="/home">去首页</a> */}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default observer(Login);
