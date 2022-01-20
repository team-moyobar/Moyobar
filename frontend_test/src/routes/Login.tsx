import React from "react";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import axios from 'axios';


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
  const { register, handleSubmit, formState: {errors} } = useForm<IFormInput>({
    resolver: yupResolver(schema)
  });
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
  );
}
