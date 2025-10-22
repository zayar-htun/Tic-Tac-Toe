import React from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import PastGamesTable from "./PastGamesTable";
import OnlineUsers from "./OnlineUsers";

export default function Lobby({
  nickname,
  waiting,
  games,
  onlineUsers,
  onStartGame,
}) {
  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Multiplayer Tic-Tac-Toe
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome, {nickname}!
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onStartGame}
          disabled={waiting}
          sx={{
            mt: 2,
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
          {waiting ? "Waiting for opponent..." : "Start Game"}
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
          <PastGamesTable games={games} />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <OnlineUsers users={onlineUsers} me={nickname} />
        </Grid>
      </Grid>
    </Container>
  );
}
