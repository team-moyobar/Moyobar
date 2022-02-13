import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";

import SpeechToText from "./SpeechToText";
import { getToken } from "../../routes/auth/Login";

import "./Initial.css";

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

export interface ParamsObj {
  roomId: string;
  owner: string;
}

export default function StompInitial() {
  const nickName = getToken("nickname");
  const { roomId } = useParams<{ roomId?: string }>();
  const { owner } = useParams<{ owner?: string }>();

  const playersRef = useRef<PlayersObj[]>(); // 플레이어 레퍼런스
  const consonantRef = useRef<string>(""); // 초성 레퍼런스
  const curUserTurnRef = useRef<string>(""); // 현재 턴 유저 이름

  const [open, setOpen] = React.useState(false);
  const [consonant, setConsontant] = React.useState(""); // 초성
  const [answer, setAnswer] = React.useState("");

  const [gameLogList, setGameLogList] = React.useState<Array<string>>([]); // 게임 로그 목록
  const [isGameStart, setIsGameStart] = React.useState(false); // 게임 시작 여부

  const handleOpenStt = () => {
    if (curUserTurnRef.current === nickName) {
      setOpen(true);
      setAnswer("");
    }
  };

  const handleCloseStt = (word: string) => {
    word = word.trim();

    setOpen(false);
    setAnswer(word);

    reqCheckWord(word); // 단어 맞는지 요청
  };

  // 초성게임 시작 메시지 전송
  const handleClickStart = () => {
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
      brokerURL: "wss://i6d210.p.ssafy.io/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      // debug: function (str) {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("connected");
        subscribeStart(); // 게임시작 메시지 처리
        subscribeNextTurn(); // 다음턴 메시지 처리
        subscribeCheckWord(); // 단어 확인 메시지 처리
        subscribeGameResult(); // 게임 결과 메시지 처리
      },
    });

    client.activate();
  };

  const subscribeStart = () => {
    if (client != null) {
      client.subscribe("/from/word/start/" + roomId, (data: any) => {
        let players: PlayersObj[] = JSON.parse(data.body).players;
        playersRef.current = players;

        setIsGameStart(true); // 게임시작 설정

        setGameLogList([]); // 로그 초기화

        // 게임 시작 로그
        let logMsg: string = "초성찾기 게임시작!!"; // 로깅 메시지 설정
        setGameLogList((gameLogList) => [...gameLogList, logMsg]);

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
          setConsontant(consonantRef.current); // 초성 설정

          let logMsg: string =
            "[" + curUserTurnRef.current + "] 음성인식 중..\n"; // 로깅 메시지 설정
          setGameLogList((gameLogList) => [...gameLogList, logMsg]);

          // 음성인식 호출
          handleOpenStt();
        } else {
          // 3턴 이후에 게임 종료 요청
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
        //let initial: string = JSON.parse(data.body).initial; // 단어
        let word: string = JSON.parse(data.body).word; // 단어
        let result: string = JSON.parse(data.body).result; // 결과

        let logMsg: string =
          "[" +
          nickname +
          "] " +
          "음성인식 [" +
          word +
          "] 결과 [" +
          result +
          "].\n"; // 로깅 메시지 설정
        setGameLogList((gameLogList) => [...gameLogList, logMsg]);

        reqNextTurn(); // 다음 턴 이동
      });
    }
  };

  // 게임결과 결과
  const subscribeGameResult = () => {
    if (client != null) {
      client.subscribe("/from/word/result/" + roomId, (data: any) => {
        let result: ResultObj[] = JSON.parse(data.body).gameresult;
        let logMsgs: string[] = [];

        curUserTurnRef.current = "";
        setIsGameStart(false); // 게임종료 설정

        logMsgs.push("초성찾기 게임종료\n");
        // 게임 종료 로그
        for (let i = 0; i < result.length; i++) {
          logMsgs.push(
            "닉네임[" +
              result[i].nickname +
              "] 맞춘횟수[" +
              result[i].corrcnt +
              "]\n"
          );
        }

        setGameLogList(logMsgs); // 로깅 메시지 설정
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
    <div className="initial-component">
      <div>
        <h3>&lt;초성게임&gt;</h3>
      </div>
      {nickName === owner && isGameStart === false && (
        <Button variant="contained" onClick={handleClickStart}>
          <h4>게임시작</h4>
        </Button>
      )}
      {isGameStart === true && (
        <div className="initial-consonant">
          <h4>제시어 : {consonant}</h4>
        </div>
      )}
      <div className="nitial-gamelog">
        <Paper style={{ width: 270, maxHeight: 400, overflow: "auto" }}>
          {gameLogList.map((gameLogItem, idx) => (
            <ListItem key={idx}>{gameLogItem}</ListItem>
          ))}
        </Paper>
      </div>
      <SpeechToText
        open={open}
        consonant={consonant}
        onClose={handleCloseStt}
      ></SpeechToText>
    </div>
  );
}
