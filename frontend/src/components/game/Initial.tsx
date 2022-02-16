import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import SpeechToText from "./SpeechToText";
import { InitialResDlg } from "./InitialResDlg";

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

// 초성게임 턴정보 인터페이스
export interface TurnObj {
  next: string; // 현재 순서 닉네임
  initial: string; // 초성
  gameturn: number; // 현재 턴
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
  const curTurnRecUserRef = useRef<string>(""); // 현재 턴 음성인식 유저 이름
  const curTurnEndUserRef = useRef<string>(""); // 현재 턴 결과 유저 이름
  const curTurnWordRef = useRef<string>(""); // 현재 턴 입력 단어
  const curTurnResRef = useRef<string>(""); // 현재 턴 인식 결과

  const [openSttDlg, setOpenSttDlg] = React.useState(false);
  const [openResDlg, setOpenResDlg] = React.useState(false);
  const [consonant, setConsontant] = React.useState(""); // 초성

  const [curTurnRecUser, setCurTurnRecUser] = React.useState(""); // 현재턴 음성인식 유저이름
  const [curTurnEndUser, setCurTurnEndUser] = React.useState(""); // 현재턴 결과 유저이름
  const [curTurnWord, setCurTurnWord] = React.useState(""); // 현재턴 입력 단어
  const [curTurnRes, setCurTurnRes] = React.useState(""); // 현재턴 인식결과

  const [isGameStart, setIsGameStart] = React.useState(false); // 게임 시작 여부
  const [gameRes, setGameRes] = React.useState<ResultObj[]>([]); // 투표 결과

  const handleOpenStt = () => {
    if (curTurnRecUserRef.current === nickName) {
      setOpenSttDlg(true);
    }
  };

  const handleCloseStt = (word: string) => {
    word = word.trim();
    reqCheckWord(word); // 단어 맞는지 요청
    setOpenSttDlg(false);
  };

  // 게임결과 창 닫기
  const handleInitialResClose = () => {
    setOpenResDlg(false);
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

        // 변수 초기화
        consonantRef.current = "";
        curTurnRecUserRef.current = "";
        curTurnEndUserRef.current = "";
        curTurnWordRef.current = "";
        curTurnResRef.current = "";
        setCurTurnRecUser("");
        setCurTurnEndUser("");
        setCurTurnWord("");
        setCurTurnRes("");

        reqNextTurn(); // 다음 턴 이동
      });
    }
  };

  const subscribeNextTurn = () => {
    if (client != null) {
      client.subscribe("/from/word/next/" + roomId, (data: any) => {
        let result: TurnObj = JSON.parse(data.body);
        let gameTurn: number = result.gameturn + 1; // 게임 턴

        curTurnRecUserRef.current = result.next; // 현재 턴 유저
        consonantRef.current = result.initial; // 초성

        setCurTurnRecUser(curTurnRecUserRef.current); // 현재 턴 음성인식 유저 설정
        setConsontant(consonantRef.current); // 초성 설정

        setCurTurnRes(""); // 현재 결과 값 초기화

        if (gameTurn <= 5) {
          // 음성인식 호출
          handleOpenStt();
        } else {
          // 5턴 이후에 게임 종료 요청
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
        let word: string = JSON.parse(data.body).word; // 단어
        let result: string = JSON.parse(data.body).result; // 결과

        curTurnEndUserRef.current = nickname; // 현재 턴 유저
        curTurnWordRef.current = word; // 현재 턴 유저
        curTurnResRef.current = result; // 현재 턴 유저

        setCurTurnEndUser(nickname); // 현재 턴 단어인식 결과 유저 설정
        setCurTurnWord(word); // 현재 턴 음성인식 단어 설정
        setCurTurnRes(result); // 현재 턴 음성인식 결과 설정

        if (result === "Fail") {
          setTimeout(() => {
            reqGameResult();
          }, 5000);
        } else {
          setTimeout(() => {
            reqNextTurn(); // 다음 턴 이동
          }, 3000);
        }
      });
    }
  };

  // 게임결과 결과
  const subscribeGameResult = () => {
    if (client != null) {
      client.subscribe("/from/word/result/" + roomId, (data: any) => {
        let result: ResultObj[] = JSON.parse(data.body).gameresult;
        setGameRes(result); // 게임 결과 설정

        setOpenSttDlg(false);
        setOpenResDlg(true); //

        consonantRef.current = "";
        curTurnRecUserRef.current = "";
        curTurnEndUserRef.current = "";
        curTurnWordRef.current = "";
        curTurnResRef.current = "";
        setIsGameStart(false); // 게임종료 설정
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
          nickname: curTurnRecUserRef.current, // 닉네임
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
            current: curTurnRecUserRef.current,
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
      {isGameStart === false && <p className="init-title">ㅊㅅ ㅋㅈ</p>}
      {nickName === owner && isGameStart === false && (
        <button className="game-start-button" onClick={handleClickStart}>
          START
        </button>
      )}
      {isGameStart === true && (
        <div className="initial-consonant">
          <p className="init-key">
            제시어 <span>{consonant}</span>
          </p>
        </div>
      )}
      {isGameStart === true && (
        <div>
          {curTurnRecUser !== "" && (
            <div className="init-div">
              <p className="init-user">{curTurnRecUser} </p>
              <p>음성 인식 중입니다...</p>
            </div>
          )}
          {curTurnRes !== "" && (
            <div className="init-div">
              <p>음성인식 결과 {curTurnWord}</p>
              <p className="init-res">{curTurnRes}</p>
            </div>
          )}
        </div>
      )}
      <SpeechToText
        open={openSttDlg}
        onClose={handleCloseStt}
        consonant={consonant}
      ></SpeechToText>
      <InitialResDlg
        open={openResDlg}
        onClose={handleInitialResClose}
        gameRes={gameRes}
      />
    </div>
  );
}
