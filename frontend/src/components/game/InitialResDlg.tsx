import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";

import "./InitialResDlg.css";

export interface InitialResDlgProps {
  open: boolean;
  onClose: () => void;
  gameRes: ResultObj[];
}

export interface ResultObj {
  nickname: string;
  corrcnt: string;
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
          backgroundColor: "rgba(34, 34, 34, 0.8)",
          minWidth: "50vh",
          maxWidth: "50vh",
          minHeight: "60vh",
          maxHeight: "60vh",
        },
      }}
    >
      <div className="liarresdlg-container init-contain">
        <h2>게임결과</h2>
        <ul>
          {gameRes.map((result) => (
            <li key={result.nickname}>
              <span className="init-nick">{result.nickname}</span> : 맞춘 횟수{" "}
              <span className="init-res-count">{result.corrcnt}</span>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
