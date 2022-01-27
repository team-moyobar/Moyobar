// import React from "react";
// import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
// import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import "./Login.css";
import KLogin from "../../components/auth/KLogin";
import GLogin from "../../components/auth/GLogin";
import axios from "axios";

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
  // const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);
  // const onSubmit: SubmitHandler<IFormInput> = data => {
  //   console.log(data)
  // };
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    axios
      .post("https://moyobar.herokuapp.com/api/v1/auth/login", {
        user_id: `${data.userId}@${data.email}.com`,
        password: data.passWord,
        type: "LOCAL",
      })
      .then((res) => {
        console.log("success");
        console.log(res);
        console.log(data);
        alert("로그인 성공");
        history.push("/lobby");
        //로그인 성공시 home화면으로 이동
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err);
        console.log(data);
        alert("로그인 실패");
      });
  };

  return (
    <div id="login-page-container">
      <div id="left-side">
        <h1>Welcome To MoyoBar</h1>
      </div>
      <div id="login-container">
        <div id="right-side">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id="password">
              <div id="password-icon">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
              </div>
              <div id="signup-input-container">
                <input
                  id="signup-input"
                  placeholder="이메일"
                  {...register("userId")}
                />
                <select id="login-select" {...register("email")}>
                  <option value="naver">naver.com</option>
                  <option value="gmail">gmail.com</option>
                </select>
              </div>
            </div>
            {errors.userId && <p>{errors.userId.message}</p>}
            <div id="password">
              <div id="password-icon">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
              </div>
              <div id="signup-input-container">
                <input
                  id="signup-input"
                  placeholder="비밀번호"
                  type="password"
                  {...register("passWord")}
                />
              </div>
            </div>
            {errors.passWord && <p>{errors.passWord.message}</p>}
            <button id="submit-button" type="submit">
              로그인
            </button>
          </form>
          <hr id="login-hr" />

          <button className="kakao-login">KAKAO 로그인</button>
          <button className="google-login">GOOGLE 로그인</button>
          {/* <KLogin/>
          <GLogin/> */}
        </div>
      </div>
    </div>
  );
}
