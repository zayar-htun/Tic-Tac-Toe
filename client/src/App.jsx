import React, { useCallback, useEffect, useRef, useState } from "react";
import NicknameForm from "./components/NicknameForm";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import { socket } from "./socket";
import { getGames } from "./api";

const LS = {
  NICKNAME: "tt_nickname",
  GAME: "tt_game",
  BOARD: "tt_board",
};

const readJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return null;
  }
};

const removeLS = (...keys) => keys.forEach((k) => localStorage.removeItem(k));

function App() {
  const [page, setPage] = useState("nickname");
  const [nickname, setNickname] = useState("");
  const [games, setGames] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [gameState, setGameState] = useState(null);
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameEndDialog, setGameEndDialog] = useState(false);
  const [winner, setWinner] = useState("");

  const mountedRef = useRef(true);
  const symbolRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchGames = useCallback(async () => {
    try {
      const { status, data } = await getGames();
      if (status && mountedRef.current)
        setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem(LS.NICKNAME);
    if (savedName) {
      setNickname(savedName);
      socket.emit("register", savedName);
      setPage("main");
    }

    const savedGame = readJSON(LS.GAME);
    if (savedGame?.gameId) {
      socket.emit("rejoinGame", { gameId: savedGame.gameId });
      symbolRef.current = savedGame.symbol ?? null;
    }

    const savedBoard = readJSON(LS.BOARD);
    if (Array.isArray(savedBoard) && savedBoard.length === 9) {
      setBoard(savedBoard);
    }

    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    const onConnect = () => {
      const savedName = localStorage.getItem(LS.NICKNAME);
      const savedGame = readJSON(LS.GAME);
      if (savedName) socket.emit("register", savedName);
      if (savedGame?.gameId)
        socket.emit("rejoinGame", { gameId: savedGame.gameId });
    };

    socket.on("connect", onConnect);
    return () => socket.off("connect", onConnect);
  }, []);

  const goBackToLobby = useCallback(() => {
    removeLS(LS.GAME, LS.BOARD);
    setGameState(null);
    symbolRef.current = null;
    setIsMyTurn(false);
    setPage("main");
    fetchGames();
  }, [fetchGames]);

  const onWaiting = useCallback(() => setWaiting(true), []);

  const onGameStart = useCallback((data) => {
    setWaiting(false);
    setGameState(data);
    symbolRef.current = data.symbol ?? null;
    setIsMyTurn(Boolean(data.isYourTurn));
    const freshBoard = Array(9).fill(null);
    setBoard(freshBoard);

    writeJSON(LS.GAME, { gameId: data.gameId, symbol: data.symbol });
    writeJSON(LS.BOARD, freshBoard);

    setPage("game");
  }, []);

  const onBoardUpdate = useCallback((newBoard) => {
    if (!Array.isArray(newBoard) || newBoard.length !== 9) return;
    setBoard(newBoard);
    writeJSON(LS.BOARD, newBoard);
  }, []);

  const onTurnChange = useCallback((currentPlayerSymbol) => {
    const me = symbolRef.current;
    if (!me) return;
    setIsMyTurn(currentPlayerSymbol === me);
  }, []);

  const onGameEnd = useCallback(
    ({ winnerName }) => {
      setWinner(winnerName || "");
      setGameEndDialog(true);
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setGameEndDialog(false);
        goBackToLobby();
      }, 2200);
      return () => clearTimeout(t);
    },
    [goBackToLobby]
  );

  const onOpponentDisconnected = useCallback(() => {
    alert("Opponent disconnected!");
    goBackToLobby();
  }, [goBackToLobby]);

  const onOnlineUsers = useCallback((users) => {
    setOnlineUsers(Array.isArray(users) ? users : []);
  }, []);

  const onRejoinSuccess = useCallback(
    ({ meta, board: restoredBoard, isYourTurn }) => {
      setGameState(meta || null);
      symbolRef.current = meta?.symbol ?? null;

      const nextBoard =
        Array.isArray(restoredBoard) && restoredBoard.length === 9
          ? restoredBoard
          : Array(9).fill(null);
      setBoard(nextBoard);
      setIsMyTurn(Boolean(isYourTurn));

      writeJSON(LS.GAME, { gameId: meta?.gameId, symbol: meta?.symbol });
      writeJSON(LS.BOARD, nextBoard);

      setPage("game");
    },
    []
  );

  useEffect(() => {
    socket.on("waiting", onWaiting);
    socket.on("gameStart", onGameStart);
    socket.on("boardUpdate", onBoardUpdate);
    socket.on("turnChange", onTurnChange);
    socket.on("gameEnd", onGameEnd);
    socket.on("opponentDisconnected", onOpponentDisconnected);
    socket.on("onlineUsers", onOnlineUsers);
    socket.on("rejoinSuccess", onRejoinSuccess);
    socket.on("gameState", onRejoinSuccess);

    return () => {
      socket.off("waiting", onWaiting);
      socket.off("gameStart", onGameStart);
      socket.off("boardUpdate", onBoardUpdate);
      socket.off("turnChange", onTurnChange);
      socket.off("gameEnd", onGameEnd);
      socket.off("opponentDisconnected", onOpponentDisconnected);
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("rejoinSuccess", onRejoinSuccess);
      socket.off("gameState", onRejoinSuccess);
    };
  }, [
    onWaiting,
    onGameStart,
    onBoardUpdate,
    onTurnChange,
    onGameEnd,
    onOpponentDisconnected,
    onOnlineUsers,
    onRejoinSuccess,
  ]);

  const handleNicknameReady = useCallback(
    (name) => {
      setNickname(name);
      localStorage.setItem(LS.NICKNAME, name);
      socket.emit("register", name);
      setPage("main");
      fetchGames();
    },
    [fetchGames]
  );

  const startGame = useCallback(() => {
    if (!nickname) return;
    setWaiting(true);
    socket.emit("startGame", nickname);
  }, [nickname]);

  const makeMove = useCallback(
    (index) => {
      if (!gameState || board[index] || !isMyTurn) return;
      socket.emit("makeMove", {
        gameId: gameState.gameId,
        index,
        symbol: symbolRef.current,
      });
    },
    [board, isMyTurn, gameState]
  );

  useEffect(() => {
    if (gameState?.gameId) {
      writeJSON(LS.GAME, {
        gameId: gameState.gameId,
        symbol: gameState.symbol,
      });
      symbolRef.current = gameState.symbol ?? symbolRef.current;
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState?.gameId) writeJSON(LS.BOARD, board);
  }, [board, gameState?.gameId]);

  if (page === "nickname") {
    return <NicknameForm onReady={handleNicknameReady} />;
  }

  if (page === "main") {
    return (
      <Lobby
        nickname={nickname}
        waiting={waiting}
        games={games}
        onlineUsers={onlineUsers}
        onStartGame={startGame}
      />
    );
  }

  if (page === "game") {
    return (
      <GameBoard
        nickname={nickname}
        gameState={gameState}
        board={board}
        isMyTurn={isMyTurn}
        onCellClick={makeMove}
        gameEndDialog={gameEndDialog}
        winner={winner}
      />
    );
  }

  return null;
}

export default App;
