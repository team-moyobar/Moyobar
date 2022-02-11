import "./Login.css";
import { useHistory } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "universal-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginCheck } from "../../redux/auth/action";
import { useEffect } from "react";
import { logoutCheck } from "../../redux/auth/action";

const cookies = new Cookies();

const setCookieNickname = (nickname: string) => {
  cookies.set("nickname", nickname, {
    path: "/",
  });
};

const setCookieToken = (token: string) => {
  cookies.set("jwtToken", token, {
    path: "/",
  });
};

export const getToken = (data: any) => {
  return cookies.get(data);
};

const deleteCookie = () => {
  cookies.remove("jwtToken");
  cookies.remove("nickname");
};

enum emailEnum {
  naver = "naver",
  gmail = "gmail",
}

interface IFormInput {
  userId: string;
  email: emailEnum;
  passWord: string;
}

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  function routeSignup() {
    history.push("/signup");
  }
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    axios
      .post("/auth/login", {
        user_id: `${data.userId}@${data.email}.com`,
        password: data.passWord,
        type: "LOCAL",
      })
      .then((res) => {
        setCookieToken(res.data.accessToken);
        setCookieNickname(res.data.nickname);
        dispatch(loginCheck(res.data.nickname));
        history.push("/lobby");
      })
      .catch(() => {
        alert("이메일과 비밀번호를 확인해주세요")
        history.push("/login");
      });
  };

  useEffect(() => {
    if (getToken("jwtToken")) {
      deleteCookie();
      dispatch(logoutCheck());
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-left">
        <p>당신의 술자리를 새롭게, MOYOBAR</p>
      </div>
      <div className="login-right">
        <p className="login">LOGIN</p>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="login-form">
            <div className="login-icon">
              <img src="/icons/auth/email.png" alt="" />
            </div>
            <div className="login-input login-email">
              <input placeholder="이메일" {...register("userId")} />
              <select className="login-select" {...register("email")}>
                <option value="naver">naver.com</option>
                <option value="gmail">gmail.com</option>
              </select>
            </div>
          </div>
          <div className="login-form">
            <div className="login-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="login-input">
              <input
                placeholder="비밀번호"
                type="password"
                {...register("passWord")}
              />
            </div>
          </div>
          <button className="login-submit" type="submit">
            로그인
          </button>
        </form>
        <p className="login-signup" onClick={routeSignup}>
          회원이 아니신가요? 지금 가입하세요
        </p>
        <div className="login-line">
          <div className="line"></div>
          <div className="line-or">or</div>
          <div className="line"></div>
        </div>
        <button className="login-kakao-button">
          <img src="/icons/auth/kakao.jpg" alt="" />
          Kakao 로그인
        </button>
        <button className="login-google-button">
          <img src="/icons/auth/google.png" alt="" />
          Google 로그인
        </button>
      </div>
    </div>
  );
}
