import React, { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import SpeechToText from "./SpeechToText";
import { InitialResDlg } from "./InitialResDlg";

import { getToken } from "../../routes/auth/Login";

import "./Initial.css";

var client: Client | null = null;

var timer: NodeJS.Timer | null = null;

export interface PlayersObj {
  nickname: string;
  turn: string;
}

export interface TurnObj {
  next: string;
  initial: string;
  gameturn: number;
}

export interface ResultObj {
  nickname: string;
  corrcnt: string;
}

export interface ParamsObj {
  roomId: string;
  owner: string;
}

export default function StompInitial() {
  const nickName = getToken("nickname");
  const { roomId } = useParams<{ roomId?: string }>();
  const { owner } = useParams<{ owner?: string }>();

  const playersRef = useRef<PlayersObj[]>();
  const consonantRef = useRef<string>("");
  const curTurnRecUserRef = useRef<string>("");
  const curTurnEndUserRef = useRef<string>("");
  const curTurnWordRef = useRef<string>("");
  const curTurnResRef = useRef<string>("");

  const [openSttDlg, setOpenSttDlg] = React.useState(false);
  const [openResDlg, setOpenResDlg] = React.useState(false);
  const [consonant, setConsontant] = React.useState("");

  const [curTurnRecUser, setCurTurnRecUser] = React.useState("");
  const [curTurnEndUser, setCurTurnEndUser] = React.useState("");
  const [curTurnWord, setCurTurnWord] = React.useState("");
  const [curTurnRes, setCurTurnRes] = React.useState("");

  const [isGameStart, setIsGameStart] = React.useState(false);
  const [gameRes, setGameRes] = React.useState<ResultObj[]>([]);

  const handleOpenStt = () => {
    if (curTurnRecUserRef.current === nickName) {
      setOpenSttDlg(true);
    }
  };

  const handleCloseStt = (word: string) => {
    word = word.trim();
    reqCheckWord(word);
    setOpenSttDlg(false);
  };

  const handleInitialResClose = () => {
    setOpenResDlg(false);
  };

  const handleClickStart = () => {
    if (client != null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/word/start/" + roomId,
      });
    }
  };

  useEffect(() => {
    connect();
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

  const connect = () => {
    client = new Client({
      brokerURL: "wss://i6d210.p.ssafy.io/moyobar/websocket",
      reconnectDelay: 10000,

      onConnect: () => {
        subscribeStart();
        subscribeNextTurn();
        subscribeCheckWord();
        subscribeGameResult();
      },
    });

    client.activate();
  };

  const subscribeStart = () => {
    if (client != null) {
      client.subscribe("/from/word/start/" + roomId, (data: any) => {
        let players: PlayersObj[] = JSON.parse(data.body).players;
        playersRef.current = players;

        setIsGameStart(true);

        consonantRef.current = "";
        curTurnRecUserRef.current = "";
        curTurnEndUserRef.current = "";
        curTurnWordRef.current = "";
        curTurnResRef.current = "";
        setCurTurnRecUser("");
        setCurTurnEndUser("");
        setCurTurnWord("");
        setCurTurnRes("");

        reqNextTurn();
      });
    }
  };

  const subscribeNextTurn = () => {
    if (client != null) {
      client.subscribe("/from/word/next/" + roomId, (data: any) => {
        let result: TurnObj = JSON.parse(data.body);
        let gameTurn: number = result.gameturn + 1;

        curTurnRecUserRef.current = result.next;
        consonantRef.current = result.initial;

        setCurTurnRecUser(curTurnRecUserRef.current);
        setConsontant(consonantRef.current);

        setCurTurnRes("");

        if (gameTurn <= 5) {
          handleOpenStt();
        } else {
          reqGameResult();
        }
      });
    }
  };

  const subscribeCheckWord = () => {
    if (client != null) {
      client.subscribe("/from/word/check/" + roomId, (data: any) => {
        let nickname: string = JSON.parse(data.body).nickname;
        let word: string = JSON.parse(data.body).word;
        let result: string = JSON.parse(data.body).result;

        curTurnEndUserRef.current = nickname;
        curTurnWordRef.current = word;
        curTurnResRef.current = result;

        setCurTurnEndUser(nickname);
        setCurTurnWord(word);
        setCurTurnRes(result);

        if (result === "Fail") {
          setTimeout(() => {
            reqGameResult();
          }, 5000);
        } else {
          setTimeout(() => {
            reqNextTurn();
          }, 3000);
        }
      });
    }
  };

  const subscribeGameResult = () => {
    if (client != null) {
      client.subscribe("/from/word/result/" + roomId, (data: any) => {
        let result: ResultObj[] = JSON.parse(data.body).gameresult;
        setGameRes(result);

        setOpenSttDlg(false);
        setOpenResDlg(true);

        consonantRef.current = "";
        curTurnRecUserRef.current = "";
        curTurnEndUserRef.current = "";
        curTurnWordRef.current = "";
        curTurnResRef.current = "";
        setIsGameStart(false);
      });
    }
  };

  const reqCheckWord = (word: string) => {
    if (client != null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/word/check/" + roomId,
        body: JSON.stringify({
          nickname: curTurnRecUserRef.current,
          initial: consonantRef.current,
        }),
      });
    }
  };

  const reqNextTurn = () => {
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

  const reqGameResult = () => {
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
