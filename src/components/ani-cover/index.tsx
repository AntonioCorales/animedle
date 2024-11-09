"use client";

import { AniCoverProvider } from "@/components/ani-cover/context";
import { CounterProvider } from "../game/counter-context";
import AniCoverGame from "./game";


export default function AniCover() {
    return (
      <AniCoverProvider>
        <CounterProvider>
          <AniCoverGame />
        </CounterProvider>
      </AniCoverProvider>
    );
  }