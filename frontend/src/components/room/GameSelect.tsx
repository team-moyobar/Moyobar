import React from "react";
import StompLiar from "../game/Liar";
import StompUpdown from "../game/Updown";
import StompInitial from "../game/Initial";
import { useState } from "react";
import Button from "@mui/material/Button";

export interface SelectGameProps {
  receiveGameSelect: string;
}

const GameSelect = (props: SelectGameProps) => {
  return (
    <div>
      {/* {props.receiveGameSelect === "None" ? (
        <div>
        </div>
      ) : null} */}
      {props.receiveGameSelect === "Liar" ? (
        <div>
          <StompLiar></StompLiar>
        </div>
      ) : null}
      {props.receiveGameSelect === "Updown" ? (
        <div>
          <StompUpdown></StompUpdown>
        </div>
      ) : null}
      {props.receiveGameSelect === "Initial" ? (
        <div>
          <StompInitial></StompInitial>
        </div>
      ) : null}
    </div>
  );
};

export default GameSelect;
