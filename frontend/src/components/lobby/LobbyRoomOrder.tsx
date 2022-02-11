import Button from "@mui/material/Button";
import "./LobbyRoomOrder.css";

export default function LobbyRoomOrder({ onClick }: any) {
  const handleClick = () => {
    onClick({ searchBy: "null", keyword: "null" });
  };

  return (
    <div className="order-container">
      <Button
        className="order-button"
        color="secondary"
        variant="outlined"
        onClick={handleClick}
      >
        <img src="/icons/lobby/reload.png" alt="" />
      </Button>
    </div>
  );
}
