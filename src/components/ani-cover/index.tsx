"use client";

import { AniCoverProvider } from "@/components/ani-cover/context";
import { CounterProvider } from "../game/counter-context";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AniCoverGame = dynamic(() => import("./game"), { ssr: false });


export default function AniCover() {
    return (
      <AniCoverProvider>
        <CounterProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AniCoverGame />
          </Suspense>
        </CounterProvider>
      </AniCoverProvider>
    );
  }