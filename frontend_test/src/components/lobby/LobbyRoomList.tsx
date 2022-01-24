import LobbyRoomListItem from "./LobbyRoomListItem";

import React, {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectRoomList, actions, RootState, Room } from "../../features";

import LobbyCreateRoom2 from "./LobbyCreateRoom2";

export default function LobbyRoomList() {
  const dispatch = useDispatch();

  const roomList = useSelector<RootState, Room[]>((state) =>
    selectRoomList(state.rooms)
  );

  return (
    <>
      <LobbyCreateRoom2 />
      <div className="container row">
        {roomList.map((item: Room) => (
          <div className="col-5 border m-3" key={item.id}>
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    </>
  );
}
