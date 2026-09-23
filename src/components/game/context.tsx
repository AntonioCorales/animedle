import { createContext,  useContext, useEffect, useState } from "react";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { formatAnimes, } from "../utils/useGetAnime";
import { getRandomByArray } from "../utils/functions";
import { usePageContext } from "../context";
import { MediaRelationNode } from "@/types/anime";

export type SearchAnimeRelation = {
  id: number;
  idMal: number;
  name: string;
  englishName?: string | null;
}

export type SearchAnime = {
  id: number;
  idMal: number;
  name: string;
  englishName?: string | null;
  altNames: string[];
  image: string;
  image_large: string;
  genres: string[];
  tags: string[];
  episodes: number;
  seasonYear: number;
  season: string;
  format: string;
  description?: string | null;
  studios: Studio[];
  relations: SearchAnimeRelation[];
};

type Studio = {
  id: number;
  name: string;
  isAnimationStudio: boolean;
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
  revealedYears: boolean;
  revealYears: () => void;
  revealedMainGenre: boolean;
  revealMainGenre: () => void;
  revealedMainTag: boolean;
  revealMainTag: () => void;
};

const GameContext = createContext<GameContextType>({
  animes: [],
  selectedAnimes: [],
  addAnime: () => {},
  selectedAnimesIds: [],
  resetGame: () => {},
  state: "play",
  setState: () => {},
  revealedYears: false,
  revealYears: () => {},
  revealedMainGenre: false,
  revealMainGenre: () => {},
  revealedMainTag: false,
  revealMainTag: () => {},
});

export function GameProvider({ children }: React.PropsWithChildren) {
  const { user, listNames, formats } = usePageContext();
  const { data, isLoading } = useGetAnimeByUser(user);

  const [animes, setAnimes] = useState<SearchAnime[]>([]);
  const [anime, setAnime] = useState(getRandomByArray(animes));

  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);
  const [selectedAnimesIds, setSelectedAnimesIds] = useState<number[]>([]);
  const [state, setState] = useState<GameState>("stale");
  const [revealedYears, setRevealedYears] = useState<boolean>(false);
  const [revealedMainGenre, setRevealedMainGenre] = useState<boolean>(false);
  const [revealedMainTag, setRevealedMainTag] = useState<boolean>(false);

  const addAnime = (anime: SearchAnime) => {
    setState("play");
    if (!selectedAnimesIds.includes(anime.id)) {
      setSelectedAnimesIds([...selectedAnimesIds, anime.id]);
      setSelectedAnimes([anime, ...selectedAnimes]);
    }
  };

  useEffect(() => {
    const animes = formatAnimes(data, {
      tagsLimit: 4,
      types: listNames,
      formats,
    });
    setAnimes(animes);
    setAnime(getRandomByArray(animes));
  }, [data, formats, listNames]);

  const resetGame = () => {
    setAnime(getRandomByArray(animes));
    setState("stale");
    setSelectedAnimes([]);
    setSelectedAnimesIds([]);
    setRevealedMainGenre(false);
    setRevealedMainTag(false);
    setRevealedYears(false);
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
        revealedYears,
        revealYears: () => setRevealedYears(true),
        revealedMainGenre,
        revealMainGenre: () => setRevealedMainGenre(true),
        revealedMainTag,
        revealMainTag: () => setRevealedMainTag(true),
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}