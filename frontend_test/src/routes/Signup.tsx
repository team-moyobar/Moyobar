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

enum AlcoholEnum {
  soju = "soju",
  beer = "beer",
  liquor = "liquor",
}

interface IFormInput {
  userId: String;
  email: EmailEnum;
  passWord: String;
  passWordCheck: String;
  userNickName: String;
  birth: Date;
  alcohol: AlcoholEnum;
  amountOfAlcohol: Number;
  phoneNumber: String;
}

export default function Signup() {
  const { register, handleSubmit } = useForm<IFormInput>();
  // const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);
  // const onSubmit: SubmitHandler<IFormInput> = data => {
  //   console.log(data)
  // };
  const onSubmit: SubmitHandler<IFormInput> = data => {
    axios
      .post('https://moyobar.herokuapp.com/api/v1/users', {
        "user_id": `${data.userId}@${data.email}`,
        "nickname": data.userNickName,
        "password": data.passWord,
        "birthday": data.birth,
        "phone": data.phoneNumber,
        "type": "local"
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
    <div style={{
      marginTop : "5rem",
    }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} 
        style={{
          backgroundColor : "silver",
          marginTop : "5rem",
          padding : "5rem",
          marginLeft : "30rem",
          marginRight : "30rem",
        }}
      >
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
        <label>비밀번호확인 : </label>
        <input type="password" {...register("passWordCheck")} />
        <br />
        <label>닉네임 : </label>
        <input {...register("userNickName")} />
        <br />
        <label>생년월일 : </label>
        <DatePicker />
        <input type="datetime" {...register("birth")}/>
        <br />
        <label>주량 : </label>
        <select {...register("alcohol")}>
          <option value="soju">소주</option>
          <option value="beer">맥주</option>
          <option value="liquor">양주</option>
        </select>
        <input {...register("amountOfAlcohol")} />
        <br />
        <label>휴대폰 번호 : </label>
        <input {...register("phoneNumber")} />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}
