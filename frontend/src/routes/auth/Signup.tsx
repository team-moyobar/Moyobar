import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Signup.css";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { AnyIfEmpty, useSelector } from "react-redux";
import { getToken } from "./Login";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DialogActions from "@mui/material/DialogActions";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

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
  const history = useHistory();

  function routeLogin() {
    history.push("/login");
  }
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("naver");
  const [birth, setBirth] = useState<Date | null>(new Date());

  const [flagNickname, setCheckNickname] = useState(false);
  const [flagUserId, setCheckUserId] = useState(false);
  const [flagBirth, setCheckBirth] = useState(false);

  const [emailOn, setemailOn] = useState<boolean>(false);
  const [nickNameOn, setnickNameOn] = useState<boolean>(false);
  const [birthOn, setBirthOn] = useState<boolean>(false);

  const [openBirthDlg, setOpenBirthDlg] = useState(false);
  const [birthAnimal, setBirthAnimal] = useState<number>(1);

  const setFlagNickname = () => {
    setCheckNickname(true);
  };

  const setFlagUserId = () => {
    setCheckUserId(true);
  };

  const changeUserId = (e: any) => {
    setemailOn(true);
    setId(e.target.value);
    setCheckUserId(false);
  };

  const changeEmail = (e: any) => {
    setEmail(e.target.value);
    setCheckUserId(false);
  };

  const changeNickname = (e: any) => {
    setnickNameOn(true);
    setNickname(e.target.value);
    setCheckNickname(false);
  };

  const handleOpenBirthDlg = (e: any) => {
    e.preventDefault();
    setOpenBirthDlg(true);
  };

  const handleCloseBirthDlg = () => {
    setOpenBirthDlg(false);
  };

  const changeBirthAnimal = (e: any) => {
    setBirthAnimal(e.target.value);
  };

  const checkBirth = () => {
    var year = birth?.getFullYear();
    console.log(birth);
    if (year && birthAnimal === year % 12) {
      setCheckBirth(true);
    } else {
      setCheckBirth(false);
    }
  };

  const checkId = (e: any) => {
    e.preventDefault();
    axios
      .get(`/users/id/${id}@${email}.com`)
      .then((res) => {
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
      .get(`/users/nickname/${nickname}`)
      .then((res) => {
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

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (flagUserId) {
      console.log(`flagUserId : ${flagUserId}`);
      if (flagNickname) {
        console.log(`flagNickname : ${flagNickname}`);
        if (flagBirth) {
          axios
            .post("/users", {
              user_id: `${data.userId}@${data.email}.com`,
              drink: {
                soju: 3,
              },
              nickname: data.userNickName,
              password: data.passWord,
              birthday: birth,
              phone: data.phoneNumber,
              type: "LOCAL",
            })
            .then((res) => {
              console.log("success");
              console.log(res);
              history.push("/login");
            })
            .catch((err) => {
              console.log("Fail..");
              console.log(err);
            });
        } else {
          alert("생년월일 인증 해주세요");
        }
      } else {
        alert("닉네임 중복검사 해주세요");
      }
    } else {
      alert("아이디 중복검사 해주세요");
    }
  };

  useEffect(() => {
    if (getToken("jwtToken")) {
      history.push("/lobby");
    }
  }, []);

  return (
    <div className="signup-container">
      <div className="signup-left">
        <p>당신의 술자리를 새롭게, MOYOBAR</p>
      </div>
      <div className="signup-right">
        <p className="signup">SIGNUP</p>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/email.png" alt="" />
            </div>
            <div className="signup-radius signup-border">
              <input
                placeholder="이메일"
                {...register("userId")}
                onChange={changeUserId}
              />
              <select
                className="signup-select"
                {...register("email")}
                onChange={changeEmail}
              >
                <option selected value="naver">
                  naver.com
                </option>
                <option value="gmail">gmail.com</option>
              </select>
              <div className={`signup-duplicate ${emailOn ? "email-on" : ""}`}>
                <button onClick={checkId}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="signup-input">
              <input
                placeholder="비밀번호"
                type="password"
                {...register("passWord")}
              />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="signup-input">
              <input
                placeholder="비밀번호 확인"
                type="password"
                {...register("passWordCheck")}
              />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/nickname.png" alt="" />
            </div>
            <div className="signup-radius">
              <input
                placeholder="닉네임"
                {...register("userNickName")}
                onChange={changeNickname}
              />
              <div
                className={`signup-duplicate ${
                  nickNameOn ? "nickname-on" : ""
                }`}
              >
                <button onClick={checkNickname}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/phone.png" alt="" />
            </div>
            <div className="signup-input">
              <input placeholder="휴대전화 번호" {...register("phoneNumber")} />
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/calendar.png" alt="" />
            </div>
            <div className="input-date">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={birth}
                  onChange={(newValue) => {
                    setBirthOn(true);
                    setCheckBirth(false);
                    setBirth(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div className={`signup-duplicate ${birthOn ? "birth-on" : ""}`}>
                <button onClick={handleOpenBirthDlg}>확인</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/alcohol.png" alt="" />
            </div>
            <div className="signup-input signup-border-al">
              <select className="signup-select-al" {...register("alcohol")}>
                <option value="soju" selected>
                  소주
                </option>
                <option value="beer">맥주</option>
                <option value="liquor">양주</option>
              </select>
              <input
                id="signup-input"
                placeholder="주량"
                {...register("amountOfAlcohol")}
              />
            </div>
          </div>
          <button className="signup-submit" type="submit">
            회원가입
          </button>
        </form>
        <p className="signup-login" onClick={routeLogin}>
          로그인으로 돌아가기
        </p>
      </div>
      <div>
        <Dialog onClose={handleCloseBirthDlg} open={openBirthDlg}>
          <DialogTitle sx={{ color: "black" }}>성인 인증</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "black" }}>
              당신은 무슨 띠 인가요?
            </DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                m: "auto",
                width: "fit-content",
              }}
            >
              <FormControl sx={{ mt: 2, minWidth: 120 }}>
                <InputLabel>띠</InputLabel>
                <Select
                  autoFocus
                  value={birthAnimal}
                  onChange={changeBirthAnimal}
                  label="띠"
                >
                  <MenuItem value={1} selected>
                    닭
                  </MenuItem>
                  <MenuItem value={2}>개</MenuItem>
                  <MenuItem value={3}>돼지</MenuItem>
                  <MenuItem value={4}>쥐</MenuItem>
                  <MenuItem value={5}>소</MenuItem>
                  <MenuItem value={6}>호랑이</MenuItem>
                  <MenuItem value={7}>토끼</MenuItem>
                  <MenuItem value={8}>용</MenuItem>
                  <MenuItem value={9}>뱀</MenuItem>
                  <MenuItem value={10}>말</MenuItem>
                  <MenuItem value={11}>양</MenuItem>
                  <MenuItem value={0}>원숭이</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={checkBirth}>Check</Button>
            <Button onClick={handleCloseBirthDlg}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
