import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";

import "./UpdownResDlg.css";

export interface UpdownResDlgProps {
  open: boolean;
  onClose: () => void;
  username: string;
  answer: string;
}

export function UpdownResDlg(props: UpdownResDlgProps) {
  const { open, onClose, username, answer } = props;

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
          backgroundColor: "grey",
          minWidth: "60vh",
          maxWidth: "60vh",
          minHeight: "30vh",
          maxHeight: "30vh",
        },
      }}
    >
      <div className="updownresdlg-container">
        <h2>게임결과</h2>
        <h4>
          {username}님이 {answer}를 입력해 맞았습니다!
        </h4>
      </div>
    </Dialog>
  );
}
