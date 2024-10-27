import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

type GameState = "stale" | "play" | "win";

type GameContextType = {
  animes?: SearchAnime[];
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
});

export function GameProvider({ children }: React.PropsWithChildren) {
  const { animes, isLoading } = useGetAndFormatAnimes("DoubleCReacts", {
    tagsLimit: 4,
    types: ["Completed"],
  });
  const anime = getRandomByArray(animes);

  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);
  const [selectedAnimesIds, setSelectedAnimesIds] = useState<number[]>([]);
  const [state, setState] = useState<GameState>("stale");
  const [showYears, setShowYears] = useState<boolean>(false);
  const [showMainGenre, setShowMainGenre] = useState<boolean>(false);
  const [showMainTag, setShowMainTag] = useState<boolean>(false);

  const addAnime = (anime: SearchAnime) => {
    setState("play");
    if (!selectedAnimesIds.includes(anime.id)) {
      setSelectedAnimesIds([...selectedAnimesIds, anime.id]);
      setSelectedAnimes([anime, ...selectedAnimes]);
    }
  };  

  const resetGame = () => {
    setState("stale");
    setSelectedAnimes([]);
    setSelectedAnimesIds([]);
    setShowMainGenre(false);
    setShowMainTag(false);
    setShowYears(false);    
  };  


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
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}

function useGetAnimeRandom(animes?: SearchAnime[] | null) {
  const [anime, setAnime] = useState<SearchAnime | null>();


  return { anime };
}
