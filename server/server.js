require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(process.env.SQLITE_FILE, (err) => {
  if (err) {
    console.error("Database error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT NOT NULL,
    player2 TEXT NOT NULL,
    winner TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

let waitingPlayer = null;
let activeGames = new Map();
let onlineUsers = new Map();

app.get("/api/games", (req, res) => {
  db.all(
    "SELECT * FROM games ORDER BY created_at DESC LIMIT 20",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "Draw";
  }

  return null;
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (nickname) => {
    onlineUsers.set(socket.id, nickname);
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });

  socket.on("startGame", (nickname) => {
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      const gameId = `${waitingPlayer.id}-${socket.id}`;
      const game = {
        id: gameId,
        player1: { id: waitingPlayer.id, nickname: waitingPlayer.nickname },
        player2: { id: socket.id, nickname },
        board: Array(9).fill(null),
        currentPlayer: "X",
        status: "playing",
      };

      activeGames.set(gameId, game);

      waitingPlayer.socket.join(gameId);
      socket.join(gameId);

      waitingPlayer.socket.emit("gameStart", {
        gameId,
        symbol: "X",
        opponent: nickname,
        isYourTurn: true,
      });

      socket.emit("gameStart", {
        gameId,
        symbol: "O",
        opponent: waitingPlayer.nickname,
        isYourTurn: false,
      });

      io.to(gameId).emit("boardUpdate", game.board);

      waitingPlayer = null;
    } else {
      waitingPlayer = { id: socket.id, nickname, socket };
      socket.emit("waiting");
    }
  });

  socket.on("makeMove", ({ gameId, index, symbol }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    if (game.board[index] !== null || game.status !== "playing") return;
    if (
      (symbol === "X" && game.currentPlayer !== "X") ||
      (symbol === "O" && game.currentPlayer !== "O")
    )
      return;

    game.board[index] = symbol;
    game.currentPlayer = symbol === "X" ? "O" : "X";

    const winner = checkWinner(game.board);
    if (winner) {
      game.status = "finished";
      const winnerName =
        winner === "X"
          ? game.player1.nickname
          : winner === "O"
          ? game.player2.nickname
          : "Draw";

      db.run(
        "INSERT INTO games (player1, player2, winner) VALUES (?, ?, ?)",
        [game.player1.nickname, game.player2.nickname, winnerName],
        (err) => {
          if (err) console.error("Database insert error:", err);
        }
      );

      io.to(gameId).emit("gameEnd", { winner, winnerName });
    } else {
      io.to(gameId).emit("boardUpdate", game.board);
      io.to(gameId).emit("turnChange", game.currentPlayer);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    onlineUsers.delete(socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.values()));

    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    activeGames.forEach((game, gameId) => {
      if (game.player1.id === socket.id || game.player2.id === socket.id) {
        io.to(gameId).emit("opponentDisconnected");
        activeGames.delete(gameId);
      }
    });
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
