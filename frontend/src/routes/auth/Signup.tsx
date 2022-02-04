// import { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import axios from "axios";
// import { useHistory } from "react-router-dom";
import "./Signup.css";

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
  // const history = useHistory();

  // const [id, setId] = useState("");
  // const [nickname, setNickname] = useState("");
  // const [email, setEmail] = useState("naver");

  // const [flagNickname, setCheckNickname] = useState(false);
  // const [flagUserId, setCheckUserId] = useState(false);

  // const setFlagNickname = () => {
  //   setCheckNickname(true);
  // };

  // const setFlagUserId = () => {
  //   setCheckUserId(true);
  // };

  // const changeUserId = (e: any) => {
  //   setId(e.target.value);
  //   setCheckUserId(false);
  // };
  // const changeEmail = (e: any) => {
  //   setEmail(e.target.value);
  //   setCheckUserId(false);
  // };

  // const changeNickname = (e: any) => {
  //   setNickname(e.target.value);
  //   setCheckNickname(false);
  // };
  return (
    <div className="signup-container">
      <div className="signup-left"></div>
      <div className="signup-right"></div>
    </div>
  );
}
