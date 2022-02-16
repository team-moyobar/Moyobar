import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import { Component } from "react";
import "./UserCamera.css";
import UserVideoComponent from "./UserVideoComponent";
import Messages from "./Messages";
import GameSelect from "./GameSelect";
import { CheersDlg } from "./CheersDlg";
import { GameSelectDlg } from "./GameSelectDlg";

import { getToken as getCookie } from "../../routes/auth/Login";
import { withRouter } from "react-router-dom";

const OPENVIDU_SERVER_URL = "https://i6d210.p.ssafy.io:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";
class UserCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySessionId: props.roomId,
      myUserName: getCookie("nickname"),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      messages: [],
      isGameSelectButtonClicked: false,
      openCheers: false,
      openGameSelect: false,
      cheerCallUser: "",

      audiostate: false,
      videostate: false,

      gameSelect: "None",

      roomTitle: props.roomInfo.title,
      roomTheme: props.roomInfo.theme,
      owner: props.roomInfo.owner,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);

    this.chattoggle = this.chattoggle.bind(this);
    this.sendmessageByClick = this.sendmessageByClick.bind(this);
    this.sendmessageByEnter = this.sendmessageByEnter.bind(this);
    this.handleChatMessageChange = this.handleChatMessageChange.bind(this);

    this.handleEndGame = this.handleEndGame.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  sendmessageByClick() {
    this.setState({
      messages: [
        ...this.state.messages,
        {
          userName: this.state.myUserName,
          text: this.state.message,
          chatClass: "messages__item--operator",
        },
      ],
    });
    const mySession = this.state.session;

    mySession.signal({
      data: `${this.state.myUserName},${this.state.message}`,
      to: [],
      type: "chat",
    });

    this.setState({
      message: "",
    });
  }

  sendmessageByEnter(e) {
    if (e.key === "Enter") {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            userName: this.state.myUserName,
            text: this.state.message,
            chatClass: "messages__item--operator",
          },
        ],
      });
      const mySession = this.state.session;

      mySession.signal({
        data: `${this.state.myUserName},${this.state.message}`,
        to: [],
        type: "chat",
      });

      this.setState({
        message: "",
      });
    }
  }

  handleChatMessageChange(e) {
    this.setState({
      message: e.target.value,
    });
  }

  chattoggle() {
    this.setState({ chaton: !this.state.chaton });
  }

  handleEndGame() {
    const mySession = this.state.session;

    mySession.signal({
      data: "None",
      to: [],
      type: "selgame",
    });
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        mySession.on("streamCreated", (event) => {
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          this.setState({
            subscribers: subscribers,
          });
        });

        mySession.on("signal:chat", (event) => {
          let chatdata = event.data.split(",");
          if (chatdata[0] !== this.state.myUserName) {
            this.setState({
              messages: [
                ...this.state.messages,
                {
                  userName: chatdata[0],
                  text: chatdata[1],
                  chatClass: "messages__item--visitor",
                },
              ],
            });
          }
        });

        mySession.on("signal:selgame", (event) => {
          this.setState({
            gameSelect: event.data,
          });
        });

        mySession.on("signal:cheers", (event) => {
          this.setState({
            cheerCallUser: event.data,
          });
          this.handleOpenCheers();
        });

        mySession.on("streamDestroyed", (event) => {
          this.deleteSubscriber(event.stream.streamManager);
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(() => {
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: false,
                publishVideo: false,
                resolution: "640x480",
                frameRate: 30,
                insertMode: "APPEND",
                mirror: false,
              });

              mySession.publish(publisher);
              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch(() => {});
        });
      }
    );
  }

  leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });
    const TOKEN = getCookie("jwtToken");
    axios
      .delete(`/rooms/${this.state.mySessionId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then(() => {
        this.props.history.push("/lobby");
      })
      .catch(() => {});
  }

  componentDidMount() {
    this.joinSession();
  }

  handleGameSelectButton() {
    if (this.state.isGameSelectButtonClicked === false) {
      this.setState({
        isGameSelectButtonClicked: true,
      });
    } else {
      this.setState({
        isGameSelectButtonClicked: false,
      });
    }
  }

  sendCheersMsg() {
    const mySession = this.state.session;
    const myUserName = this.state.myUserName;

    mySession.signal({
      data: myUserName,
      to: [],
      type: "cheers",
    });
  }

  handleOpenCheers() {
    this.setState({
      openCheers: true,
    });
  }

  handleCloseCheers() {
    this.setState({
      openCheers: false,
    });
  }

  handleOpenGameSelect() {
    this.setState({
      openGameSelect: true,
    });
  }

  handleCloseGameSelect() {
    this.setState({
      openGameSelect: false,
    });
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const title = this.state.roomTitle;
    const theme = this.state.roomTheme;
    const myUserName = this.state.myUserName;

    const messages = this.state.messages;

    const { history } = this.props;

    let query;

    switch (this.state.subscribers.length) {
      case 0:
        query = 1;
        break;
      case 1:
        query = 2;
        break;
      case 2:
        query = 3;
        break;
      case 3:
        query = 3;
        break;
      case 4:
        query = 4;
        break;
      case 5:
        query = 4;
        break;
      case 6:
        query = 5;
        break;
      case 7:
        query = 5;
        break;
      default:
    }

    return (
      <div className="room-container">
        {this.state.session !== undefined ? (
          <div className="session">
            <div className="session-header">
              <p>{title}</p>
            </div>
            <div className={`session-center session-center-bg-${theme}`}>
              {this.state.publisher !== undefined ? (
                <div
                  className={`stream-container${query}`}
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent
                    streamManager={this.state.publisher}
                    owner={this.state.owner}
                  />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i}
                  className={`stream-container${query}`}
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <UserVideoComponent
                    streamManager={sub}
                    owner={this.state.owner}
                  />
                </div>
              ))}
            </div>
            <div className="session-footer">
              <div
                className={`control-button-audio ${
                  this.state.audiostate ? "room-green" : ""
                } `}
                onClick={() => {
                  this.state.publisher.publishAudio(!this.state.audiostate);
                  this.setState({ audiostate: !this.state.audiostate });
                }}
              >
                {this.state.audiostate ? (
                  <ion-icon name="mic-outline"></ion-icon>
                ) : (
                  <ion-icon name="mic-off-outline"></ion-icon>
                )}
              </div>
              <div
                className={`control-button-mic ${
                  this.state.videostate ? "room-green" : ""
                } `}
                onClick={() => {
                  this.state.publisher.publishVideo(!this.state.videostate);
                  this.setState({ videostate: !this.state.videostate });
                }}
              >
                {this.state.videostate ? (
                  <ion-icon name="videocam-outline"></ion-icon>
                ) : (
                  <ion-icon name="videocam-off-outline"></ion-icon>
                )}
              </div>
            </div>
          </div>
        ) : null}
        <div className="gamebox">
          <div className="gamebox-top">
            <div className="cheers-button" onClick={() => this.sendCheersMsg()}>
              <ion-icon name="beer-outline"></ion-icon>
            </div>
            {this.state.gameSelect == "None" ? (
              <div
                className="game-select-button"
                onClick={() => this.handleOpenGameSelect()}
              >
                <ion-icon name="game-controller-outline"></ion-icon>
              </div>
            ) : (
              <div
                className="game-end-button"
                onClick={() => this.handleEndGame()}
              >
                <ion-icon name="power-outline"></ion-icon>
              </div>
            )}
          </div>
          <div className="gamebox-center">
            <GameSelect receiveGameSelect={this.state.gameSelect}></GameSelect>
          </div>
          <div onClick={this.leaveSession} className="gamebox-bottom">
            <ion-icon name="enter-outline"></ion-icon>
          </div>
        </div>
        <div className="chatbox">
          {this.state.chaton ? (
            <div className="chat chatbox__support chatbox--active">
              <div className="chat chatbox__header" />
              <div className="chatbox__messages" ref="chatoutput">
                {/* {this.displayElements} */}
                <Messages messages={messages} />
                <div />
              </div>
              <div className="chat chatbox__footer">
                <input
                  id="chat_message"
                  type="text"
                  placeholder="메시지를 입력하세요"
                  onChange={this.handleChatMessageChange}
                  onKeyPress={this.sendmessageByEnter}
                  value={this.state.message}
                />
                <p
                  className="chat chatbox__send--footer"
                  onClick={this.sendmessageByClick}
                >
                  보내기
                </p>
              </div>
            </div>
          ) : null}
          <div className="chatbox__button" ref={this.chatButton}>
            <button onClick={this.chattoggle}>CHAT</button>
          </div>
        </div>
        <CheersDlg
          open={this.state.openCheers}
          onClose={this.handleCloseCheers.bind(this)}
          callUser={this.state.cheerCallUser}
        ></CheersDlg>
        <GameSelectDlg
          mySession={this.state.session}
          receiveGameSelect={this.state.gameSelect}
          open={this.state.openGameSelect}
          onClose={this.handleCloseGameSelect.bind(this)}
        ></GameSelectDlg>
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

export default withRouter(UserCamera);
