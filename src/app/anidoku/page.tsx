"use client";
import { useInitGame } from "@/components/anime-doku/function";

export default function AniDoku() {
  useInitGame(3);
  return <div>AniDoku</div>;
}
