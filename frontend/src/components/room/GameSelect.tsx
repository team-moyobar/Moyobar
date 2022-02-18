import StompLiar from "../game/Liar";
import StompUpdown from "../game/Updown";
import StompInitial from "../game/Initial";
import "./GameSelect.css";
export interface SelectGameProps {
  receiveGameSelect: string;
}

const GameSelect = (props: SelectGameProps) => {
  return (
    <div className="game-select-container">
      {props.receiveGameSelect === "Liar" ? <StompLiar></StompLiar> : null}
      {props.receiveGameSelect === "Updown" ? (
        <StompUpdown></StompUpdown>
      ) : null}
      {props.receiveGameSelect === "Initial" ? (
        <StompInitial></StompInitial>
      ) : null}
    </div>
  );
};

export default GameSelect;
