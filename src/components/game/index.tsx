"use client";
import { GameProvider, useGameContext } from "./context";
import Search from "./Search";
import Table from "./Table";
import { RestartAlt } from "@mui/icons-material";

export default function Game() {
  return (
    <GameProvider>
      <Search />
      <Actions />
      <Status />
      <Table />
    </GameProvider>
  );
}

function Actions() {
  const { resetGame } = useGameContext();
  return (
    <div className="flex gap-4 justify-end">
      <button
        className="bg-slate-900 text-white hover:bg-slate-800 p-2 rounded-md"
        onClick={resetGame}
      >
        <RestartAlt />
      </button>
    </div>
  );
}

function Status() {
  const { state } = useGameContext();
  return (
    <>
      {state === "win" && (
        <div className="text-green-500 p-2 rounded-md text-center text-xl">
          VICTORIA
        </div>
      )}
    </>
  );
}
