import { usePageContext } from "@/components/context";
import { SearchAnime } from "@/components/game/context";
import { getRandomByArray } from "@/components/utils/functions";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetAnimesRelatedToAL } from "../queries/getAnimesRelatedTo";
import { Media } from "@/types/animes-related-al";

type AniCoverStatus =
  | "loading"
  | "init"
  | "stale"
  | "playing"
  | "win"
  | "end"
  | "win-round"
  | "error-round";

type AniCoverContextType = {
  answer?: SearchAnime | null;
  setAnswer: (answer: SearchAnime | null) => void;
  isLoading: boolean;
  status: AniCoverStatus;
  selectedAnimes: SearchAnime[];
  addAnime: (anime: SearchAnime) => void;
  restartGame: () => void;
  relatedAnimes: Media[];
};

const AniCoverContext = createContext<AniCoverContextType>({
  answer: null,
  setAnswer: () => {},
  isLoading: true,
  status: "loading",
  selectedAnimes: [],
  addAnime: () => {},
  restartGame: () => {},
  relatedAnimes: [],
});

export function AniCoverProvider({ children }: React.PropsWithChildren) {
  const [answer, setAnswer] = useState<SearchAnime | null>(null);
  const [status, setStatus] = useState<AniCoverStatus>("loading");
  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);

  const { animes, isLoading: isPageLoading } = usePageContext();

  const { data: relatedAnimes } = useGetAnimesRelatedToAL(answer?.id);

  const addAnime = (anime: SearchAnime) => {
    if (!answer) return;
    if (selectedAnimes.some((a) => a.id === anime.id)) return;
    setSelectedAnimes((prev) => [anime, ...prev]);
    if (answer.id === anime.id) {
      setStatus("win");
    }
  };

  const restartGame = () => {
    initAniCover();
  };

  const initAniCover = useCallback(() => {
    setStatus("loading");
    const animeAnswer = getRandomByArray(animes);
    if (!animeAnswer) return;
    setAnswer(animeAnswer);
    setStatus("playing");
    setSelectedAnimes([]);
  }, [animes]);

  useEffect(() => {
    initAniCover();
  }, [initAniCover]);

  return (
    <AniCoverContext.Provider
      value={{
        answer,
        setAnswer,
        isLoading: isPageLoading,
        status,
        selectedAnimes,
        addAnime,
        restartGame,
        relatedAnimes: relatedAnimes ?? [],
      }}
    >
      {children}
    </AniCoverContext.Provider>
  );
}

export function useAniCoverContext() {
  return useContext(AniCoverContext);
}
