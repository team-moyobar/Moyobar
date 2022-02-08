import Button from "@mui/material/Button";

export default function LobbyRoomOrder({ onClick }: any) {
  const handleClick = () => {
    onClick({ searchBy: "null", keyword: "null" });
  };

  return (
    <div style={{ display: "inline" }}>
      <Button color="secondary" variant="outlined" onClick={handleClick}>
        방 새로고침
      </Button>
    </div>
  );
}
