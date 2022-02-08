import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

//let sockJS = new SockJS("http://localhost:8080/moyobar");
let sockJS = new SockJS("http://i6d210.p.ssafy.io:8080/moyobar");
let stompClient: Stomp.Client = Stomp.over(sockJS);

stompClient.debug = () => {};

interface message {
  username: string;
  content: string;
  date: Date;
}

function App() {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState(13);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(Number);
  const [turnOwner, setTurnOwner] = useState("");

  stompClient.connect({}, () => {
    console.log("connected");
    console.log(roomId);
    receiveGameStatus();
    receiveMessage();
  });

  const receiveMessage = () => {
    stompClient.subscribe("/from/ud/chat/" + roomId, (data) => {
      addMessage(JSON.parse(data.body));
      console.log(JSON.parse(data.body));
    });
  };

  const receiveGameStatus = () => {
    stompClient.subscribe("/from/ud/status/" + roomId, (data) => {
      let info = JSON.parse(data.body);

      console.log(info);

      let game_status = info.game_status;
      let user_order = info.user_order;
      let next_user_index = info.next_user_index;
      let result = info.result;

      setTurnOwner(user_order[next_user_index]);

      console.log(game_status);

      if (game_status === "START") {
        console.log("다음 순서는 " + user_order[next_user_index]);
      } else if (game_status === "PLAY") {
        console.log(
          "지난 순서 " +
            result.user_name +
            "님 의 입력 " +
            result.user_answer +
            "의 결과는: " +
            result.result_type
        );
        console.log("다음 순서는 " + user_order[next_user_index]);
      } else if (game_status === "FINISH") {
        console.log(
          result.user_name +
            "님이 " +
            result.result_type +
            "를 입력해 맞았습니다!"
        );
      }
    });
  };

  const chatSubmitBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let data = {
      username: nickname,
      content: message,
      date: new Date(),
    };
    stompClient.send("/to/ud/chat/" + roomId, {}, JSON.stringify(data));
    setMessage("");
  };

  const startBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    stompClient.send("/to/ud/start/" + roomId, {});
  };

  const answerBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let data = {
      nickname: nickname,
      number: answer,
    };
    stompClient.send("/to/ud/check/" + roomId, {}, JSON.stringify(data));
  };

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickname(e.target.value);
  };

  const onRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRoomId(parseInt(e.target.value));
  };

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const onAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAnswer(parseInt(e.target.value));
  };

  const addMessage = (message: message) => {
    let chatting_box = document.getElementById("chatting_box");

    let messagebox = document.createElement("div");
    messagebox.innerHTML = `<B>${message.username}</B>: ` + message.content;
    chatting_box?.appendChild(messagebox);
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>참가 방번호</td>
            <td>
              <input type="number" value={roomId} onChange={onRoomIdChange} />
            </td>
          </tr>
          <tr>
            <td>참가 닉네임</td>
            <td>
              <input type="text" value={nickname} onChange={onNicknameChange} />
            </td>
          </tr>
          {nickname === "test1" ? (
            <tr>
              <td>[방장]게임 시작</td>
              <td>
                <TableButton onClick={startBtn}>start</TableButton>
              </td>
            </tr>
          ) : (
            ""
          )}
          {nickname !== "" && turnOwner === nickname ? (
            <tr>
              <td>숫자 입력</td>
              <td>
                <input type="text" value={answer} onChange={onAnswerChange} />
              </td>
              <td>
                <TableButton onClick={answerBtn}>submit</TableButton>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div id="chat">
        <h3>채팅 목록</h3>
        <ChattingBox id="chatting_box"></ChattingBox>
      </div>
      <div>
        채팅:
        <input type="number" value={message} onChange={onMessageChange} />
        <button onClick={chatSubmitBtn}>send</button>
      </div>
    </div>
  );
}

const TableButton = styled.button`
  width: 100%;
`;
const ChattingBox = styled.div`
  height: 300px;
`;
export default App;
