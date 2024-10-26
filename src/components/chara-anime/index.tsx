"use client";
import { CharaAnimeProvider } from "./context";
import CharaAnimeGame from "./game";

export default function CharaAnime() {
  return (
    <CharaAnimeProvider>
      <CharaAnimeGame />
    </CharaAnimeProvider>
  );
}
