import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Signup.css";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getToken } from "./Login";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
enum emailEnum {
  naver = "naver",
  gmail = "gmail",
}

enum alcoholEnum {
  soju = "soju",
  beer = "beer",
  liquor = "liquor",
}

interface IFormInput {
  userId: string;
  email: emailEnum;
  passWord: string;
  passWordCheck: string;
  userNickName: string;
  birth: Date;
  alcohol: alcoholEnum;
  amountOfAlcohol: number;
  phoneNumber: string;
}

export default function Signup() {
  const history = useHistory();

  function routeLogin() {
    history.push("/login");
  }
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("naver");

  const [flagNickname, setCheckNickname] = useState(false);
  const [flagUserId, setCheckUserId] = useState(false);

  const [emailOn, setemailOn] = useState<boolean>(false);
  const [nickNameOn, setnickNameOn] = useState<boolean>(false);

  const setFlagNickname = () => {
    setCheckNickname(true);
  };

  const setFlagUserId = () => {
    setCheckUserId(true);
  };

  const changeUserId = (e: any) => {
    setemailOn(true);
    setId(e.target.value);
    setCheckUserId(false);
  };
  const changeEmail = (e: any) => {
    setEmail(e.target.value);
    setCheckUserId(false);
  };

  const changeNickname = (e: any) => {
    setnickNameOn(true);
    setNickname(e.target.value);
    setCheckNickname(false);
  };

  const checkId = (e: any) => {
    e.preventDefault();
    axios
      .get(`/users/id/${id}@${email}.com`)
      .then((res) => {
        if (res.data) {
          alert("사용할 수 없는 아이디 입니다.");
        } else {
          alert("사용 가능한 아이디입니다.");
          setFlagUserId();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkNickname = (e: any) => {
    e.preventDefault();
    console.log(`${nickname}`);
    axios
      .get(`/users/nickname/${nickname}`)
      .then((res) => {
        if (res.data) {
          alert("사용할 수 없는 닉네임입니다.");
        } else {
          alert("사용 가능한 닉네임입니다.");
          setFlagNickname();
        }
      })
      .catch((err) => {
        console.log("서버와 통신오류.. 잠시 뒤 다시 실행해주세요");
        console.log(err);
      });
  };

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (flagUserId) {
      console.log(`flagUserId : ${flagUserId}`);
      if (flagNickname) {
        console.log(`flagNickname : ${flagNickname}`);
        axios
          .post("/users", {
            user_id: `${data.userId}@${data.email}.com`,
            drink: {
              soju: 3,
            },
            nickname: data.userNickName,
            password: data.passWord,
            birthday: data.birth,
            phone: data.phoneNumber,
            type: "LOCAL",
          })
          .then((res) => {
            console.log("success");
            console.log(res);
            history.push("/login");
          })
          .catch((err) => {
            console.log("Fail..");
            console.log(err);
          });
      } else {
        alert("닉네임 중복검사 해주세요");
      }
    } else {
      alert("아이디 중복검사 해주세요");
    }
  };

  useEffect(() => {
    if (getToken("jwtToken")) {
      history.push("/lobby");
    }
  }, []);

  return (
    <div className="signup-container">
      <div className="signup-left">
        <p>당신의 술자리를 새롭게, MOYOBAR</p>
      </div>
      <div className="signup-right">
        <p className="signup">SIGNUP</p>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/email.png" alt="" />
            </div>
            <div className="signup-radius signup-border">
              <input
                placeholder="이메일"
                {...register("userId")}
                onChange={changeUserId}
              />
              <select
                className="signup-select"
                {...register("email")}
                onChange={changeEmail}
              >
                <option selected value="naver">
                  naver.com
                </option>
                <option value="gmail">gmail.com</option>
              </select>
              <div className={`signup-duplicate ${emailOn ? "email-on" : ""}`}>
                <button onClick={checkId}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="signup-input">
              <input
                placeholder="비밀번호"
                type="password"
                {...register("passWord")}
              />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="signup-input">
              <input
                placeholder="비밀번호 확인"
                type="password"
                {...register("passWordCheck")}
              />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/nickname.png" alt="" />
            </div>
            <div className="signup-radius">
              <input
                placeholder="닉네임"
                {...register("userNickName")}
                onChange={changeNickname}
              />
              <div
                className={`signup-duplicate ${
                  nickNameOn ? "nickname-on" : ""
                }`}
              >
                <button onClick={checkNickname}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/phone.png" alt="" />
            </div>
            <div className="signup-input">
              <input placeholder="휴대전화 번호" {...register("phoneNumber")} />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/calendar.png" alt="" />
            </div>
            <div className="input-date">
              <DatePicker className="date-picker" />
              <div
                className={`signup-duplicate ${
                  nickNameOn ? "nickname-on" : ""
                }`}
              >
                <button onClick={checkNickname}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/alcohol.png" alt="" />
            </div>
            <div className="signup-input signup-border-al">
              <select className="signup-select-al" {...register("alcohol")}>
                <option value="soju" selected>
                  소주
                </option>
                <option value="beer">맥주</option>
                <option value="liquor">양주</option>
              </select>
              <input
                id="signup-input"
                placeholder="주량"
                {...register("amountOfAlcohol")}
              />
            </div>
          </div>
          <button className="signup-submit" type="submit">
            회원가입
          </button>
        </form>
        <p className="signup-login" onClick={routeLogin}>
          로그인으로 돌아가기
        </p>
      </div>
    </div>
  );
}
