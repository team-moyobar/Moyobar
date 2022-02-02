import React from "react";
import { useParams } from "react-router";

interface ParamTypes {
    roomId: string
}


function Room() {
    const { roomId } = useParams<ParamTypes>();
    return (
        <div>
            <h1>방입장하셨습니다.</h1>
            <p>{roomId}번 방</p>
        </div>
    )
}

export default Room