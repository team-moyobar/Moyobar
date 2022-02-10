import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import SpeechToText from "./SpeechToText";

// stomp client 변수
var client: Client | null = null;

// 타이머 변수
var timer: NodeJS.Timer | null = null;

// 초성게임 플레이어 인터페이스
export interface PlayersObj {
  nickname: string; // 닉네임
  turn: string; // 라운드
}

// 초성게임 결과 인터페이스
export interface ResultObj {
  nickname: string; // 닉네임
  corrcnt: string; // 맞춘횟수
}

export default function StompInitial() {
  // Props 또는 Redux로 전달받아야함
  const [nickName, setNickName] = useState("test1");
  const [roomId, setRoomId] = useState("13");
  const [owner, setOwner] = useState("test1");
  //////////////////////////////

  const playersRef = useRef<PlayersObj[]>(); // 플레이어 레퍼런스
  const gameLogRef = useRef<string>(""); // 게임 로그 레퍼런스
  const consonantRef = useRef<string>(""); // 초성 레퍼런스
  const curUserTurnRef = useRef<string>(""); // 현재 턴 유저 이름
  const curRoundRef = useRef<number>(0); // 현재 턴 정보

  const [open, setOpen] = React.useState(false);
  const [consonant, setConsontant] = React.useState("ㅇㅈ");
  const [answer, setAnswer] = React.useState("");
  const [gameLog, setGameLog] = React.useState("");

  const handleOpenStt = () => {
    setOpen(true);
    setAnswer("");
  };

  const handleCloseStt = (word: string) => {
    word = word.trim();

    setOpen(false);
    setAnswer(word);

    reqCheckWord(word); // 단어 맞는지 요청
  };

  // 초성게임 시작 메시지 전송
  const handleClickStart = () => {
    gameLogRef.current = "";
    setGameLog(gameLogRef.current);

    if (client != null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/word/start/" + roomId,
      });
    }
  };

  useEffect(() => {
    connect(); // Stomp 연결 설정
    return () => clearObject();
  }, []);

  const clearObject = () => {
    if (client != null) {
      if (client.connected) client.deactivate();
    }

    if (timer != null) {
      clearInterval(timer);
    }
  };

  // stomp 연결
  const connect = () => {
    client = new Client({
      // brokerURL: "ws://localhost:8080/moyobar/websocket",
      brokerURL: "ws://i6d210.p.ssafy.io:8080/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      // debug: function (str) {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("connected");
        subscribeStart(); // 게임시작 메시지 처리
        subscribeNextTurn(); // 다음턴 메시지 처리
        subscribeCheckWord(); // 단어 확인 메시지 처리
      },
    });

    client.activate();
  };

  const subscribeStart = () => {
    if (client != null) {
      client.subscribe("/from/word/start/" + roomId, (data: any) => {
        let players: PlayersObj[] = JSON.parse(data.body).players;
        playersRef.current = players;

        // 게임 시작 로그
        gameLogRef.current = gameLogRef.current.concat(
          "초성찾기 게임시작" + "\n"
        );

        // 게임 순서 로그
        for (let i = 0; i < players.length; i++) {
          gameLogRef.current = gameLogRef.current.concat(
            "닉네임[" +
              players[i].nickname +
              "] 순서[" +
              players[i].turn +
              "]\n"
          );
        }

        setGameLog(gameLogRef.current); // 로깅 메시지 설정
        reqNextTurn(); // 다음 턴 이동
      });
    }
  };

  const subscribeNextTurn = () => {
    if (client != null) {
      client.subscribe("/from/word/next/" + roomId, (data: any) => {
        curUserTurnRef.current = JSON.parse(data.body).next; // 다음 유저
        consonantRef.current = JSON.parse(data.body).initial; // 초성
        let gameTurn: number = JSON.parse(data.body).gameturn + 1; // 게임 턴

        if (gameTurn <= 3) {
          if (curUserTurnRef.current === nickName) {
            // 5초이후에 음성인식 호출
            setTimeout(() => {
              setConsontant(consonantRef.current);
              handleOpenStt();
            }, 5000);
          }

          if (curRoundRef.current !== gameTurn) {
            curRoundRef.current = gameTurn;
            gameLogRef.current = gameLogRef.current.concat(
              "<< round " + gameTurn + " >>\n"
            );
          }
          // 게임 턴 로그
          gameLogRef.current = gameLogRef.current.concat(
            "5초 이후에 [" + curUserTurnRef.current + "] 음성인식 Start\n"
          );

          setGameLog(gameLogRef.current); // 로깅 메시지 설정
        } else {
          // 3턴 이후에 게임 종료 요청
          curRoundRef.current = 0;
          reqGameResult();
        }
      });
    }
  };

  // 초성퀴즈 결과
  const subscribeCheckWord = () => {
    if (client != null) {
      client.subscribe("/from/word/check/" + roomId, (data: any) => {
        let nickname: string = JSON.parse(data.body).nickname; // 닉네임
        let initial: string = JSON.parse(data.body).initial; // 단어
        let word: string = JSON.parse(data.body).word; // 단어
        let result: string = JSON.parse(data.body).result; // 결과

        // 게임 턴 로그
        gameLogRef.current = gameLogRef.current.concat(
          "닉네임 [" + nickname + "] 제시어[" + initial + "]\n"
        );

        gameLogRef.current = gameLogRef.current.concat(
          "인식단어 [" + word + "] 결과는 [" + result + "].\n"
        );

        setGameLog(gameLogRef.current); // 로깅 메시지 설정
        reqNextTurn(); // 다음 턴 이동
      });
    }
  };

  // 게임결과 결과
  const subscribeGameResult = () => {
    if (client != null) {
      client.subscribe("/from/word/result/" + roomId, (data: any) => {
        let result: ResultObj[] = JSON.parse(data.body).gameresult;

        // 게임 시작 로그
        gameLogRef.current = gameLogRef.current.concat(
          "초성찾기 게임종료" + "\n"
        );

        // 게임 순서 로그
        for (let i = 0; i < result.length; i++) {
          gameLogRef.current = gameLogRef.current.concat(
            "닉네임[" +
              result[i].nickname +
              "] 맞춘횟수[" +
              result[i].corrcnt +
              "]\n"
          );
        }

        setGameLog(gameLogRef.current); // 로깅 메시지 설정
      });
    }
  };

  // 단어 체크 요청
  const reqCheckWord = (word: string) => {
    if (client != null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/word/check/" + roomId,
        body: JSON.stringify({
          nickname: curUserTurnRef.current, // 닉네임
          word: word,
          initial: consonantRef.current, // 초성
        }),
      });
    }
  };

  // 다음 턴 요청
  const reqNextTurn = () => {
    // 현재 유저가 방장인 경우 다음턴 요청
    if (owner === nickName) {
      if (client != null) {
        if (!client.connected) return;

        client.publish({
          destination: "/to/word/next/" + roomId,
          body: JSON.stringify({
            current: curUserTurnRef.current,
          }),
        });
      }
    }
  };

  // 게임 결과 요청
  const reqGameResult = () => {
    // 현재 유저가 방장인 경우 게임결과 요청
    if (owner === nickName) {
      if (client != null) {
        if (!client.connected) return;

        client.publish({
          destination: "/to/word/result/" + roomId,
        });
      }
    }
  };

  return (
    <div>
      <div>
        <h1>
          {roomId} 번방 {nickName} 님 환영합니다
        </h1>
      </div>
      <Button variant="contained" onClick={handleClickStart}>
        Game Start
      </Button>
      {/* <button onClick={() => handleOpenStt()}>음성인식</button> */}
      <div>
        <SpeechToText
          open={open}
          consonant={consonant}
          onClose={handleCloseStt}
        ></SpeechToText>
      </div>
      <TextareaAutosize
        maxRows={20}
        aria-label="maximum height"
        placeholder="Maximum 4 rows"
        defaultValue={gameLog}
        style={{ width: 250, height: 400 }}
      />
    </div>
  );
}
