"use client";
import AnimeDleGame from "@/components/game";
import { GameProvider } from "@/components/game/context";
import { CounterProvider } from "@/components/game/counter-context";

export default function Home() {
  return (
    <GameProvider>
      <CounterProvider>
        <AnimeDleGame />
      </CounterProvider>
    </GameProvider>
  );
}
