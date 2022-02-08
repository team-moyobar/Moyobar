import LobbyRoomListItem from "./LobbyRoomListItem";
import "./LobbyRoomList.css";

export default function LobbyRoomList({ items }: any) {
  return (
    <div className="lobby-roomlist-container">
      {items.map((item: any) => {
        const { title, membercount, privateroom } = item;

        return (
          <div className="lobby-roomlist-item" key={item.room_id}>
            <LobbyRoomListItem item={item} />
          </div>
        );
      })}
    </div>
  );
}
