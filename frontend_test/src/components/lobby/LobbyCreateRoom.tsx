import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

const INITIAL_VALUES = {
  roomName : '',
  roomMemberCount : 2,
}

export default function LobbyCreateRoom() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(INITIAL_VALUES)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name] : value,
    }))
    console.log(values)
  }

  const handleSubmit = (e: any) => { 
    e.preventDefault();
    console.log(values)
    // const formData = new FormData();
    // formData.append('roomName' , values.roomName)
    // // formData.append('roomMemberCount' , values[roomMemberCount])
    // console.log(formData)
    console.log({
      roomName : values.roomName,
      roomMemberCount : values.roomMemberCount
    })

    axios
      .post("URL", {
        roomName : values.roomName,
        roomMemberCount : values.roomMemberCount
      })
      .then((res) => {
        console.log("success")
      })
      .catch((err) =>{
        console.log("Fail..")
      })
      .finally(() => {
        handleClose()
        setValues(INITIAL_VALUES)
      })



  }

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
            name="roomName"
            value={values.roomName}
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
            name="roomMemberCount"
            value={values.roomMemberCount}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 2, max: 8 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} type="submit">생성하기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
