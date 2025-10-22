import React from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import BalanceIcon from "@mui/icons-material/Balance";

const BOARD_BG = "rgba(37,27,37,1)";  
const GOLD = "#FFD700"; 

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: BOARD_BG,
    color: GOLD,
    fontWeight: 700,
    letterSpacing: 0.2,
    borderBottom: `1px solid ${alpha("#000", 0.15)}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
  "&:hover": {
    background: alpha(BOARD_BG, 0.04),
    transform: "translateY(-1px)",
    transition: "all .15s ease",
    boxShadow: `0 4px 18px ${alpha(BOARD_BG, 0.1)}`,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PlayerCell = ({ name }) => {
  const initial = (name || "").trim().charAt(0).toUpperCase() || "?";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          fontSize: 14,
          fontWeight: 700,
          bgcolor: alpha(BOARD_BG, 0.08),
          color: BOARD_BG,
          border: `1px solid ${alpha(BOARD_BG, 0.2)}`,
          boxShadow: `inset 0 0 0 2px ${alpha(GOLD, 0.25)}`,
        }}
      >
        {initial}
      </Avatar>
      <Tooltip title={name} arrow>
        <Typography noWrap sx={{ maxWidth: 160, fontWeight: 600 }}>
          {name}
        </Typography>
      </Tooltip>
    </Box>
  );
};

const WinnerChip = ({ winner }) => {
  const isDraw = winner?.toLowerCase() === "draw";
  return (
    <Chip
      size="small"
      variant={isDraw ? "outlined" : "filled"}
      label={isDraw ? "Draw" : winner}
      icon={
        isDraw ? (
          <BalanceIcon sx={{ fontSize: 16 }} />
        ) : (
          <EmojiEventsIcon sx={{ fontSize: 16 }} />
        )
      }
      sx={{
        px: 0.5,
        fontWeight: 700,
        "& .MuiChip-icon": { ml: 0.5 },
        ...(isDraw
          ? {
              borderColor: alpha(BOARD_BG, 0.25),
              color: alpha(BOARD_BG, 0.9),
              backgroundColor: alpha(BOARD_BG, 0.03),
            }
          : {
              bgcolor: alpha("#22c55e", 0.18),
              color: "#166534",
            }),
      }}
    />
  );
};

export default function PastGamesTable({ games = [] }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        overflow: "hidden",
        backgroundImage: `linear-gradient(0deg, ${alpha(
          BOARD_BG,
          0.02
        )}, ${alpha(BOARD_BG, 0.02)}), 
           radial-gradient(circle at 25% -10%, ${alpha(
             GOLD,
             0.08
           )} 0%, transparent 35%), 
           radial-gradient(circle at 85% 120%, ${alpha(
             BOARD_BG,
             0.06
           )} 0%, transparent 35%)`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <SportsEsportsIcon sx={{ color: alpha(BOARD_BG, 0.9) }} />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Recent Games
        </Typography>
      </Box>

      <TableContainer
        sx={{
          borderRadius: 2,
          overflow: "auto",
          border: `1px solid ${alpha("#e0e0e0", 1)}`,
          maxHeight: 380,  
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Player 1</StyledTableCell>
              <StyledTableCell>Player 2</StyledTableCell>
              <StyledTableCell align="center">Winner</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {games.map((game) => (
              <StyledTableRow key={game.id}>
                <StyledTableCell>
                  <PlayerCell name={game.player1} />
                </StyledTableCell>

                <StyledTableCell>
                  <PlayerCell name={game.player2} />
                </StyledTableCell>

                <StyledTableCell align="center">
                  <WinnerChip winner={game.winner} />
                </StyledTableCell>

                <StyledTableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, letterSpacing: 0.2 }}
                  >
                    {new Date(game.created_at).toLocaleString()}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {games.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={4}>
                  <Box
                    sx={{
                      py: 5,
                      textAlign: "center",
                      border: "1px dashed",
                      borderColor: alpha(BOARD_BG, 0.2),
                      borderRadius: 2,
                      backgroundColor: alpha(BOARD_BG, 0.02),
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: alpha(BOARD_BG, 0.8) }}
                    >
                      No games yet — play your first match to see results here.
                    </Typography>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
