import { useCharaAnimeContext } from "./context";
import Confetti from "../common/Confetti";

export function WinComponent() {
  const { status } = useCharaAnimeContext();
  return <Confetti active={status === "end"} />;
}
