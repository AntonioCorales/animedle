import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { formatAnimes, useGetAndFormatAnimes } from "../utils/useGetAnime";
import { getRandomByArray } from "../utils/functions";
import { usePageContext } from "../context";

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
  const { user } = usePageContext();
  const { data, isLoading } = useGetAnimeByUser(user);
  
  const [animes, setAnimes] = useState<SearchAnime[]>([]);
  const [anime, setAnime] = useState(getRandomByArray(animes));
  console.log({anime});

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

  useEffect(() => {
    const animes = formatAnimes(data, {tagsLimit: 4, types: ["Completed"]});
    setAnimes(animes);
    setAnime(getRandomByArray(animes));
  }, [data]);

  const resetGame = () => {
    setAnime(getRandomByArray(animes));
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