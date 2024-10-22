import Game from "@/components/game";
import GameServer from "@/components/server-views/GameServer";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="max-w-screen-lg min-h-screen px-4 m-auto py-5 flex flex-col">
      <Suspense fallback={<GameServer />}>
        <Game />
      </Suspense>
    </div>
  );
}
