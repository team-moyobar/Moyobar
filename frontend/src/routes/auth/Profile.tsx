import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "./Login";
import CloseIcon from '@mui/icons-material/Close';

import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useHistory } from "react-router-dom";

import ProfileUserInfo from "../../components/auth/ProfileUserInfo";
import ProfileUpdateForm from "../../components/auth/ProfileUpdateForm";

interface ParamTypes {
  userNickname: string;
}

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

interface UserProps {
  userFlag: boolean;
}

function ProfileUpdateButton(props: UserProps) {
  const userFlag = props.userFlag;

  if (userFlag) {
    return (
      <a href="javascript:void(0);">
        <span className="profile-menu-title">
          <img src="/icons/edit-white.png" alt="" />
          <img src="/icons/edit-black.png" alt="" />
        </span>
        <span className="profile-menu-title">회원 정보 수정</span>
      </a>
    );
  } else {
    return null;
  }
}

function ProfileContent(props: StatusProps) {
  const { userNickname } = useParams<ParamTypes>();

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
    phone: "",
    type: "",
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

  const userStatus = props.status;

  const handleProfileLoad = () => {
    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    axios
      .get(`/users/info/${userNickname}`, config)
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
    case "profile":
      return <ProfileUserInfo user={user}></ProfileUserInfo>;
    case "update":
      return <ProfileUpdateForm user={user} />;
    default:
      return null;
  }
}

export default function Profile() {
  const [status, setStatus] = useState<string>("profile");

  const [userFlag, setFlag] = useState<boolean>(true);
  const myNickname = getToken("nickname");
  const { userNickname } = useParams<ParamTypes>();

  const history = useHistory();
  const isLogin = useSelector((state: RootState) => state.authReducer.isLogin);

  useEffect(() => {
    if (isLogin === false) {
      history.push("/login");
    }
    if (myNickname !== userNickname) {
      setFlag(false);
    }

    console.log(`현재 로그인한 닉네임 : ${myNickname}`);
    console.log(`프로필 보고싶은 사람 닉네임 : ${userNickname}`);
  }, []);

  const setStatusProfile = () => {
    setStatus("profile");
  };

  const setStatusUpdate = () => {
    setStatus("update");
  };

  const handleClose = () => {
    history.push('/lobby');
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
                <img src="/icons/profile-white.png" alt="" />
                <img src="/icons/profile-black.png" alt="" />
              </span>
              <span className="profile-menu-title">회원 프로필</span>
            </a>
          </li>
          <li onClick={setStatusUpdate}>
            <ProfileUpdateButton userFlag={userFlag} />
          </li>
          <li>
            <a href="javascript:void(0);">
              <span className="profile-menu-title">
                <img src="/icons/cup-white.png" alt="" />
                <img src="/icons/cup-black.png" alt="" />
              </span>
              <span className="profile-menu-title">참가 로그</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <span className="profile-menu-title">
                <img src="/icons/etc-white.png" alt="" />
                <img src="/icons/etc-black.png" alt="" />
              </span>
              <span className="profile-menu-title">나머지 기능</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="profile-userinfo">
        <ProfileContent status={status} />
        <span className="close-icon">
          <CloseIcon color="error" sx={{ fontSize: 40}} onClick={handleClose}></CloseIcon>
        </span>
      </div>
    </div>
  );
}
