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
      <Container sx={{ py: 4, minHeight: "100vh" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
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
            }}
          >
            ⚡ Battle Arena ⚡
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
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
            Player <span style={{ color: "#FFD700" }}> {nickname}</span> has
            entered the game!
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
    </Box>
  );
}
