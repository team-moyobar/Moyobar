import { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import "./UserVideoComponent.css";

export default class UserVideoComponent extends Component {
  getNicknameTag() {
    return JSON.parse(this.props.streamManager.stream.connection.data)
      .clientData;
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        {this.props.streamManager !== undefined ? (
          <div className="streamcomponent">
            <OpenViduVideoComponent
              streamManager={this.props.streamManager}
            ></OpenViduVideoComponent>
            <div>
              {this.props.owner === this.getNicknameTag() ? (
                <img
                  className="lobby-owner"
                  src="/icons/lobby/crown.png"
                  alt=""
                />
              ) : null}
              <p className="lobby-owner-p">{this.getNicknameTag()}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
