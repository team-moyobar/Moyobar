import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "./Login";
import {
  PersonOutline,
  BuildOutline,
  CloudOutline,
  EllipsisHorizontalOutline,
} from "react-ionicons";
interface UserInfo {
  user_id: string;
  nickname: string;
  birthday: null;
  img: null;
  score: 0;
  drink: null;
  phone: null;
  type: string;
}
export default function Profile() {
  const [user, setUser] = useState<UserInfo[]>([]);
  const handleProfileLoad = () => {
    const TOKEN = getCookie("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      params: {
        user_id: "test1",
      },
    };

    axios
      .get("/users/info/", config)
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...");
      });
  };

  useEffect(() => {
    handleProfileLoad();
  });
  let list = document.querySelectorAll(".profile-menu li");
  function activeLink(this: any) {
    list.forEach((item) => item.classList.remove("hovered"));
    this.classList.add("hovered");
    console.log(this);
  }
  list.forEach((item) => item.addEventListener("mouseover", activeLink));

  return (
    <div className="profile-page-container">
      <div className="profile-menu">
        <ul>
          <li>
            <a href="#">
              <span className="profile-menu-title">
                <PersonOutline />
              </span>
              <span className="profile-menu-title">회원 프로필</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="profile-menu-title">
                <BuildOutline />
              </span>
              <span className="profile-menu-title">회원 정보 수정</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="profile-menu-title">
                <CloudOutline />
              </span>
              <span className="profile-menu-title">참가 로그</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="profile-menu-title">
                <EllipsisHorizontalOutline />
              </span>
              <span className="profile-menu-title">나머지 기능</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="profile-userinfo">
        <h1>프로필</h1>
        <h1>{user}</h1>
      </div>
    </div>
  );
}
