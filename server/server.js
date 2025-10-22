const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./tictactoe.db", (err) => {
  if (err) {
    console.error("Database error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
