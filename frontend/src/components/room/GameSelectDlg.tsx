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
          //backgroundImage: `url("/images/room/cheers.jpg")`,
          minWidth: "60vh",
          maxWidth: "60vh",
          minHeight: "30vh",
          maxHeight: "30vh",
          backgroundColor: "grey",
        },
      }}
    >
      <DialogTitle>
        <h2>술게임 선택</h2>
      </DialogTitle>
      <div>
        {receiveGameSelect === "None" ? (

          <div>
            <div>
              <Button
                variant="contained"
                onClick={() => handleClickLiar()}
                style={{
                  maxWidth: "180px",
                  maxHeight: "70px",
                  minWidth: "180px",
                  minHeight: "70px",
                  margin: "10px",
                }}
              >
                <h4>라이어 게임</h4>
              </Button>
              <Button
                variant="contained"
                onClick={() => handleClickUpdown()}
                style={{
                  maxWidth: "180px",
                  maxHeight: "70px",
                  minWidth: "180px",
                  minHeight: "70px",
                  margin: "10px",
                }}
              >
                <h4>업다운 게임</h4>
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                onClick={() => handleClickInitial()}
                style={{
                  maxWidth: "180px",
                  maxHeight: "70px",
                  minWidth: "180px",
                  minHeight: "70px",
                  margin: "10px",
                }}
              >
                <h4>초성 게임</h4>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleClickNone()}
            style={{
              maxWidth: "180px",
              maxHeight: "70px",
              minWidth: "180px",
              minHeight: "70px",
              margin: "10px",
            }}
          >
            <h4>게임 종료</h4>
          </Button>
        )}
      </div>
    </Dialog>
  );
}
