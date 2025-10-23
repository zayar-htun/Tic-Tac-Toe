import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { socket } from "../socket";

export default function NicknameForm({ onReady }) {
  const [nickname, setNickname] = useState("");

  const handleContinue = () => {
    const name = nickname.trim();
    if (!name) return;
    // socket.emit("register", name);
    localStorage.setItem("tt_nickname", name);
    socket.emit("register", name);
    onReady(name);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 32%, rgba(255,255,255,0.03) 33%, rgba(255,255,255,0.03) 33.33%),
            repeating-linear-gradient(90deg, transparent, transparent 32%, rgba(255,255,255,0.03) 33%, rgba(255,255,255,0.03) 33.33%)
          `,
          animation: "gridPulse 3s ease-in-out infinite",
          pointerEvents: "none",
        },
        "&::after": {
          content: '"✕ ○ ✕ ○"',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "8rem",
          opacity: 0.03,
          fontWeight: 900,
          letterSpacing: "2rem",
          whiteSpace: "nowrap",
          animation: "symbolFloat 20s linear infinite",
          pointerEvents: "none",
        },
        "@keyframes gridPulse": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.6 },
        },
        "@keyframes symbolFloat": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(45deg, #FFD700, #FFA500, #FF6347)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontStyle: "italic",
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
              paintOrder: "stroke fill",
              transform: "skewX(-5deg)",
              fontSize: "2rem",
            }}
          >
            TIC-TAC-TOE
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: "rgba(61,61,61,1)",
              fontWeight: 600,
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
              letterSpacing: "0.02em",
              fontStyle: "italic",
              textDecoration: "none",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: "0",
                right: "0",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #FFD700, transparent)",
              },
            }}
          >
            Enter your nickname to start playing
          </Typography>
          <TextField
            fullWidth
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            sx={{
              my: 3,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255, 255, 255, 0.05)",
                color: "rgba(61, 61, 61, 1)",
                borderRadius: "12px",
                fontWeight: 600,
                transition: "all 0.25s ease",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFD700",
                  boxShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFD700",
                  boxShadow: "0 0 12px rgba(255, 215, 0, 0.8)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 500,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#FFD700",
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            disabled={!nickname.trim()}
            sx={{
              height: "56px",
              borderRadius: "28px",
              background: "rgba(61, 61, 61, 1)",
              color: "#ffffffff",
              fontSize: "1.125rem",
              fontWeight: 700,
              border: "2px solid rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(8px)",
              textTransform: "none",
              "&:hover": {
                background: "rgba(85, 0, 86, 1)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
              transition: "all 0.2s",
            }}
          >
            Continue
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
