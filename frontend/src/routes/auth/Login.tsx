import "./Login.css";
import { useHistory } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

const setToken = (token: string) => {
  cookies.set("jwtToken", token, {
    path: "/",
  });
};

export const getToken = (data: any) => {
  return cookies.get(data);
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
        setToken(res.data.accessToken);
        history.push("/lobby");
      })
      .catch(() => {
        history.push("/login");
      });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <p>Welcome to MOYOBAR</p>
      </div>
      <div className="login-right">
        <p>LOGIN</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login-form">
            <div className="login-input">
              <input placeholder="이메일" {...register("userId")} />
              <select className="login-select" {...register("email")}>
                <option value="naver">naver.com</option>
                <option value="gmail">gmail.com</option>
              </select>
            </div>
          </div>
          <div className="login-form">
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
          <button onClick={routeSignup}>회원가입</button>
        </form>
      </div>
    </div>
  );
}
