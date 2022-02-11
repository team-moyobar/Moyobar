import React from "react";
import StompLiar from "../game/Liar";
import StompUpdown from "../game/Updown";
import StompInitial from "../game/Initial";
import { useState } from "react";
import Button from "@mui/material/Button";

export interface SelectGameProps {
  mySession: any;
  receiveGameSelect: string;
}

const GameSelect = (props: SelectGameProps) => {
  const handleLiar = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Liar",
      to: [],
      type: "selgame",
    });
  };
  const handleUpDown = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Updown",
      to: [],
      type: "selgame",
    });
  };
  const handleInitial = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "Initial",
      to: [],
      type: "selgame",
    });
  };
  const handleGameChange = () => {
    const mySession = props.mySession;

    mySession.signal({
      data: "None",
      to: [],
      type: "selgame",
    });
  };

  return (
    <div>
      {props.receiveGameSelect === "None" ? (
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
      {props.receiveGameSelect === "Liar" ? (
        <div>
          <StompLiar></StompLiar>
          <Button variant="contained" color="error" onClick={handleGameChange}>
            다른 게임 선택하기
          </Button>
        </div>
      ) : null}
      {props.receiveGameSelect === "Updown" ? (
        <div>
          <StompUpdown></StompUpdown>
          <Button variant="contained" color="error" onClick={handleGameChange}>
            다른 게임 선택하기
          </Button>
        </div>
      ) : null}
      {props.receiveGameSelect === "Initial" ? (
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
