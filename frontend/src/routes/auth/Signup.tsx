import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Signup.css";
import { useEffect } from "react";
import { getToken } from "./Login";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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
    if (year && birthAnimal === year % 12) {
      alert("?????? ????????? ?????????????????????.");
      setCheckBirth(true);
      setOpenBirthDlg(false);
    } else {
      setCheckBirth(false);
      alert("?????? ????????? ?????????????????????.");
    }
  };

  const checkId = (e: any) => {
    e.preventDefault();
    axios
      .get(`/users/id/${id}@${email}.com`)
      .then((res) => {
        if (res.data) {
          alert("????????? ??? ?????? ????????? ?????????.");
        } else {
          alert("?????? ????????? ??????????????????.");
          setFlagUserId();
        }
      })
      .catch(() => {});
  };

  const checkNickname = (e: any) => {
    e.preventDefault();
    axios
      .get(`/users/nickname/${nickname}`)
      .then((res) => {
        if (res.data) {
          alert("????????? ??? ?????? ??????????????????.");
        } else {
          alert("?????? ????????? ??????????????????.");
          setFlagNickname();
        }
      })
      .catch(() => {});
  };

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (flagUserId) {
      if (flagNickname) {
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
            .then(() => {
              history.push("/login");
            })
            .catch(() => {});
        } else {
          alert("?????? ????????? ????????????.");
        }
      } else {
        alert("????????? ??????????????? ????????????.");
      }
    } else {
      alert("????????? ??????????????? ????????????.");
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
        <p>????????? ???????????? ?????????, MOYOBAR</p>
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
                placeholder="?????????"
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
                <button onClick={checkId}>??????</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/secret.png" alt="" />
            </div>
            <div className="signup-input">
              <input
                placeholder="????????????"
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
                placeholder="???????????? ??????"
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
                placeholder="?????????"
                {...register("userNickName")}
                onChange={changeNickname}
              />
              <div
                className={`signup-duplicate ${
                  nickNameOn ? "nickname-on" : ""
                }`}
              >
                <button onClick={checkNickname}>??????</button>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="signup-icon">
              <img src="/icons/auth/phone.png" alt="" />
            </div>
            <div className="signup-input">
              <input placeholder="???????????? ??????" {...register("phoneNumber")} />
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
                <button onClick={handleOpenBirthDlg}>??????</button>
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
                  ??????
                </option>
                <option value="beer">??????</option>
                <option value="liquor">??????</option>
              </select>
              <input
                id="signup-input"
                placeholder="??????"
                {...register("amountOfAlcohol")}
              />
            </div>
          </div>
          <button className="signup-submit" type="submit">
            ????????????
          </button>
        </form>
        <p className="signup-login" onClick={routeLogin}>
          ??????????????? ????????????
        </p>
      </div>
      <div>
        <Dialog onClose={handleCloseBirthDlg} open={openBirthDlg}>
          <DialogTitle sx={{ color: "black" }}>?????? ??????</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "black" }}>
              ????????? ?????? ??? ??????????
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
                <InputLabel style={{ fontSize: "13px" }}>???</InputLabel>
                <Select
                  autoFocus
                  value={birthAnimal}
                  onChange={changeBirthAnimal}
                  label="???"
                >
                  <MenuItem value={1} selected>
                    ???
                  </MenuItem>
                  <MenuItem value={2}>???</MenuItem>
                  <MenuItem value={3}>??????</MenuItem>
                  <MenuItem value={4}>???</MenuItem>
                  <MenuItem value={5}>???</MenuItem>
                  <MenuItem value={6}>?????????</MenuItem>
                  <MenuItem value={7}>??????</MenuItem>
                  <MenuItem value={8}>???</MenuItem>
                  <MenuItem value={9}>???</MenuItem>
                  <MenuItem value={10}>???</MenuItem>
                  <MenuItem value={11}>???</MenuItem>
                  <MenuItem value={0}>?????????</MenuItem>
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
