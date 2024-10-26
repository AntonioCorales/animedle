import { createContext, useContext, useEffect, useState } from "react";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { formatAnimes, useGetAndFormatAnimes } from "../utils/useGetAnime";
import { getRandomByArray } from "../utils/functions";

export type SearchAnime = {
  id: number;
  idMal: number;
  name: string;
  englishName?: string | null;
  altNames: string[];
  image: string;
  genres: string[];
  tags: string[];
  episodes: number;
  seasonYear: number;
  season: string;
  format: string;
  description?: string | null;
};

type GameState = "play" | "win";

type GameContextType = {
  animes?: SearchAnime[] ;
  anime?: SearchAnime | null;
  selectedAnimes: SearchAnime[];
  selectedAnimesIds: number[];
  addAnime: (anime: SearchAnime) => void;
  resetGame: () => void;
  state: GameState;
  setState: (state: GameState) => void;
  showYears: boolean;
  setShowYears: (showYears: boolean) => void;
  showMainGenre: boolean;
  setShowMainGenre: (showMainGenre: boolean) => void;
  showMainTag: boolean;
  setShowMainTag: (showMainTags: boolean) => void;
  counter: number;
};

const GameContext = createContext<GameContextType>({
  animes: [],
  selectedAnimes: [],
  addAnime: () => {},
  selectedAnimesIds: [],
  resetGame: () => {},
  state: "play",
  setState: () => {},
  showYears: false,
  setShowYears: () => {},
  showMainGenre: false,
  setShowMainGenre: () => {},
  showMainTag: false,
  setShowMainTag: () => {},
  counter: 0,
});

export function GameProvider({ children }: React.PropsWithChildren) {
  const { animes, isLoading } = useGetAndFormatAnimes("DoubleCReacts", {
    tagsLimit: 5,
    types: ["Completed"],
  });
  const [anime, setAnime] = useState<SearchAnime | null>(getRandomByArray(animes));
  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);
  const [selectedAnimesIds, setSelectedAnimesIds] = useState<number[]>([]);
  const [state, setState] = useState<GameState>("play");
  const [showYears, setShowYears] = useState<boolean>(false);
  const [showMainGenre, setShowMainGenre] = useState<boolean>(false);
  const [showMainTag, setShowMainTag] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const addAnime = (anime: SearchAnime) => {
    if (!selectedAnimesIds.includes(anime.id)) {
      setSelectedAnimesIds([...selectedAnimesIds, anime.id]);
      setSelectedAnimes([anime, ...selectedAnimes]);
    }
  };

  const resetGame = () => {
    setState("play");
    setSelectedAnimes([]);
    setSelectedAnimesIds([]);
    setShowMainGenre(false);
    setShowMainTag(false);
    setShowYears(false);
    setCounter(0);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (state === "play") {
        setCounter((counter) => counter + 1);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [counter, state]);

 

  return (
    <GameContext.Provider
      value={{
        animes,
        anime,
        selectedAnimes,
        addAnime,
        selectedAnimesIds,
        resetGame,
        state,
        setState,
        showYears,
        setShowYears,
        showMainGenre,
        setShowMainGenre,
        showMainTag,
        setShowMainTag,
        counter,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
