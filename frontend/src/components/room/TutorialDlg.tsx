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
        <h1>📙 서비스 가이드</h1>
        <div className="tu-contain">
          <div className="tu-beer"></div>
          <div className="tu-exp">
            <p>건배 버튼</p>
            <p>참가자들에게 건배 제안을 할 수 있습니다.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-game"></div>
          <div className="tu-exp">
            <p>게임 선택 버튼</p>
            <p>게임 선택 페이지로 이동합니다.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-mic"></div>
          <div className="tu-exp">
            <p>오디오 버튼</p>
            <p>사용자의 마이크를 ON/OFF 할 수 있습니다.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-video"></div>
          <div className="tu-exp">
            <p>카메라 버튼</p>
            <p>사용자의 카메라를 ON/OFF 할 수 있습니다.</p>
          </div>
        </div>
        <div className="tu-contain">
          <div className="tu-chat"></div>
          <div className="tu-exp">
            <p>채팅 버튼</p>
            <p>채팅창을 활성화 할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
