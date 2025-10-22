import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import GameCell from "./GameCell";

export default function GameBoard({
  nickname,
  gameState,
  board,
  isMyTurn,
  onCellClick,
  gameEndDialog,
  winner,
}) {
  const [animateTitle, setAnimateTitle] = useState(false);
  const [animatePlayers, setAnimatePlayers] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateTitle(true), 100);
    setTimeout(() => setAnimatePlayers(true), 400);
  }, []);

  if (!gameState) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9))",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: "1rem", sm: "2rem", md: "3rem" },
            fontWeight: 600,
            userSelect: "none",
            color: "rgba(37,37,37,1)",
            textShadow: "0 0 8px #FFD700",
            transform: animateTitle ? "scale(1)" : "scale(0.8)",
            opacity: animateTitle ? 1 : 0,
            transition: "all 0.6s ease-out",
          }}
        >
          Tic - Tac - Toe
        </Typography>

        <Box
          sx={{
            mb: 2,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            opacity: animatePlayers ? 1 : 0,
            transform: animatePlayers ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.6s ease-out 0.3s",
          }}
        >
          <Typography variant="subtitle2">
            You: {nickname} ({gameState.symbol})
          </Typography>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Typography variant="subtitle2">
            Opponent: {gameState.opponent}
          </Typography>
        </Box>
        <Chip
          label={isMyTurn ? "Your Turn" : "Opponent's Turn"}
          color={isMyTurn ? "success" : "default"}
          sx={{
            mb: 3,
            fontWeight: "bold",
            animation: isMyTurn ? "pulse 1.5s infinite ease-in-out" : "none",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        />

        <Grid
          container
          spacing={1}
          sx={{
            maxWidth: 320,
            mx: "auto",
            opacity: animatePlayers ? 1 : 0,
            transform: animatePlayers ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.5s",
          }}
        >
          {board.map((cell, index) => (
            <Grid size={4} key={index}>
              <GameCell
                value={cell}
                disabled={Boolean(cell) || !isMyTurn}
                onClick={() => onCellClick(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog
        open={gameEndDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            animation: gameEndDialog ? "popIn 0.4s ease-out" : "none",
            "@keyframes popIn": {
              "0%": { transform: "scale(0.8)", opacity: 0 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          },
        }}
      >
        <DialogTitle>
          {winner === "Draw"
            ? "Draw!"
            : winner === nickname
            ? "You Win!"
            : "You Lose!"}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color:
                winner === "Draw"
                  ? "text.secondary"
                  : winner === nickname
                  ? "success.main"
                  : "error.main",
              fontWeight: 700,
              animation: "fadeIn 0.6s ease-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(10px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
