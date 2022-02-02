import LobbyRoomListItem from "./LobbyRoomListItem";
import "./LobbyRoomList.css";

import React, {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectRoomList, actions, RootState, Room } from "../../features";

export default function LobbyRoomList({ items }: any) {
  const dispatch = useDispatch();
  const roomList = useSelector<RootState, Room[]>((state) =>
    selectRoomList(state.rooms)
  );

  return (
    <div className="lobby-roomlist-container">
      {items.map((item: any) => {
        const { title, membercount, privateroom } = item;

        return (
          <div className="lobby-roomlist-item" key={item.id}>
            <LobbyRoomListItem item={item} />
          </div>
        );
      })}
    </div>
  );
}
