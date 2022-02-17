import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";

import "./LiarResDlg.css";

export interface LiarResDlgProps {
  open: boolean;
  onClose: () => void;
  liar: string;
  voteRes: voteResultObj[];
  winner: string;
}

export interface gameResultObj {
  liar: string;
  voteresult: voteResultObj[];
  winner: string;
}

export interface voteResultObj {
  nickname: string;
  votecnt: string;
}

export function LiarResDlg(props: LiarResDlgProps) {
  const { open, onClose, liar, voteRes, winner } = props;

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
          backgroundColor: "rgba(34, 34, 34, 0.8)",
          minWidth: "40vh",
          maxWidth: "40vh",
          minHeight: "60vh",
          maxHeight: "60vh",
        },
      }}
    >
      <div className="liarresdlg-container">
        <h2>게임결과</h2>
        <div>
          <h3>
            라이어 : <span className="liar-res-hero">{liar}</span>
          </h3>
        </div>
        <h2>투표결과</h2>
        <ul>
          {voteRes.map((voteres) => (
            <li key={voteres.nickname}>
              {voteres.nickname} : {voteres.votecnt} 표
            </li>
          ))}
        </ul>
        {winner === "liar" && (
          <h1 className="liar-res-bottom">
            라이어 <span>승리!</span>
          </h1>
        )}
        {winner !== "liar" && (
          <h1 className="liar-res-bottom">
            라이어 <span>패배!</span>
          </h1>
        )}
      </div>
    </Dialog>
  );
}
