import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import NicknameForm from "./components/NicknameForm";
import { getGames } from "./api";

function App() {
  const [page, setPage] = useState("nickname");
  const [nickname, setNickname] = useState("");
  const [games, setGames] = useState([]);

  const fetchGames = useCallback(async () => {
    const { status, data } = await getGames();
    if (status) setGames(data);
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleNicknameReady = (name) => {
    setNickname(name);
    setPage("main");
    fetchGames();
  };
  return <NicknameForm onReady={handleNicknameReady} />;
}

export default App;
