import LobbyRoomListItem from "./LobbyRoomListItem";
import React, {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectRoomList, actions, RootState, Room } from "../../features";

const RoomEditor = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState<string>("");
  const handleText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
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
        console.log("저장")
        setInputText("");
      }
    },
    [dispatch, inputText]
  );
  return (
    <div>
      <input
        type="text"
        // onChange={handleText}
        onKeyDown={handleEnter}
        value={inputText}
        className="txt-input"
        placeholder="방 제목 입력"
      />
    </div>
  );
};
export default function LobbyRoomList() {
  const dispatch = useDispatch();
  const roomList = useSelector<RootState, Room[]>((state) =>
    selectRoomList(state.rooms)
  );
  return (
    <>
      <RoomEditor />
      <ul>
        {roomList.map((item: Room) => (
          <li key={item.id}>
            <span>{item.title}</span>
            if ({item.title}) {
              <span>진행중</span>
            }
            else {
              <span>대기중</span>
            }
          </li>
        ))}
      </ul>
    </>
  );
}
