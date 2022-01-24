import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

const INITIAL_VALUES = {
  title: "",
  membercount: 2,
  roominfo: "",
  privateroom: false,
  password: "",
};

export default function LobbyCreateRoom() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(INITIAL_VALUES);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues(INITIAL_VALUES)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // console.log(values);
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(values);
    // const formData = new FormData();
    // formData.append('title' , values.title)
    // // formData.append('membercount' , values[membercount])
    // console.log(formData)

    axios
      .post("URL", {
        title: values.title,
        membercount: values.membercount,
        roominfo: values.roominfo,
        privateroom: values.privateroom,
        password: values.password,
      })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log("Fail..");
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
            <input type="checkbox" name="privateroom" checked={values.privateroom} onChange={handleCheckedChange} /> 비공개
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
