// import React from "react";
// import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
// import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import "./Login.css";

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
      <div id="login-container">
        <div id="left-side">
          <h1>모여바를 설명하는 무언가</h1>
          <p>
            반별 미팅이 있으면 끝난 후 각자 10분간 휴식 후 Webex 참여 지각생
            공개기록 공가 or 결석 시 전날 공지하기 회의 시간은 최대 30분 전날
            작업 사항 건의 사항 도움 요청 사항 오늘의 할일
          </p>
        </div>
        <div id="right-side">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>아이디 : </label>
              <input {...register("userId")} />
              <label>@</label>
              <select {...register("email")}>
                <option value="naver">naver.com</option>
                <option value="gmail">gmail.com</option>
              </select>
              {errors.userId && <p>{errors.userId.message}</p>}
            </div>
            <div>
              <label>비밀번호 : </label>
              <input type="password" {...register("passWord")} />
              {errors.passWord && <p>{errors.passWord.message}</p>}
            </div>
            <input type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
