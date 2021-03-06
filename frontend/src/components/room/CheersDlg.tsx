import React, { useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import "./CheersDlg.css";

export interface CheersDlgProps {
  open: boolean;
  onClose: () => void;
  callUser: string;
}

const isFullWidth: boolean = true;

export function CheersDlg(props: CheersDlgProps) {
  const { open, onClose, callUser } = props;

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
      fullWidth={isFullWidth}
      PaperProps={{
        style: {
          backgroundImage: `url("/images/room/cheers.jpg")`,
          minWidth: "100vh",
          maxWidth: "100vh",
          minHeight: "60vh",
          maxHeight: "60vh",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <DialogTitle>
        <p className="cheers-text">
          <span>{callUser}</span> 님의 건배 제의 🥂
        </p>
      </DialogTitle>
    </Dialog>
  );
}
