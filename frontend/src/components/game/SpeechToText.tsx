import React, { useEffect } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";

export interface SimpleDialogProps {
  open: boolean;
  consonant: string;
  onClose: (value: string) => void;
}

const isFullWidth: boolean = true;

export default function SpeechToText(props: SimpleDialogProps) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const { onClose, open, consonant } = props;
  const [answer, setAnswer] = React.useState("");

  useEffect(() => {
    if (open === true) {
      setAnswer("");

      if (isRecording == false) {
        startSpeechToText();
      }
    } else {
      if (isRecording == true) {
        stopSpeechToText();
      }
    }
  }, [open]);

  useEffect(() => {
    handleStt();
  }, [interimResult]);

  useEffect(() => {
    handleStt();
  }, [results.length]);

  const handleStt = () => {
    if (interimResult === undefined && results.length === 0) {
      setAnswer("");
    } else if (interimResult && results.length === 0) {
      setAnswer(interimResult);
    } else if (interimResult === undefined && results.length > 0) {
      setAnswer((results as ResultType[])[results.length - 1].transcript);
    }
  };

  const handleClose = () => {
    onClose(answer);
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={isFullWidth}
      PaperProps={{
        style: {
          background: "rgba(151, 151, 151, 0.95)",
          minHeight: "30vh",
          maxHeight: "30vh",
          borderRadius: "15px",
        },
      }}
    >
      <div className="liar-role-msg-dlg-role">
        <h2>정답을 말하세요</h2>

        <h3>제시어 : {consonant}</h3>

        <TextField value={answer}></TextField>
        <div className="stt-submit">
          <p onClick={() => handleClose()}>정답 제출하기</p>
        </div>
      </div>
    </Dialog>
  );
}
