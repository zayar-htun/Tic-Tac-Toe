import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3.75rem", sm: "4.5rem", md: "6rem" },
            fontWeight: 900,
            letterSpacing: "-0.025em",
            userSelect: "none",
            color: "#FFD700",
            textShadow: `
              -4px -4px 0 #000,
              4px -4px 0 #000,
              -4px 4px 0 #000,
              4px 4px 0 #000,
              -2px -2px 0 #FFF,
              2px -2px 0 #FFF,
              -2px 2px 0 #FFF,
              2px 2px 0 #FFF,
              0 6px 20px rgba(0,0,0,0.3)
            `,
          }}
        >
          TIC-TAC-TOE
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: "1rem",
            color: "purple",
            fontWeight: 600,
            opacity: 0.9,
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
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
              color: "rgba(37, 37, 37, 1)",
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
            background: "rgba(37, 37, 37, 1)",
            color: "#FFD700",
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
      </Paper>
    </Container>
  );
}
