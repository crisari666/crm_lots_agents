import React, { useEffect, useState } from "react";
import { LinearProgress, Typography, Box } from "@mui/material";

const TimerQr = ({ onTimeOver } : {onTimeOver: () => void}) => {
  const qrTime = 30;
  const [progress, setProgress] = useState(0);  // for LinearProgress value
  const [timeLeft, setTimeLeft] = useState(qrTime); // countdown time in seconds

  useEffect(() => {
    // Check if time is left to count
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setProgress((prev) => prev + (100 / qrTime)); // Increment progress per second
      }, 1000);

      return () => clearInterval(interval);  // Cleanup interval on unmount
    } else {
      onTimeOver();  // Execute function after timer ends
    }
  }, [timeLeft, onTimeOver]);

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 3 }}>
      <Typography variant="h6">Time Left: {timeLeft} seconds</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 10 }} />
    </Box>
  );
};

export default TimerQr;
