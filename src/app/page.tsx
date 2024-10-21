import Game from "@/components/game";
import GameServer from "@/components/server-views/GameServer";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="max-w-screen-lg h-screen px-4 m-auto py-10 flex flex-col gap-4 overflow-x-hidden">
      <h1 className="text-4xl font-bold text-center">AnimeDle</h1>
      <Suspense fallback={<GameServer />}>
        <Game />
      </Suspense>
    </div>
  );
}
