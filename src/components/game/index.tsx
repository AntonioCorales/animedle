"use client";
import ConfettiExplosion from "react-confetti";
import { GameProvider, useGameContext } from "./context";
import Search from "./Search";
import Table from "./Table";
import { RestartAlt } from "@mui/icons-material";

export default function Game() {
  return (
    <GameProvider>
      <header className="flex flex-col gap-8 sticky top-0 pt-6 bg-[#0a0a0a] z-[999]">
        <h1 className="text-4xl font-bold text-center">AnimeDle</h1>
        <div className="flex flex-col gap-4">
          <Search />
          <Actions />
          <Status />
        </div>
      </header>
      <Table />
      <WinComponent />
    </GameProvider>
  );
}

function Actions() {
  const {
    resetGame,
    setState,
    selectedAnimes,
    setShowYears,
    setShowMainGenre,
    setShowMainTag,
  } = useGameContext();
  const { length } = selectedAnimes;
  return (
    <div className="flex gap-4 justify-between">
      <div className="flex flex-col lg:flex-row lg:gap-4  lg:items-center">
        {length >= 4 && (
          <label className="flex gap-2">
            <input
              type="checkbox"
              onChange={(e) => setShowYears(e.target.checked)}
            />
            Ver años
          </label>
        )}
        {length >= 6 && (
          <label className="flex gap-2">
            <input
              type="checkbox"
              onChange={(e) => setShowMainGenre(e.target.checked)}
            />
            Ver género principal
          </label>
        )}
        {length >= 8 && (
          <label className="flex gap-2">
            <input
              type="checkbox"
              onChange={(e) => setShowMainTag(e.target.checked)}
            />
            Ver etiqueta principal
          </label>
        )}
      </div>
      <div className="flex gap-2 justify-center items-start">
        <button
          className="bg-slate-900 text-white hover:bg-slate-800 p-2 rounded-md z-10"
          onClick={resetGame}
        >
          <RestartAlt />
        </button>
        {/* <button
          onClick={() => setState("win")}
          className="bg-green-500 p-2 rounded-md"
        >
          win
        </button> */}
      </div>
    </div>
  );
}

function Status() {
  const { state, counter, selectedAnimes } = useGameContext();
  const { length } = selectedAnimes;
  return (
    <div className="flex flex-row gap-2 justify-between items-end">
      <div>Tiempo: {counter}s</div>
      {state === "win" && (
        <div className="text-green-500 p-2 rounded-md text-center font-bold">
          ¡VICTORIA!
        </div>
      )}
      <div className="text-green-400">{length} intento(s)</div>
    </div>
  );
}

function WinComponent() {
  const { state } = useGameContext();


  return (
    <>{state === "win" && <ConfettiExplosion style={{ zIndex: 1000, width: "90vw", height: "100vh", marginInline:"auto" }} />}</>
  );
}
