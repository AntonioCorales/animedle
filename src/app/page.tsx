"use client";
import AnimeDleGame from "@/components/game";
import { GameProvider } from "@/components/game/context";

export default function Home() {
  return (
    <GameProvider>
      <AnimeDleGame />
    </GameProvider>
  );
}
