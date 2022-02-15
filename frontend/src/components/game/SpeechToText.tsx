import React, { useEffect } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";

import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
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
  const [answer, setAnswer] = React.useState(""); // 정답

  useEffect(() => {
    if (open === true) {
      setAnswer(""); // 정답 초기화

      if (isRecording == false) {
        startSpeechToText();
      } // STT 라이브러리 시작
    } else {
      if (isRecording == true) {
        stopSpeechToText(); // STT 라이브러리 종료
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
      setAnswer(""); // STT 실행 전
    } else if (interimResult && results.length === 0) {
      setAnswer(interimResult); // STT 번역 중
    } else if (interimResult === undefined && results.length > 0) {
      setAnswer((results as ResultType[])[results.length - 1].transcript); // STT 번역 완료 and 음성인식 결과물이 존재하면
    }
  };

  const handleClose = () => {
    onClose(answer);
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={isFullWidth}>
      <div className="liar-role-msg-dlg-role">
        <h3>음성인식</h3>
      </div>
      <div className="liar-role-msg-dlg-role">
        <h4>제시어 : {consonant}</h4>
      </div>
      <TextField
        label="정답을 말하고 닫기를 누르세요"
        value={answer}
      ></TextField>
      <Button onClick={() => handleClose()}>닫기</Button>
    </Dialog>
  );
}
