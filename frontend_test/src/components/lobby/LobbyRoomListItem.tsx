import React from "react";


export default function LobbyRoomListItem({item} : any) {
  return (
      <div>
        <p>방이름 : {item.title}</p>
        <p>인원 : {item.membercount}/8</p>
        {item.privateroom && <p>비공개방</p> }
        {item.privateroom || <p>공개방</p> }
      </div>
  );
}
