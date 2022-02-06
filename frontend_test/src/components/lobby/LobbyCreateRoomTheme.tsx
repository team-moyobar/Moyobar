import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";

const images = [
  {
    label: '전통술집',
    imgPath:
      '/assets/images/theme1.png'
  },
  {
    label: '유치원',
    imgPath:
      '/assets/images/theme2.png'
  },
  {
    label: 'MT',
    imgPath:
      '/assets/images/theme3.png'
  },
  {
    label: '밤의 놀이터',
    imgPath:
      '/assets/images/theme4.png'
  },
  {
    label: '클럽',
    imgPath:
      '/assets/images/theme5.png'
  },
]

export default function LobbyCreateRoomTheme({onChange}: any) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onChange(activeStep + 2)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onChange(activeStep)
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <TextField
            autoFocus
            margin="dense"
            id="name"
            label="테마"
            fullWidth
            variant="standard"
            name="title"
            value={images[activeStep].label}
            color='secondary'
          />
      {images.map((step, index) => (
          <div key={step.label}>
            {(activeStep - index) == 0 ? (
              <Box
                component="img"
                sx={{
                  height: 255,
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: '100%',
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
          <Button size="small" onClick={handleNext} disabled={activeStep === 4} color='secondary'>
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0} color='secondary'>
            {theme.direction === 'rtl' ? (
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