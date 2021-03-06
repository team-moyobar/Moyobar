import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import { getToken } from "../../routes/auth/Login";
import LobbyCreateRoomTheme from "./LobbyCreateRoomTheme";
import { useHistory } from "react-router-dom";
import "./LobbyCreateRoom.css";

const INITIAL_VALUES = {
  title: "",
  membercount: 2,
  roominfo: "",
  privateroom: "PUBLIC",
  password: "",
  theme: 1,
};

export default function LobbyCreateRoom() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [cnt, setCnt] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState(false);
  const [passwordCnt, setPasswordCnt] = React.useState(false);

  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues(INITIAL_VALUES);
    setErrorMessage(false);
    setCnt(false);
    setPasswordErrorMessage(false);
    setPasswordCnt(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === "title") {
      setErrorMessage(false);
    }
    if (name === "password") {
      setPasswordErrorMessage(false);
    }
  };

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    let isPrivate: any;
    {
      checked === true ? (isPrivate = "PRIVATE") : (isPrivate = "PUBLIC");
    }
    setValues((prevValues) => ({
      ...prevValues,
      [name]: isPrivate,
      password: "",
    }));
  };

  const handleThemeChange = (value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      theme: value,
    }));
  };

  var passwordDisabled;
  {
    values.privateroom === "PRIVATE"
      ? (passwordDisabled = false)
      : (passwordDisabled = true);
  }

  const intoRoom = (e: any) => {
    const TOKEN = getToken("jwtToken");
    const owner = getToken("nickname");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    var userData = {
      password: values.password,
    };

    axios
      .post(`rooms/${e.room_id}`, userData, config)
      .then((res) => {
        history.push({
          pathname: `/room/${res.data.room_id}/${owner}`,
          state: { roomInfo: res.data },
        });
      })
      .catch(() => {});
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      values.title === "" ||
      (values.privateroom == "PRIVATE" && values.password === "")
    ) {
      if (values.title === "") {
        setErrorMessage(true);
        setCnt(true);
      }
      if (values.privateroom === "PRIVATE" && values.password === "") {
        setPasswordErrorMessage(true);
        setPasswordCnt(true);
      }
    } else {
      const TOKEN = getToken("jwtToken");
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
        type: values.privateroom,
        password: values.password,
      };

      axios
        .post("/rooms", userData, config)
        .then((res) => {
          intoRoom(res.data);
        })
        .catch(() => {})
        .finally(() => {
          handleClose();
          setValues(INITIAL_VALUES);
        });
    }
  };

  React.useEffect(() => {
    if (cnt === true && values.title === "") {
      setErrorMessage(true);
    }
    if (passwordCnt === true && values.password === "") {
      setPasswordErrorMessage(true);
    }
    if (passwordCnt === true && values.privateroom === "PUBLIC") {
      setPasswordErrorMessage(false);
      setPasswordCnt(false);
    }
  }, [values.title, values.password, values.privateroom]);

  return (
    <div className="create-button-container">
      <Button
        className="create-button"
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        <p>??? ??????</p>
      </Button>
      <Dialog open={open} onClose={handleClose} onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText className="create-button-container-title">
            create room
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="?????????"
            fullWidth
            variant="standard"
            name="title"
            value={values.title}
            onChange={handleChange}
            color="primary"
            error={errorMessage === true ? true : false}
            helperText={errorMessage === true ? "???????????? ??????????????????" : false}
          />
          <TextField
            margin="dense"
            id="name"
            label="?????????"
            type="number"
            fullWidth
            variant="standard"
            name="membercount"
            value={values.membercount}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 2, max: 8 } }}
            color="primary"
          />
          <TextField
            margin="dense"
            id="name"
            label="?????????"
            fullWidth
            variant="standard"
            multiline
            rows={2}
            name="roominfo"
            value={values.roominfo}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
            color="primary"
          />
          <div className="private-room">
            <label className="create-private">
              <input
                type="checkbox"
                name="privateroom"
                onChange={handleCheckedChange}
                color="primary"
              />
              ?????????
            </label>
            <TextField
              disabled={passwordDisabled}
              fullWidth
              margin="dense"
              id="name"
              label="????????????"
              variant="standard"
              name="password"
              value={values.password}
              onChange={handleChange}
              color="primary"
              error={passwordErrorMessage === true ? true : false}
              helperText={
                passwordErrorMessage === true
                  ? "??????????????? ??????????????????"
                  : false
              }
            />
          </div>
          <LobbyCreateRoomTheme onChange={handleThemeChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} type="submit" color="primary">
            <p className="create-button-text">????????????</p>
          </Button>
          <Button onClick={handleClose} color="primary">
            <p className="create-button-text">??????</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
