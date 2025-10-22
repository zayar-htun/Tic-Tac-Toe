# 🎮 TicTacToe – Real-Time Multiplayer Game

A full-stack Tic-Tac-Toe application built using **Node.js (Express + Socket.IO)** for the backend and **React (Vite + MUI)** for the frontend.  
It enables **real-time multiplayer gameplay**, **matchmaking**,**nickname**,**active user**, **game history (SQLite)**, and **rejoin persistence** via `localStorage`.

---



## ⚙️ Setup Requirements

### Prerequisites

- **Node.js** (v18+ or v20+ recommended)
- **npm** (v9+)
- No external database required — uses **SQLite** (auto-created file).

---

## 📁 Environment Variables

### `server/.env`

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
SQLITE_FILE=./tictactoe.db
```

### `client/.env`

```env
VITE_SOCKET_URL=http://localhost:3001
```

---

## 🚀 Setup & Run

From the root folder:

```bash
# 1. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Start the server
cd server && npm run dev
# → Server runs on http://localhost:3001

# 3. Start the client (new terminal)
cd client && npm run dev
# → Client runs on http://localhost:5173
```

Open two browser tabs or share the URL with another player to test multiplayer functionality.

---

## 🌐 API Endpoints

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/api/games` | Fetches the latest 20 games |

---

## ⚡ Socket.IO Events

### Client → Server

- `register(nickname)` → Register a player
- `startGame(nickname)` → Start or queue a match
- `makeMove({ gameId, index, symbol })` → Make a move
- `rejoinGame({ gameId })` → Rejoin a previous game

### Server → Client

- `waiting` → Waiting for an opponent
- `gameStart({ gameId, symbol, opponent, isYourTurn })`
- `boardUpdate(board)`
- `turnChange(symbol)`
- `gameEnd({ winner, winnerName })`
- `opponentDisconnected`
- `onlineUsers([nicknames])`
- `rejoinSuccess({ meta, board, isYourTurn })`

---

## 🧠 Walkthrough

### Backend (`server/`)

- Built with **Express** + **Socket.IO**
- Persists finished games in **SQLite**
- Handles:
  - Matchmaking
  - Turn synchronization
  - Winner validation
  - Disconnect detection
- Stores data in a simple table:
  ```sql
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT NOT NULL,
    player2 TEXT NOT NULL,
    winner TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

### Frontend (`client/`)

- Built with **React (Vite)** and **MUI** for responsive UI.
- Handles nickname registration, lobby display, and gameplay board.
- Uses **Socket.IO client** for live updates.
- Stores nickname and game state in `localStorage` for persistence.

---

## 🧱 Technical Decisions

| Aspect               | Choice                | Reason                                |
| -------------------- | --------------------- | ------------------------------------- |
| **Database**         | SQLite                | Lightweight and easy for demos        |
| **Realtime**         | Socket.IO             | Simplicity and built-in reconnection  |
| **Frontend Tooling** | Vite                  | Fast and modern dev server            |
| **UI**               | MUI                   | Clean and responsive components       |
| **Persistence**      | localStorage          | Keeps nickname and board after reload |
| **CORS**             | Controlled via `.env` | Security and flexibility              |

---

## 🪶 .gitignore

```gitignore
node_modules/
server/.env
client/.env
*.log
server/*.db
server/*.sqlite*
client/dist/
```

---

## 🧰 Optional Docker Setup

```yaml
version: "3.9"
services:
  server:
    image: node:20
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    ports:
      - "3001:3001"
    volumes:
      - ./server:/app
    environment:
      - PORT=3001
      - CLIENT_ORIGIN=http://localhost:5173
      - SQLITE_FILE=./tictactoe.db

  client:
    image: node:20
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --host"
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
    environment:
      - VITE_SOCKET_URL=http://localhost:3001
    depends_on:
      - server
```

Run:

```bash
docker compose up
```

Then visit [http://localhost:5173](http://localhost:5173)

---

## 🔧 Troubleshooting

| Problem                   | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| **CORS Error**            | Ensure both `.env` URLs match exactly                   |
| **Socket Not Connecting** | Check `VITE_SOCKET_URL` and server port                 |
| **DB Missing**            | Server auto-creates `tictactoe.db`; ensure write access |
| **Port Conflict**         | Change ports in `.env` or run `vite --port 5174`        |
