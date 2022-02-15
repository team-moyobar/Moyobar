import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";

import "./InitialResDlg.css";

export interface InitialResDlgProps {
  open: boolean;
  onClose: () => void;
  gameRes: ResultObj[];
}

// 초성게임 결과 인터페이스
export interface ResultObj {
  nickname: string; // 닉네임
  corrcnt: string; // 맞춘횟수
}

export function InitialResDlg(props: InitialResDlgProps) {
  const { open, onClose, gameRes } = props;

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    let timer: number = 0;
    if (open === true) {
      timer = window.setTimeout(() => {
        handleClose();
      }, 7000);
    }

    return () => clearInterval(timer);
  }, [open]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          //backgroundImage: `url("/images/room/cheers.jpg")`,
          backgroundColor: "grey",
          minWidth: "40vh",
          maxWidth: "40vh",
          minHeight: "60vh",
          maxHeight: "60vh",
        },
      }}
    >
      <div className="liarresdlg-container">
        <h2>게임결과</h2>
        <ul>
          {gameRes.map((result) => (
            <li key={result.nickname}>
              {result.nickname} : 맞춘 횟수 {result.corrcnt}
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
