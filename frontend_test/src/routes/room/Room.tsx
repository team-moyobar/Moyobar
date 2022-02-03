import React from "react";
import { useParams } from "react-router";
import Liar from "../../components/liar/Liar.js";

interface ParamTypes {
  roomId: string;
}

function Room() {
  const { roomId } = useParams<ParamTypes>();
  return (
    <div>
      <Liar></Liar>
      <h1>방입장하셨습니다.</h1>
      <p>{roomId}번 방</p>
    </div>
  );
}

export default Room;
