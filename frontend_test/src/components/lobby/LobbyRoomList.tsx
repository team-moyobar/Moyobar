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


export default function LobbyRoomList({items} : any ) {
  const dispatch = useDispatch();
  const roomList = useSelector<RootState, Room[]>((state) =>
    selectRoomList(state.rooms)
  );

  return (
    <div className="container row mx-0" style={{justifyContent : "center"}}>
      {items.map((item : any) => {
        const {title, membercount, privateroom} = item;

        return(
          <div className="col-5 m-3 px-0 " key={item.id} id="neonsignbox" >
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
