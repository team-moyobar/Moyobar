import React from "react";

import LobbyRoomListItem from "./LobbyRoomListItem";

import { useState, useCallback, ChangeEvent, KeyboardEvent } from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectRoomList, actions, RootState, Room } from "../../features";

export default function LobbyCreateRoom2() {
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState<string>("");

  const handleText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    console.log(e.target.value);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (inputText) {
        dispatch(
          actions.addRooms({
            title: inputText,

            start: false,
          })
        );

        console.log("저장");

        setInputText("");
      }
    },

    [dispatch, inputText]
  );

  return (
    <div>
      <input
        type="text"
        onChange={handleText}
        onKeyDown={handleEnter}
        value={inputText}
        placeholder="방 제목 입력"
      />
    </div>
  );
}
