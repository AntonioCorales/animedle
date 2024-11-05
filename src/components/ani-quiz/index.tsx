"use client";

import { CounterProvider } from "../game/counter-context";
import { AniQuizProvider } from "./context";
import AniQuizGame from "./game";

export default function AniQuiz() {
  return (
    <AniQuizProvider>
      <CounterProvider>
        <AniQuizGame />
      </CounterProvider>
    </AniQuizProvider>
  );
}
