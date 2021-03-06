import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "./Login";
import CloseIcon from "@mui/icons-material/Close";

import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import ProfileUserInfo from "../../components/auth/ProfileUserInfo";
import ProfileUpdateForm from "../../components/auth/ProfileUpdateForm";
import Chart from "../../components/auth/Chart";
import Ranking from "../../components/auth/Ranking";
import MyScore from "../../components/auth/MyScore";

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
  description: string;
}

interface StatusProps {
  status: string;
  flagUpdate: (value: string) => void;
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
          <img src="/icons/auth/edit-white.png" alt="" />
          <img src="/icons/auth/edit-black.png" alt="" />
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
  const [updateKey, setUpdateKey] = useState(0);

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
    description: "",
  });
  const [logs, setLogs] = useState({
    date: "",
    count: "",
    elapsed_times: "0",
  });
  const [ranking, setRanking] = useState({
    rank: "",
    nickname: "",
    score: "",
  });

  const [score, setScore] = useState({
    rank: "",
    nickname: "",
    score: "",
  });

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
        setUser(res.data);
      })
      .catch(() => {});
  };

  const handleLogLoad = () => {
    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    axios
      .get(`/users/${userNickname}/logs`, config)
      .then((res) => {
        setLogs(res.data);
      })
      .catch(() => {});
  };

  const handleRankingLoad = () => {
    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    axios
      .get(`/rank`, config)
      .then((res) => {
        setRanking(res.data);
      })
      .catch(() => {});

    axios
      .get(`/rank/${userNickname}`, config)
      .then((res) => {
        setScore(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    handleProfileLoad();
    handleLogLoad();
    handleRankingLoad();
  }, []);
  const updateCheck = (value: number) => {
    setUpdateKey(updateKey + value);
    props.flagUpdate("profile");
  };

  useEffect(() => {
    handleProfileLoad();
  }, [updateKey]);

  switch (userStatus) {
    case "profile":
      return <ProfileUserInfo user={user}></ProfileUserInfo>;
    case "update":
      return <ProfileUpdateForm user={user} updateCheck={updateCheck} />;
    case "log":
      return <Chart logs={logs} usernickname={userNickname} />;
    case "ranking":
      console.log(score.rank);
      return (
        <div className="rank-container">
          <p className="rank-title">
            <span>{userNickname}</span> 님의 술게임 실력은?
          </p>
          <p className="rank-content">
            {userNickname} 님의 순위는{" "}
            <span className="rank-person">{score.rank}</span>위 입니다.
          </p>
          <div className="profile-ranking-container">
            <div style={{ width: "65%" }}>
              <Ranking ranking={ranking} MyScore={score} />
            </div>
            <div style={{ width: "30%" }}>
              <MyScore score={score} />
            </div>
          </div>
        </div>
      );
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

  useEffect(() => {
    if (getToken("jwtToken") === undefined) {
      history.push("/login");
    }
    if (myNickname !== userNickname) {
      setFlag(false);
    }
  }, []);

  const setStatusProfile = () => {
    setStatus("profile");
  };

  const setStatusUpdate = () => {
    setStatus("update");
  };

  const setStatusLog = () => {
    setStatus("log");
  };

  const setStatusRanking = () => {
    setStatus("ranking");
  };

  const flagUpdate = (value: string) => {
    setStatus(value);
  };

  const handleClose = () => {
    history.push("/lobby");
  };

  return (
    <div className="profile-page-container">
      <div className="profile-menu">
        <ul>
          <li>
            <a href="javascript:void(0);" onClick={setStatusProfile}>
              <span className="profile-menu-title">
                <img src="/icons/auth/profile-white.png" alt="" />
                <img src="/icons/auth/profile-black.png" alt="" />
              </span>
              <span className="profile-menu-title">회원 프로필</span>
            </a>
          </li>
          <li onClick={setStatusUpdate}>
            <ProfileUpdateButton userFlag={userFlag} />
          </li>
          <li>
            <a href="javascript:void(0);" onClick={setStatusLog}>
              <span className="profile-menu-title">
                <img src="/icons/auth/etc-white.png" alt="" />
                <img src="/icons/auth/etc-black.png" alt="" />
              </span>
              <span className="profile-menu-title">참가 내역</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0);" onClick={setStatusRanking}>
              <span className="profile-menu-title">
                <img src="/icons/auth/cup-white.png" alt="" />
                <img src="/icons/auth/cup-black.png" alt="" />
              </span>
              <span className="profile-menu-title">랭킹</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="profile-userinfo">
        <ProfileContent status={status} flagUpdate={flagUpdate} />
        <span className="close-icon">
          <CloseIcon
            color="inherit"
            sx={{ fontSize: 30 }}
            onClick={handleClose}
          ></CloseIcon>
        </span>
      </div>
    </div>
  );
}
