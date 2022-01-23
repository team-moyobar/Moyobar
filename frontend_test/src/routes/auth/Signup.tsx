import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";

// 타입 첫글자 대문자에서 소문자로 변경하였습니다.
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
    passWordCheck: yup
      .string()
      .oneOf([yup.ref("passWord")])
      .required(),
    userNickName: yup
      .string()
      .required("필수 입력 항목입니다")
      .min(2, "최소 2글자를 입력해야 합니다")
      .max(10),
    birth: yup
      .date()
      .typeError("숫자로 입력해주세요, 필수 입력 항목입니다")
      .required("필수 입력 항목입니다"),
    amountOfAlcohol: yup
      .number()
      .typeError("숫자로 입력해주세요, 필수 입력 항목입니다")
      .required("필수 입력 항목입니다"),
    phoneNumber: yup.string().required("필수 입력 항목입니다"),
  })
  .required();

export default function Signup() {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("naver");

  const printId = () => {
    console.log(id + "@" + email);
  };
  const printNickname = () => {
    console.log(nickname);
  };

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
      .post("https://moyobar.herokuapp.com/api/v1/users", {
        user_id: `${data.userId}@${data.email}`,
        nickname: data.userNickName,
        password: data.passWord,
        birthday: data.birth,
        phone: data.phoneNumber,
        type: "local",
      })
      .then((res) => {
        console.log("success");
        console.log(res);
        history.push("/login");
        //회원가입 성공시 로그인페이지로 이동
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err);
      });
  };

  return (
    <div
      style={{
        marginTop: "5rem",
      }}
    >
      <h1>회원가입</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          marginTop: "5rem",
          padding: "5rem",
          border: "solid 2px",
        }}
      >
        <div>
          <label>아이디 : </label>
          <input
            {...register("userId")}
            onChange={(e) => setId(e.target.value)}
          />
          <label>@</label>
          <select
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
          >
            <option value="naver">naver.com</option>
            <option value="gmail">gmail.com</option>
          </select>
          {errors.userId && <p>{errors.userId.message}</p>}
          <button onClick={printId}>중복검사</button>
        </div>

        <div>
          <label>비밀번호 : </label>
          <input type="password" {...register("passWord")} />
          {errors.passWord && <p>{errors.passWord.message}</p>}
        </div>
        <div>
          <label>비밀번호확인 : </label>
          <input type="password" {...register("passWordCheck")} />
          {errors.passWordCheck && (
            <p>{"입력한 비밀번호와 일치하지 않습니다"}</p>
          )}
        </div>
        <div>
          <label>닉네임 : </label>
          <input
            {...register("userNickName")}
            onChange={(e) => setNickname(e.target.value)}
          />
          {errors.userNickName && <p>{errors.userNickName.message}</p>}
          <button onClick={printNickname}>중복검사</button>
        </div>

        <div>
          <label>생년월일 : </label>
          <DatePicker />
          <input type="datetime" {...register("birth")} />
          {errors.birth && <p>{errors.birth.message}</p>}
        </div>
        <div>
          <label>주량 : </label>
          <select {...register("alcohol")}>
            <option value="soju">소주</option>
            <option value="beer">맥주</option>
            <option value="liquor">양주</option>
          </select>
          <input {...register("amountOfAlcohol")} />
          {errors.amountOfAlcohol && <p>{errors.amountOfAlcohol.message}</p>}
        </div>
        <div>
          <label>휴대폰 번호 : </label>
          <input {...register("phoneNumber")} />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
