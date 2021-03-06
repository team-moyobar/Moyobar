import Dialog from "@mui/material/Dialog";

import "./TutorialDlg.css";

export interface TutorialDlgProps {
  open: boolean;
  onClose: () => void;
}

const isFullWidth: boolean = true;

export function TutorialDlg(props: TutorialDlgProps) {
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
          // backgroundImage: `url("/images/room/tutorialbg.jpg")`,
          background: "beige",
          minWidth: "60vh",
          maxWidth: "60vh",
          minHeight: "80vh",
          maxHeight: "80vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "10px",
        },
      }}
    >
      <div className="tutorial-container">
        <h1>π μλΉμ€ κ°μ΄λ</h1>
        <div className="tu-contain">
          <div className="tu-beer"></div>
          <div className="tu-exp">
            <p>κ±΄λ°° λ²νΌ</p>
            <p>μ°Έκ°μλ€μκ² κ±΄λ°° μ μμ ν  μ μμ΅λλ€.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-game"></div>
          <div className="tu-exp">
            <p>κ²μ μ ν λ²νΌ</p>
            <p>κ²μ μ ν νμ΄μ§λ‘ μ΄λν©λλ€.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-mic"></div>
          <div className="tu-exp">
            <p>μ€λμ€ λ²νΌ</p>
            <p>μ¬μ©μμ λ§μ΄ν¬λ₯Ό ON/OFF ν  μ μμ΅λλ€.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-video"></div>
          <div className="tu-exp">
            <p>μΉ΄λ©λΌ λ²νΌ</p>
            <p>μ¬μ©μμ μΉ΄λ©λΌλ₯Ό ON/OFF ν  μ μμ΅λλ€.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-chat"></div>
          <div className="tu-exp">
            <p>μ±ν λ²νΌ</p>
            <p>μ±νμ°½μ νμ±ν ν  μ μμ΅λλ€.</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
