import LobbyRoomListItem from "./LobbyRoomListItem";
import './LobbyRoomList.css'

import React, {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectRoomList, actions, RootState, Room } from "../../features";

import LobbyCreateRoom2 from "./LobbyCreateRoom2";


export default function LobbyRoomList({items} : any ) {
  const dispatch = useDispatch();
  const roomList = useSelector<RootState, Room[]>((state) =>
    selectRoomList(state.rooms)
  );

  return (
    // <div className="container row mx-0" >
    <div className="lobby-roomlist-container" >
      {items.map((item : any) => {
        const {title, membercount, privateroom} = item;

        return(
          <div className="lobby-roomlist-item" key={item.id}  >
            <LobbyRoomListItem item={item}/>
          </div>
        )

      })}
    </div>
    // 테스트 용도로 잠시 주석처리 하였습니다
    // <>
    //   <LobbyCreateRoom2 />
    //   <div className="container row">
    //     {roomList.map((item: Room) => (
    //       <div className="col-5 border m-3" key={item.id}>
    //         <h4>{item.title}</h4>
    //       </div>
    //     ))}
    //   </div>
    // </>
  );
}
