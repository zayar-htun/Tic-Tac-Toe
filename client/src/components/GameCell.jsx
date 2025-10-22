import React from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const Cell = styled(Paper)(({ theme }) => ({
  width: 100,
  height: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "2.5rem",
  fontWeight: "bold",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    fontSize: "1.5rem",
  },
}));

export default function GameCell({ value, disabled, onClick }) {
  const color = value === "X" ? "#FFD700" : "purple";
  return (
    <Cell
      elevation={value ? 0 : 1}
      onClick={() => !disabled && onClick()}
      sx={{
        cursor: disabled ? "default" : "pointer",
        bgcolor: value ? "#f0f0f0" : "white",
        color,
      }}
    >
      {value}
    </Cell>
  );
}
