import React, { useState, useEffect } from "react";
import axios from "axios";
import SaveAvatar from "../../components/saveAvater";
import Navigater from "../../components/navigater";
import DishGeneral from "../../components/dishGeneral";
import EnergyResult from "../../components/energyResult";
import EnergyCommon from "../../components/energyCommon";
import { countScrollDistance } from "../../publicFunc/publicFunc";
import Ellipsis from "../../components/ellipsis";
import { observable, toJS } from "mobx";
import * as api from "../../services/api";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import store from "../../store";
import style from "./style.less";
import { Form, Select } from "antd";
import DishGeneralHome from "../../components/dishGeneralHome";
export default function MyInform() {
  // let authorDishes;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userHeight, setUserHeight] = useState(0);
  const [userWeight, setUserWeight] = useState(0);
  const [userWorkout, setUserWorkout] = useState("soft");
  const [userPsd, setUserPsd] = useState("");
  const [originUserPsd, setOriginUserPsd] = useState("****");
  const [authorDishes, setAuthorDishes] = useState([]);
  const [authorUsers, setAuthorUsers] = useState({});
  const [res, setRes] = useState();
  const [showSpeci, setShowSpeci] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [scrollBottom, setScrollBottom] = useState(0);
  // const [update,setUpdate]=useState();
  function judgeLoadMore() {
    // console.log("监听到滚动，改变底部距离");
    let scrollBottomTemple = countScrollDistance();
    setScrollBottom(scrollBottomTemple);
  }
  useEffect(async () => {
    await api.loginFree();
    let res = await api.getAuthorDishes(-1);
    setRes(res);
    // console.log(res.data.data);
    // console.log(res.data.data.userRes[0]);
    setUserName(store.userInform.user.userName);
    setUserHeight(store.userInform.user.userHeight);
    setUserWeight(store.userInform.user.userWeight);
    setUserWorkout(store.userInform.user.userWorkout);
    if (res.data.data) {
      setAuthorUsers(res.data.data.userRes[0]);
      // setAuthorDishes([...res.data.data.dishesRes]);
    }
    window.addEventListener("scroll", judgeLoadMore);
    // document
    //   .getElementsByClassName("myInformTotal")[0]
    //   .addEventListener("scroll", );
    return function () {
      window.removeEventListener("scroll", judgeLoadMore, false);
    };
  }, []);
  useEffect(async () => {
    if(showSpeci === 3) {
      let res = await api.getAuthorDishes(startPage);
      if (res.data.data && startPage === 0) {
        setAuthorDishes([...res.data.data.dishesRes]);
      } else {
        if (res.data.data && startPage != 0) {
          setAuthorDishes([...authorDishes, ...res.data.data]);
        }
      }
    }
    if (showSpeci === 4) {
      let res = await api.getUserLike(startPage);
      console.log(res);
      if (res.data.data && startPage === 0) {
        setAuthorDishes([...res.data.data]);
      } else {
        if (res.data.data && startPage != 0) {
          setAuthorDishes([...authorDishes, ...res.data.data]);
        }
      }
    }
    if (showSpeci === 5) {
      let res = await api.getUserDislike(startPage);
      console.log(res);
      if (res.data.data && startPage === 0) {
        setAuthorDishes([...res.data.data]);
      } else {
        if (res.data.data && startPage != 0) {
          setAuthorDishes([...authorDishes, ...res.data.data]);
        }
      }
    }
  }, [showSpeci]);
  useEffect(async () => {
    // console.log(scrollBottom);
    // console.log("底部距离改变，判断是否加载更多");
    if (scrollBottom <= 2 && showSpeci === 3) {
      // console.log("开始加载更多");
      let dishesArrItem = await api.getAuthorDishes(startPage + 1);
      if (dishesArrItem.data.data.dishesRes) {
        setAuthorDishes([
          ...authorDishes,
          ...dishesArrItem.data.data.dishesRes,
        ]);
      }

      setStartPage(startPage + 1);
    }
    if (showSpeci === 4) {
      let res = await api.getUserLike(startPage);
      console.log(res);
      if (res.data.data && startPage === 0) {
        setAuthorDishes([...res.data.data]);
      } else {
        if (res.data.data && startPage != 0) {
          setAuthorDishes([...authorDishes, ...res.data.data]);
        }
      }
      setStartPage(startPage + 1);
    }
    if (showSpeci === 5) {
      let res = await api.getUserDislike(startPage);
      if (res.data.data && startPage === 0) {
        setAuthorDishes([...res.data.data]);
      } else {
        if (res.data.data && startPage != 0) {
          setAuthorDishes([...authorDishes, ...res.data.data]);
        }
      }
      setStartPage(startPage + 1);
    }
  }, [scrollBottom]);
  return (
    <div className="myInformTotal">
      <Navigater />
      <div className="myInformcontent">
        <div className="verticleChoice">
          <ul>
            <li
              onClick={() => {
                setShowSpeci(1);
              }}
            >
              能量需求
            </li>
            <li
              onClick={() => {
                setShowSpeci(2);
              }}
            >
              信息修改
            </li>
            <li
              onClick={() => {
                setStartPage(0);
                // setAuthorDishes(null);
                setShowSpeci(3);
              }}
            >
              我的上传
            </li>
            {/* <li
            onClick={() => {
              setShowSpeci(4);
            }}
          >
            上传菜品
          </li> */}
            <li
              onClick={() => {
                setStartPage(0);
                //setAuthorDishes(null);
                setShowSpeci(4);
              }}
            >
              我的收藏
            </li>
            <li
              onClick={() => {
                setStartPage(0);
               // setAuthorDishes(null);
                setShowSpeci(5);
              }}
            >
              我的屏蔽
            </li>
            <li>
              <nav>
                <NavLink to="/addDish">上传菜品</NavLink>
              </nav>
            </li>
          </ul>
        </div>

        <div className="myInform">
          {showSpeci == 2 ? (
            <>
              {/* <SaveAvatar /> */}
              <div className="edit">
                用户名：
                <input
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  required
                />
                <span
                  className="iconfont fontEdit"
                  onClick={() => {
                    api.editUserName(userName);
                  }}
                >
                  &#xe733;
                </span>
              </div>
              <div className="edit">
                原密码：
                <input
                  value={originUserPsd}
                  onChange={(e) => {
                    setOriginUserPsd(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="edit">
                新密码：
                <input
                  value={userPsd}
                  onChange={(e) => {
                    setUserPsd(e.target.value);
                  }}
                  required
                />
                <span
                  className="iconfont fontEdit"
                  onClick={() => {
                    api.editUserPsd(originUserPsd, userPsd);
                  }}
                >
                  &#xe733;
                </span>
              </div>
              <div className="edit">
                身高：
                <input
                  value={userHeight}
                  onChange={(e) => {
                    setUserHeight(e.target.value);
                  }}
                  required
                />
                <span
                  className="iconfont fontEdit"
                  onClick={() => {
                    api.editUserHeight(userHeight);
                  }}
                >
                  &#xe733;
                </span>
              </div>
              <div className="edit">
                体重：
                <input
                  value={userWeight}
                  onChange={(e) => {
                    setUserWeight(e.target.value);
                  }}
                  required
                />
                <span
                  className="iconfont fontEdit"
                  onClick={() => {
                    api.editUserWeight(userWeight);
                  }}
                >
                  &#xe733;
                </span>
              </div>
              <div className="edit">
                <Form.Item label="运动量">
                  <Select
                    value={userWorkout}
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
                <span
                  className="iconfont fontEdit"
                  onClick={() => {
                    api.editUserWorkout(userWorkout);
                  }}
                >
                  &#xe733;
                </span>
              </div>
            </>
          ) : (
            ""
          )}
          {res && showSpeci == 1 ? (
            <EnergyCommon a={res.data.data.userRes[0]} />
          ) : (
            ""
          )}
          {showSpeci == 3 ? (
            <>
              <div className="authorDishesAll">
                {authorDishes ? (
                  authorDishes.map(function (item, index) {
                    return (
                      <DishGeneral
                        item={item}
                        key={item._id}
                        data={item._id}
                        authorUsers={authorUsers}
                      />
                    );
                  })
                ) : (
                  <span> "暂未上传菜品"</span>
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {showSpeci == 4 ? (
            <>
              <div className="authorDishesAll">
                {authorDishes ? (
                  authorDishes.map(function (item, index) {
                    return (
                      <DishGeneralHome
                        item={item}
                        key={item._id}
                        data={item._id}
                        authorUsers={authorUsers}
                      />
                    );
                  })
                ) : (
                  <span> "暂未收藏菜品"</span>
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {showSpeci == 5 ? (
            <>
              <div className="authorDishesAll">
                {authorDishes ? (
                  authorDishes.map(function (item, index) {
                    return (
                      <DishGeneralHome
                        item={item}
                        key={item._id}
                        data={item._id}
                        authorUsers={authorUsers}
                      />
                    );
                  })
                ) : (
                  <span> "暂未屏蔽菜品"</span>
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
