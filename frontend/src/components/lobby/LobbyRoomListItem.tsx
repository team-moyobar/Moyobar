import React from "react";
import { useHistory } from "react-router-dom";
import "./LobbyRoomListItem.css";
import axios from "axios";
import { getToken } from "../../routes/auth/Login";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

interface PrivateProps {
  roomStatus: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function LobbyRoomListItem({ item }: any) {
  let query = (item.room_id % 5) + 1;

  const history = useHistory();

  const [password, setPassword] = React.useState('');

  const [open, setOpen] = React.useState(false); 
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setPasswordErrorMessage(false)
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const entranceRoom = () => {
    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };
    var data = {
      password: password
    }

    axios
      .post(`/rooms/${item.room_id}`, data, config)
      .then((res) => {
        console.log("success");
        console.log(res);
        history.push(`/room/${item.room_id}`)
        setPasswordErrorMessage(false)
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err.response.data.code);
        if(err.response.data.code == 'U003') {
          setPasswordErrorMessage(true)
        }
      })
  };


  return (
    <div
      // style={{
      //   backgroundImage: `url(/assets/images/theme${item.theme}.png)`,
      // }}
      className="lobby-room-list-item-info"
    >
      <div className="room-thumbnail">
        <img src="/images/bg3.jpg" alt="" />
      </div>
      <div className="room-content">
        {item.title ? <h4>{item.title}</h4> : <h4>무제</h4>}
        <p>
          인원 : <span>{item.participants.length}</span>
          <span>/</span>
          <span>{item.max}</span>
        </p>
        <p>
          {item.description} {item.start}
        </p>

        {item.type === "PRIVATE" ? <p>비공개방</p> : <p>공개방</p>}
      </div>
      <Button onClick={handleOpen} variant="contained" color="secondary">
        방 입장
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Title : {item.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Owner : {item.owner}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {item.description}
          </Typography>
          {item.type === "PRIVATE" ? 
            <TextField 
              autoFocus
              margin="dense"
              label="비밀번호"
              fullWidth
              variant="standard"
              onChange={handleChangePassword}
              error={ passwordErrorMessage == true ? true : false}
              helperText={ passwordErrorMessage == true ? "올바른 비밀번호를 입력해주세요" : false}
            /> : null}
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button onClick={entranceRoom}>입장하기</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
