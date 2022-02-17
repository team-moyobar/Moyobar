import Dialog from "@mui/material/Dialog";
import "./GTutorialDlg.css";
import GameImg from "./GameImg";

export interface GTutorialDlgProps {
  open: boolean;
  onClose: () => void;
}

const isFullWidth: boolean = true;

export function GTutorialDlg(props: GTutorialDlgProps) {
  const { open, onClose } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={isFullWidth}
      PaperProps={{
        style: {
          background: "beige",
          minWidth: "90vh",
          maxWidth: "90vh",
          minHeight: "90vh",
          maxHeight: "90vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "10px",
        },
      }}
    >
      <div className="gtutorial-container">
        <h1>📚 게임 튜토리얼</h1>
        <GameImg></GameImg>
      </div>
    </Dialog>
  );
}
