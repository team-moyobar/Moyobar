import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { getCookie } from "../../routes/auth/Login";
import LobbyCreateRoomTheme from "./LobbyCreateRoomTheme";

const INITIAL_VALUES = {
  title: "",
  membercount: 2,
  roominfo: "",
  privateroom: false,
  password: "",
  theme: 1,
};

export default function LobbyCreateRoom() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(INITIAL_VALUES);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues(INITIAL_VALUES);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target)
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
      password: "",
    }));
    // console.log(values);
  };

  const handleThemeChange = (value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      theme : value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append('title' , values.title)
    // // formData.append('membercount' , values[membercount])
    // console.log(formData)

    const TOKEN = getCookie("jwtToken");
    console.log(TOKEN)
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    var userData = {
      title: values.title,
      max: values.membercount,
      description: values.roominfo,
      thumbnail: "string",
      theme: values.theme,
      type: "PRIVATE",
      password: values.password,
    };

    axios
      .post("/rooms", userData, config)
      .then((res) => {
        console.log("success");
        console.log(res);
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err);
      })
      .finally(() => {
        handleClose();
        setValues(INITIAL_VALUES);
      });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        방 만들기
      </Button>
      <Dialog open={open} onClose={handleClose} onSubmit={handleSubmit}>
        <DialogTitle>방 만들기</DialogTitle>
        <DialogContent>
          <DialogContentText>
            술자리를 위한 새로운 방을 만들어 주세요
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="방이름"
            fullWidth
            variant="standard"
            name="title"
            value={values.title}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="인원수"
            type="number"
            fullWidth
            variant="standard"
            name="membercount"
            value={values.membercount}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 2, max: 8 } }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="방소개"
            fullWidth
            variant="standard"
            multiline
            rows={2}
            name="roominfo"
            value={values.roominfo}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
          />
          <p>공개여부</p>
          <label>
            <input
              type="checkbox"
              name="privateroom"
              checked={values.privateroom}
              onChange={handleCheckedChange}
            />{" "}
            비공개
          </label>
          <TextField
            disabled={!values.privateroom}
            autoFocus
            margin="dense"
            id="name"
            label="비밀번호"
            fullWidth
            variant="standard"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <LobbyCreateRoomTheme onChange={handleThemeChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} type="submit">
            생성하기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
