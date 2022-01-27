import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";
import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import "./Signup.css";
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

  // 닉네임 중복검사 여부를 확인하는 flagNickname 변수 생성 및 useState에 초기값 false로 저장
  // 값을 변화할 핸들러 setCheckNickname 사용을 위한 생성
  // 아이디도 마찬가지로 생성
  const [flagNickname, setCheckNickname] = useState(false);
  const [flagUserId, setCheckUserId] = useState(false);

  // 중복검사를 통과했을 때 값을 true로 바꾸어줄 setFlagNickname 생성
  const setFlagNickname = () => {
    setCheckNickname(true);
  };

  const setFlagUserId = () => {
    setCheckUserId(true);
  };

  // 아이디 값 or 이메일 값이 변할 때, flagUserId 값 false로 초기화 및 변한 값 적용
  const changeUserId = (e: any) => {
    setId(e.target.value);
    setCheckUserId(false);
  };
  const changeEmail = (e: any) => {
    setEmail(e.target.value);
    setCheckUserId(false);
  };

  // 닉네임 값 변할 때, flagNickname 값 false로 초기화 및 변한 값 적용
  const changeNickname = (e: any) => {
    setNickname(e.target.value);
    setCheckNickname(false);
  };

  const checkId = (e: any) => {
    e.preventDefault();
    console.log(`${id}@${email}.com`);
    axios
      .get(`https://moyobar.herokuapp.com/api/v1/users/id/${id}@${email}.com`)
      .then((res) => {
        console.log("아이디 중복체크 성공?");
        if (res.data) {
          alert("사용할 수 없는 아이디 입니다.");
        } else {
          alert("사용 가능한 아이디입니다.");
          setFlagUserId();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkNickname = (e: any) => {
    e.preventDefault();
    console.log(`${nickname}`);
    axios
      .get(`https://moyobar.herokuapp.com/api/v1/users/nickname/${nickname}`)
      .then((res) => {
        console.log("닉네임 중복체크 성공?");
        if (res.data) {
          alert("사용할 수 없는 닉네임입니다.");
        } else {
          alert("사용 가능한 닉네임입니다.");
          setFlagNickname();
        }
      })
      .catch((err) => {
        console.log("서버와 통신오류.. 잠시 뒤 다시 실행해주세요");
        console.log(err);
      });
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
    if (flagUserId) {
      console.log(`flagUserId : ${flagUserId}`);
      if (flagNickname) {
        console.log(`flagNickname : ${flagNickname}`);
        axios
          .post("https://moyobar.herokuapp.com/api/v1/users", {
            user_id: `${data.userId}@${data.email}.com`,
            drink: {
              soju: 3,
            },
            nickname: data.userNickName,
            password: data.passWord,
            birthday: data.birth,
            phone: data.phoneNumber,
            type: "LOCAL",
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
      } else {
        alert("닉네임 중복검사 해주세요");
      }
    } else {
      alert("아이디 중복검사 해주세요");
    }
  };

  return (
    <div id="signup-page-container">
      <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
          </div>
          <div id="signup-input-container">
            <input
              id="signup-input"
              placeholder="이메일"
              {...register("userId")}
              onChange={changeUserId}
            />
            @
            <select {...register("email")} onChange={changeEmail}>
              <option value="naver">naver.com</option>
              <option value="gmail">gmail.com</option>
            </select>
            <div id="nick">
              <button id="signup-input" onClick={checkId}>
                중복검사
              </button>
            </div>
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
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          </div>
          <div id="signup-input-container">
            <input
              id="signup-input"
              placeholder="비밀번호 확인"
              type="password"
              {...register("passWordCheck")}
            />
          </div>
        </div>
        {errors.passWordCheck && <p>{"입력한 비밀번호와 일치하지 않습니다"}</p>}
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          </div>
          <div id="signup-input-container">
            <input
              id="signup-input"
              placeholder="닉네임"
              {...register("userNickName")}
              onChange={changeNickname}
            />
            <div id="nick">
              <button id="signup-input" onClick={checkNickname}>
                중복검사
              </button>
            </div>
          </div>
        </div>
        {errors.userNickName && <p>{errors.userNickName.message}</p>}
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          </div>
          <div id="signup-input-container">
            <input
              id="signup-input"
              placeholder="휴대전화 번호"
              {...register("phoneNumber")}
            />
          </div>
        </div>
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          </div>
          <div id="signup-input-container">
          
          <input type="datetime" id="signup-input" placeholder="생년월일" {...register("birth")} />
          <DatePicker />
          </div>
        </div>
        {errors.birth && <p>{errors.birth.message}</p>}
        <div id="password">
          <div id="password-icon">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          </div>
          <div id="signup-input-container">
          <select {...register("alcohol")}>
            <option value="soju" selected>소주</option>
            <option value="beer">맥주</option>
            <option value="liquor">양주</option>
          </select>
          <input id="signup-input" {...register("amountOfAlcohol")} />
          </div>
        </div>
        {errors.amountOfAlcohol && <p>{errors.amountOfAlcohol.message}</p>}
        <button id="submit-button" type="submit">회원가입</button>
      </form>
    </div>
  );
}
