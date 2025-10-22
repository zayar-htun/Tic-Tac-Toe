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
        <Typography variant="h4" gutterBottom>
          Welcome to Tic-Tac-Toe
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter your nickname to start playing
        </Typography>
        <TextField
          fullWidth
          label="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!nickname.trim()}
        >
          Continue
        </Button>
      </Paper>
    </Container>
  );
}
