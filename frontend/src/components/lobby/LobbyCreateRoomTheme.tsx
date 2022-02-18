import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const images = [
  {
    label: "전통술집",
    imgPath: "/images/room/1.jpg",
  },
  {
    label: "이자카야",
    imgPath: "/images/room/2.jpg",
  },
  {
    label: "놀이터",
    imgPath: "/images/room/3.jpg",
  },
  {
    label: "모던바",
    imgPath: "/images/room/4.jpg",
  },
  {
    label: "클럽",
    imgPath: "/images/room/5.jpg",
  },
];

export default function LobbyCreateRoomTheme({ onChange }: any) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onChange(activeStep + 2);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onChange(activeStep);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <TextField
        margin="dense"
        id="name"
        label="테마"
        fullWidth
        variant="standard"
        name="title"
        value={images[activeStep].label}
        color="primary"
      />
      {images.map((step, index) => (
        <div key={step.label}>
          {activeStep - index === 0 ? (
            <Box
              component="img"
              sx={{
                height: "255px",
                display: "block",
                maxWidth: 400,
                overflow: "hidden",
                width: "500px",
              }}
              src={step.imgPath}
              alt={step.label}
            />
          ) : null}
        </div>
      ))}
      <MobileStepper
        variant="dots"
        steps={5}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1 }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === 4}
            color="primary"
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            color="primary"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}
