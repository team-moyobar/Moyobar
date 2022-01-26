import React from "react";

export default function LobbyRoomListItem({ item }: any) {
  let query = "bg";

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0) 10%,
        rgba(20, 20, 20, 0.25) 25%,
        rgba(20, 20, 20, 0.5) 50%,
        rgba(20, 20, 20, 0.75) 75%,
        rgba(20, 20, 20, 1) 100%
      ), url(/assets/images/${query}.jpg)`,
        backgroundSize: "cover",
        height: "150px",
        color: "white",
        paddingTop: "20%",
      }}
    >
      <p style={{ margin: "0" }}>방이름 : {item.title}</p>
      <p style={{ margin: "0" }}>인원 : {item.membercount}/8</p>
      {item.privateroom && "비공개방"}
      {item.privateroom || "공개방"}
    </div>
  );
}
