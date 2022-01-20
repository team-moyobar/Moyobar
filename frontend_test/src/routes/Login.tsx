import React from "react";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";

import axios from 'axios';


enum EmailEnum {
  naver = "naver",
  gmail = "gmail",
}

interface IFormInput {
  userId: String;
  email: EmailEnum;
  passWord: String;
}

export default function Login() {
  const { register, handleSubmit } = useForm<IFormInput>();
  // const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);
  // const onSubmit: SubmitHandler<IFormInput> = data => {
  //   console.log(data)
  // };
  const onSubmit: SubmitHandler<IFormInput> = data => {
    axios
      .post('https://moyobar.herokuapp.com/api/v1/auth/login', {
        "user_id": `${data.userId}@${data.email}`,
        "password": data.passWord,
        "type": "local",
      })
      .then((res) => {
        console.log("success")
        console.log(res)
      })
      .catch((err) => {
        console.log("Fail..")
        console.log(err)
      })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>아이디 : </label>
      <input {...register("userId")} />
      <label>@</label>
      <select {...register("email")}>
        <option value="naver">naver.com</option>
        <option value="gmail">gmail.com</option>
      </select>
      <br />
      <label>비밀번호 : </label>
      <input type="password" {...register("passWord")} />
      <br />
      <input type="submit" />
    </form>
  );
}
