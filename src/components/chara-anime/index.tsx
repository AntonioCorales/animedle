"use client";
import { CounterProvider } from "../game/counter-context";
import { CharaAnimeProvider } from "./context";
import CharaAnimeGame from "./game";

export default function CharaAnime() {
  return (
    <CharaAnimeProvider>
      <CounterProvider>
        <CharaAnimeGame />
      </CounterProvider>
    </CharaAnimeProvider>
  );
}
