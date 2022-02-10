import React from "react";
import StompLiar from "../game/Liar";
import StompUpdown from "../game/Updown";
import StompInitial from "../game/Initial";
import { useState } from "react";
import Button from "@mui/material/Button";

const GameSelect = () => {
  const [gameSelected, setGameSelected] = useState(false);
  const [liar, setLiar] = useState(false);
  const [upDown, setUpDown] = useState(false);
  const [initial, setInitial] = useState(false);

  const handleLiar = () => {
    setLiar(true);
    setGameSelected(true);
  };
  const handleUpDown = () => {
    setUpDown(true);
    setGameSelected(true);
  };
  const handleInitial = () => {
    setInitial(true);
    setGameSelected(true);
  };
  const handleGameChange = () => {
    setGameSelected(false);
    setUpDown(false);
    setLiar(false);
    setInitial(false);
  };

  return (
    <div>
      {gameSelected == false ? (
        <div>
          <p>게임을 골라주세요</p>
          <Button variant="contained" onClick={handleLiar}>
            라이어게임
          </Button>
          <Button variant="contained" onClick={handleUpDown}>
            업다운게임
          </Button>
          <Button variant="contained" onClick={handleInitial}>
            초성게임
          </Button>
        </div>
      ) : null}
      {liar == true ? (
        <div>
          <StompLiar></StompLiar>
          <Button variant="contained" color="error" onClick={handleGameChange}>
            다른 게임 선택하기
          </Button>
        </div>
      ) : null}
      {upDown == true ? (
        <div>
          <StompUpdown></StompUpdown>
          <Button variant="contained" color="error" onClick={handleGameChange}>
            다른 게임 선택하기
          </Button>
        </div>
      ) : null}
      {initial == true ? (
        <div>
          <StompInitial></StompInitial>
          <Button variant="contained" color="error" onClick={handleGameChange}>
            다른 게임 선택하기
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default GameSelect;
