import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import "./GameSelectDlg.css";

export interface GameSelectDlgProps {
  mySession: any;
  receiveGameSelect: string;
  open: boolean;
  onClose: () => void;
}

export function GameSelectDlg(props: GameSelectDlgProps) {
  const { open, onClose, receiveGameSelect } = props;

  const handleClose = () => {
    onClose();
  };

  const handleClickLiar = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Liar",
      to: [],
      type: "selgame",
    });

    onClose();
  };

  const handleClickUpdown = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Updown",
      to: [],
      type: "selgame",
    });

    onClose();
  };

  const handleClickInitial = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Initial",
      to: [],
      type: "selgame",
    });

    onClose();
  };

  const handleClickNone = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "None",
      to: [],
      type: "selgame",
    });

    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      //fullWidth={isFullWidth}
      PaperProps={{
        style: {
          background: "rgba(151, 151, 151, 0.95)",
          minWidth: "60vh",
          maxWidth: "60vh",
          minHeight: "50vh",
          maxHeight: "50vh",
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle>
        <h2 className="sg-title">🎮 게임을 선택해주세요!!</h2>
      </DialogTitle>
      {receiveGameSelect === "None" ? (
        <div className="sg-container">
          <div onClick={() => handleClickLiar()}>
            {" "}
            <p className="sg-text">라이어 게임</p>
          </div>
          <div onClick={() => handleClickUpdown()}>
            {" "}
            <p className="sg-text">업다운 게임</p>
          </div>
          <div onClick={() => handleClickInitial()}>
            {" "}
            <p className="sg-text">초성 퀴즈</p>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
