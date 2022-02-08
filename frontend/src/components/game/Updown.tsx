import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Client } from "@stomp/stompjs";

// stomp client 변수
var client: Client | null = null;

interface message {
  username: string;
  content: string;
  date: Date;
}

function StompUpdown() {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState(13);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(Number);
  const [turnOwner, setTurnOwner] = useState("");

  useEffect(() => {
    connect(); // Stomp 연결 설정
    return () => clearObject();
  }, []);

  const clearObject = () => {
    if (client != null) {
      if (client.connected) client.deactivate();
    }
  };

  const connect = () => {
    client = new Client({
      //brokerURL: "ws://localhost:8080/moyobar/websocket",
      brokerURL: "ws://i6d210.p.ssafy.io:8080/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      // debug: function (str) {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("connected");
        console.log(roomId);
        receiveGameStatus();
        receiveMessage();
      },
    });

    client.activate();
  };

  const receiveMessage = () => {
    if (client != null) {
      client.subscribe("/from/ud/chat/" + roomId, (data) => {
        addMessage(JSON.parse(data.body));
        console.log(JSON.parse(data.body));
      });
    }
  };

  const receiveGameStatus = () => {
    if (client != null) {
      client.subscribe("/from/ud/status/" + roomId, (data) => {
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
    }
  };

  const chatSubmitBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let data = {
      username: nickname,
      content: message,
      date: new Date(),
    };
    if (client != null) {
      client.publish({
        destination: "/to/ud/chat/" + roomId,
        body: JSON.stringify({
          data,
        }),
      });
      setMessage("");
    }
  };

  const startBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (client != null) {
      let str: string = "";
      client.publish({
        destination: "/to/ud/start/" + roomId,
        body: str,
      });
    }
  };

  const answerBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let data = {
      nickname: nickname,
      number: answer,
    };

    if (client != null) {
      client.publish({
        destination: "/to/ud/check/" + roomId,
        body: JSON.stringify(data),
      });
    }
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
    </div>
  );
}

const TableButton = styled.button`
  width: 100%;
`;
const ChattingBox = styled.div`
  height: 300px;
`;
export default StompUpdown;
