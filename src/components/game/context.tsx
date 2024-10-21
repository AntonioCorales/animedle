import { createContext, useContext, useEffect, useState } from "react";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";

export type SearchAnime = {
  id: string;
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
};

type GameState = "play" | "win";

type GameContextType = {
  animes?: SearchAnime[];
  anime?: SearchAnime;
  selectedAnimes: SearchAnime[];
  selectedAnimesIds: string[];
  addAnime: (anime: SearchAnime) => void;
  resetGame: () => void;
  state: GameState;
  setState: (state: GameState) => void;
};

const GameContext = createContext<GameContextType>({
  animes: [],
  selectedAnimes: [],
  addAnime: () => {},
  selectedAnimesIds: [],
  resetGame: () => {},
  state: "play",
  setState: () => {},
});

export function GameProvider({ children }: React.PropsWithChildren) {
  const { data } = useGetAnimeByUser("DoubleCReacts");
  const [animes, setAnimes] = useState<SearchAnime[]>([]);
  const [anime, setAnime] = useState<SearchAnime>();
  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);
  const [selectedAnimesIds, setSelectedAnimesIds] = useState<string[]>([]);
  const [state, setState] = useState<GameState>("play");


  useEffect(() => {
    if (data) {
      const listCompletedAnimes = data.lists.find(
        (list) => list.name === "Completed"
      );

      if (listCompletedAnimes) {
        const completedAnimes = listCompletedAnimes.entries.map((entry) => {
          const { media } = entry;
          const altNames = [media.title.romaji.toLowerCase()];

          if (media.title.english) {
            altNames.push(media.title.english.toLowerCase());
            altNames.push(media.title.english);
          }

          return {
            id: media.idMal.toString(),
            name: media.title.romaji,
            englishName: media.title.english,
            altNames,
            image: media.coverImage.large,
            genres: media.genres,
            tags: media.tags.map((tag) => tag.name).slice(0, 3),
            episodes: media.episodes,
            seasonYear: media.seasonYear,
            format: media.format,
            season: media.season,
          };
        });
        setAnimes(
          completedAnimes.toSorted((a, b) => {
            if (a.seasonYear === b.seasonYear) {
              return a.name.localeCompare(b.name);
            }
            return a.seasonYear - b.seasonYear;
          })
        );
        setAnime(
          completedAnimes[Math.floor(Math.random() * completedAnimes.length)]
        );
      }
    }
  }, [data]);

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
    setAnime(animes[Math.floor(Math.random() * animes.length)]);
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
