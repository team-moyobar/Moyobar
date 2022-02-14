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
  console.log(item);
  let query = (item.room_id % 5) + 1;

  const history = useHistory();

  const [password, setPassword] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState(false);
  const handleOpen = () => {
    if (item.participants.length === item.max) {
      alert("인원이 초과되었습니다.");
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setPasswordErrorMessage(false);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const entranceRoom = () => {
    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };
    var data = {
      password: password,
    };

    axios
      .post(`/rooms/${item.room_id}`, data, config)
      .then((res) => {
        console.log("success");
        console.log(res);
        history.push(`/room/${item.room_id}/${item.owner}`);
        setPasswordErrorMessage(false);
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err.response.data.code);
        if (err.response.data.code === "U003") {
          setPasswordErrorMessage(true);
        }
      });
  };
  const date = item.start.split("T");
  const datetime = date[1].split(".");
  return (
    <div
      className="lobby-room-list-item-info"
      onClick={handleOpen}
      style={{
        backgroundImage: `url(/images/room/${item.theme}.jpg)`,
      }}
    >
      <div className="room-content">
        <p className="lobby-room-title">
          {item.title}
          <span
            className={`lobby-room-count ${
              item.participants.length === item.max ? "room-full" : ""
            }`}
          >
            <span>{item.participants.length}</span>
            <span>/</span>
            <span>{item.max}</span>
          </span>
          {item.participants.length === item.max ? (
            <div className="red-light" />
          ) : (
            <div className="green-light" />
          )}
        </p>
        <div className="room-exp">
          <div className="room-left">
            <p>
              <img
                className="lobby-owner"
                src="/icons/lobby/crown.png"
                alt=""
              />
              {item.owner}
            </p>
            <p className="lobby-room-content">{item.description}</p>
          </div>
          <div className="room-right">
            {item.type === "PRIVATE" ? (
              <div className="room-lock">
                <img src="/icons/lobby/lock.png" alt="" />
              </div>
            ) : null}
            <p className="lobby-room-time">{date[0]}</p>
            <p className="lobby-room-time2">{datetime[0]}</p>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" sx={{ fontSize: 30, mb: 1 }}>
            {item.title}
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 18 }}>
            <img src="/icons/lobby/crown.png" alt="" /> {item.owner}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 4, fontSize: 18 }}
          >
            {item.description}
          </Typography>
          {item.type === "PRIVATE" ? (
            <TextField
              autoFocus
              label="비밀번호"
              fullWidth
              sx={{ height: 80, pb: 3 }}
              variant="standard"
              onChange={handleChangePassword}
              error={passwordErrorMessage === true ? true : false}
              helperText={
                passwordErrorMessage === true
                  ? "올바른 비밀번호를 입력해주세요"
                  : false
              }
            />
          ) : null}
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button onClick={entranceRoom}>
              <img src="/icons/lobby/enter.png" alt="" />
              입장하기
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
