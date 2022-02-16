import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import { getToken } from "../../routes/auth/Login";

// 게임 타이머
import Timer from "./timer/Timer.js";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// style
import "./Updown.css";

// stomp client 변수
var client: Client | null = null;

interface message {
  username: string;
  content: string;
  date: Date;
}

function StompUpdown() {
  const nickname = getToken("nickname");
  const { roomId } = useParams<{ roomId?: string }>();
  const { owner } = useParams<{ owner?: string }>();
  const [gameStatus, setGameStatus] = useState("");

  const [resultUser, setResultUser] = useState("");
  const [resultType, setResultType] = useState("");
  const [resultAnswer, setResultAnswer] = useState("");

  const [isPlaying, setIsPlaying] = useState(true);
  const [count, setCount] = useState(10);
  const [countKey, setCountKey] = useState(0);

  // const [nickname, setNickname] = useState("");
  // const [roomId, setRoomId] = useState(77);
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
      brokerURL: "wss://i6d210.p.ssafy.io/moyobar/websocket",
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
        setGameStatus(game_status);

        if (game_status === "PLAY") {
          setResultUser(result.user_name);
          setResultType(result.result_type);
          setResultAnswer(result.user_answer);
        } else if (game_status === "FINISH") {
          setResultUser(result.user_name);
          setResultType(result.result_type);
          setResultAnswer(result.user_answer);
        }

        setCountKey((prevKey) => prevKey + 1);
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
    setCount(10);
    setCountKey((prevKey) => prevKey + 1);
  };

  const timeOut = () => {
    let data = {
      nickname: nickname,
      number: resultAnswer,
    };
    if (client != null && nickname === turnOwner) {
      client.publish({
        destination: "/to/ud/check/" + roomId,
        body: JSON.stringify(data),
      });
    }
    setCount(10);
    setCountKey((prevKey) => prevKey + 1);
  };

  // const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setNickname(e.target.value);
  // };

  // const onRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setRoomId(parseInt(e.target.value));
  // };

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
    <div className="updown-container">
      {gameStatus === "" ? (
        <div className="updown-ready updown-title">
          <span>U</span>
          <span>P</span>
          <span>&#38;</span>
          <span>D</span>
          <span>O</span>
          <span>W</span>
          <span>N</span>
        </div>
      ) : null}
      {gameStatus === "START" ? (
        <p>
          지금 차례 :<span className="liar-hero">{turnOwner}</span>
        </p>
      ) : null}
      {gameStatus === "PLAY" ? (
        <div className="updown-div2">
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={count}
            isSmoothColorTransition={true}
            key={countKey}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[8, 6.66, 3.33, 0]}
            onComplete={timeOut}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
          <p>
            <span className="updown-now">{resultUser}</span> 가 {resultAnswer}을
            말했습니다.
          </p>
          <p>
            지금 차례 :<span className="liar-hero">{turnOwner}</span>
          </p>
          {resultType === "UP" ? (
            <img src="/images/game/up.png" alt="up" />
          ) : (
            <img src="/images/game/down.png" alt="down" />
          )}
          {nickname !== "" && turnOwner === nickname ? (
            <div className="updown-playing">
              <p className="updown-exp">숫자를 입력하세요.</p>
              <input
                className="updown-input2"
                type="text"
                onChange={onAnswerChange}
              />
              <button className="updown-submit" onClick={answerBtn}>
                정답 제출하기
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {gameStatus === "FINISH" ? (
        <div>
          <h1>게임 종료</h1>
          <p>승자 : {resultUser}</p>
        </div>
      ) : null}

      {nickname === owner && gameStatus === "" ? (
        <button className="game-start-button" onClick={startBtn}>
          START
        </button>
      ) : null}

      {nickname !== owner && gameStatus === "" ? (
        <div className="updown-ready">
          <span>A</span>
          <span>R</span>
          <span>E</span>
          <span>Y</span>
          <span>O</span>
          <span>U</span>
          <span>R</span>
          <span>E</span>
          <span>A</span>
          <span>D</span>
          <span>Y</span>
          <span>?</span>
        </div>
      ) : null}

      {nickname !== "" && turnOwner === nickname && gameStatus === "START" ? (
        <div className="updown-div1">
          <p className="updown-exp">숫자를 입력하세요.</p>
          <input
            className="updown-input"
            type="text"
            onChange={onAnswerChange}
          />
          <button className="updown-submit" onClick={answerBtn}>
            정답 제출하기
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default StompUpdown;
