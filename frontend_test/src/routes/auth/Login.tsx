import { useForm, SubmitHandler } from "react-hook-form";
import "antd/dist/antd.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import Cookies from "universal-cookie";
// import KLogin from "../../components/auth/KLogin";
// import GLogin from "../../components/auth/GLogin";

axios.defaults.withCredentials = true;
const cookies = new Cookies();

const setToken = (token: string) => {
  cookies.set("jwtToken", token, {
    path: "/",
  });
};

const setNickname = (nickName: string) => {
  cookies.set("userId", nickName);
};

export const getCookie = (data: any) => {
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

const schema = yup
  .object({
    userId: yup.string().required("필수 입력 항목입니다"),
    passWord: yup
      .string()
      .required("필수 입력 항목입니다")
      .min(9, "최소 9 글자를 입력해야 합니다")
      .max(16, "최대 16 글자까지 입력 가능합니다")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{9,16}$/,
        "비밀번호는 영문, 숫자, 특수문자가 조합되어야합니다"
      ),
  })
  .required();

export default function Login() {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    axios
      .post("/auth/login", {
        user_id: `${data.userId}@${data.email}.com`,
        password: data.passWord,
        type: "LOCAL",
      })
      .then((res) => {
        setToken(res.data.accessToken);
        setNickname(res.data.nickName);
        console.log("Success");
        console.log(res);
        alert("로그인 성공");
        history.push("/lobby");
      })
      .catch((err) => {
        console.log("Fail");
        console.log(err);
        console.log(data);
        alert("로그인 실패");
        history.push("/login");
      });
  };

  return (
    <div className="login-page-container">
      <div className="login-left-side">
        <h1>Welcome To MoyoBar</h1>
      </div>
      <div className="login-right-side">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login-input-button">
            <div className="login-input-button-icon">
              <img
                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png"
                alt="email-icon"
              />
            </div>
            <div className="login-input">
              <input placeholder="이메일" {...register("userId")} />
              <select className="login-select" {...register("email")}>
                <option value="naver">naver.com</option>
                <option value="gmail">gmail.com</option>
              </select>
            </div>
          </div>
          {errors.userId && <p>{errors.userId.message}</p>}
          <div className="login-input-button">
            <div className="login-input-button-icon">
              <img
                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png"
                alt="password-icon"
              />
            </div>
            <div className="login-input">
              <input
                placeholder="비밀번호"
                type="password"
                {...register("passWord")}
              />
            </div>
          </div>
          {errors.passWord && <p>{errors.passWord.message}</p>}
          <button className="login-submit-button" type="submit">
            로그인
          </button>
        </form>
        <button className="login-kakao-button">
          <img
            className="login-kakao-img"
            src="/assets/images/kakao.png"
            alt="kakao-icon"
          />
          Kakao 로그인
        </button>
        <button className="login-google-button">
          <img
            className="login-google-img"
            src="/assets/images/google.png"
            alt="google-icon"
          />
          Google 로그인
        </button>
      </div>
    </div>
  );
}
