import React from 'react'

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

import ProfileUserInfo from "../../components/auth/ProfileUserInfo"
import ProfileUpdateForm from "../../components/auth/ProfileUpdateForm"

interface DrinkType {
  beer: number;
  soju: number;
  liquor: number;
}

export interface UserInfo {
  user_id: string;
  nickname: string;
  birthday: string;
  img: string;
  score: number;
  drink: DrinkType;
  phone: string;
  type: string;
}

interface StatusProps {
  status: string;
}

function ProfileContent(props: StatusProps) {
  const [user, setUser] = useState({
    user_id: "",
    nickname: "",
    birthday: "",
    img: "",
    score: 0,
    drink: {
      beer: 0,
      soju: 0,
      liquor: 0,
    },
    phone: '',
    type: ''
  });

  // const [user_id, setUserId] = useState("");
  // const [nickname, setNickname] = useState("");
  // const [birthday, setBirthDay] = useState("");
  // const [img, setImg] = useState("");
  // const [score, setScore] = useState(0);
  // const [beer, setBeer] = useState(0);
  // const [soju, setSoju] = useState(0);
  // const [liquor, setLiquor] = useState(0);
  // const [phone, setPhone] = useState("");
  // const [type, setType] = useState("");

  const userStatus = props.status

  const myUser = {
    user_id: 'test',
    nickname: 'testNickname',
    birthday: '1996-06-14',
    img: 'img',
    score: 1,
    drink: {
      beer: 1,
      soju: 2,
      liquor: 1,
    },
    phone: '010-3686-9357',
    type: 'LOCAL'
  }


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
      .get("/users/info/test1", config)
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
  }, []);
  
  switch (userStatus) {
    case 'profile':
      return (
        <ProfileUserInfo user={user}></ProfileUserInfo>
      )
    case 'update':
      return (
        <ProfileUpdateForm user={user}/>
      )
    default:
      return null;
  }
}

export default function Profile() {
  const [status, setStatus] = useState<string>('profile');


  const setStatusProfile = () => {
    setStatus('profile')
  }

  const setStatusUpdate = () => {
    setStatus('update')
  }


  // let list = document.querySelectorAll(".profile-menu li");
  // function activeLink(this: any) {
  //   list.forEach((item) => item.classList.remove("hovered"));
  //   this.classList.add("hovered");
  //   console.log(this);
  // }

  // list.forEach((item) => item.addEventListener("mouseover", activeLink));

  return (
    <div className="profile-page-container">
      <div className="profile-menu">
        <ul>
          <li>
            <a href="javascript:void(0);" onClick={setStatusProfile}>
              <span className="profile-menu-title">
                <PersonOutline />
              </span>
              <span className="profile-menu-title">회원 프로필</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0);" onClick={setStatusUpdate}>
              <span className="profile-menu-title">
                <BuildOutline />
              </span>
              <span className="profile-menu-title">회원 정보 수정</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <span className="profile-menu-title">
                <CloudOutline />
              </span>
              <span className="profile-menu-title">참가 로그</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <span className="profile-menu-title">
                <EllipsisHorizontalOutline />
              </span>
              <span className="profile-menu-title">나머지 기능</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="profile-userinfo">
        <ProfileContent status={status}/>
      </div>
    </div>
  );
}
