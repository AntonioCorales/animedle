import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetCharactersByAnimeIdMAL } from "../queries/getCharactersByAnime";
import { CharacterData } from "@/types/characters";
import { usePageContext } from "../context";
import { SearchAnime } from "../game/context";
import { useGetAnimeRelated } from "../utils/useGetAnimeRelated";
import { getRandomByArray } from "../utils/functions";

type CharaAnimeStatus =
  | "loading"
  | "init"
  | "stale"
  | "playing"
  | "win"
  | "end"
  | "win-round"
  | "error-round"
  | "show-names";

type RoundData = {
  animes: MinAnimeData[];
  characters: CharacterData[];
  points: number;
  selectedAnimes: MinAnimeData[];
};

type MinAnimeData = {
  id: number;
  idMal: number;
  name: string;
  englishName?: string | null;
};

export type CharaAnimeContext = {
  animes: MinAnimeData[];
  characters: CharacterData[];
  isLoading: boolean;
  status: CharaAnimeStatus;
  setStatus: (status: CharaAnimeStatus) => void;
  redo: () => void;
  totalRounds: number;
  setTotalRounds: (round: number) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  rounds: RoundData[];
  totalPoints: number;
  addPoints: (points: number) => void;
  time: number;
  animesAlreadyShowed: number[];
  addAnime: (anime: SearchAnime) => boolean;
  winGame: () => void;
  nextRound: () => void;
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  initGame: () => void;
  numCharacters: number;
  setNumCharacters: (position: number) => void;
  selectedAnimes: SearchAnime[];
  numCorrects: number;
  startGame: () => void;
};

const CharaAnimeContext = createContext<CharaAnimeContext>({
  characters: [],
  animes: [],
  isLoading: true,
  status: "init",
  setStatus: () => {},
  redo: () => {},
  totalRounds: 0,
  setTotalRounds: () => {},
  currentRound: 0,
  setCurrentRound: () => {},
  rounds: [],
  totalPoints: 0,
  addPoints: () => {},
  time: 0,
  animesAlreadyShowed: [],
  addAnime: () => false,
  winGame: () => {},
  nextRound: () => {},
  currentPosition: 0,
  setCurrentPosition: () => {},
  initGame: () => {},
  numCharacters: 0,
  setNumCharacters: () => {},
  selectedAnimes: [],
  numCorrects: 0,
  startGame: () => {},
});

export function CharaAnimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<CharaAnimeStatus>("init");
  const [totalRounds, setTotalRounds] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [animesAlreadyShowed, setAnimesAlreadyShowed] = useState<number[]>([]);
  const [numCharacters, setNumCharacters] = useState(4);
  const [numCorrects, setNumCorrects] = useState(0);

  const [selectedAnimes, setSelectedAnimes] = useState<SearchAnime[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const { animes: animesTotal, isLoading: isLoadingAnimes } = usePageContext();

  const {
    characters,
    isLoading: isLoadingCharacters,
    redo,
    anime,
  } = useGetCharactersToCharaAnime(animesTotal);

  const animes = useGetAnimeRelated(animesTotal, anime?.id);

  const startGame = () => {
    setCurrentRound(1);
    setCurrentPosition(0);
    setSelectedAnimes([]);
    setStatus("stale");
    redo();
  };

  const initRound = () => {
    setCurrentPosition(0);
    setSelectedAnimes([]);
    setStatus("stale");
  };

  const initGame = () => {
    setRounds([]);
    setCurrentRound(0);
    setCurrentPosition(0);
    setSelectedAnimes([]);
    setTotalPoints(0);
    setStatus("init");
    setAnimesAlreadyShowed([]);
    setNumCorrects(0);
  };

  const addPoints = (points: number) => {
    setTotalPoints((prev) => prev + points);
  };

  const addAnime = (anime: SearchAnime) => {
    const newSelectedAnimes = [anime, ...selectedAnimes];
    setSelectedAnimes(newSelectedAnimes);
    if (
      animes.some(
        (a) =>
          a.id === anime.id ||
          a.idMal === anime.idMal ||
          (anime.englishName &&
            a.englishName &&
            a.englishName === anime.englishName) ||
          a.name === anime.name
      )
    ) {
      setNumCorrects((prev) => prev + 1);
      const points = 40 - 10 * (currentPosition - 1);
      addPoints(points);
      setRounds((prev) => [
        ...prev,
        {
          animes,
          characters,
          points,
          selectedAnimes: newSelectedAnimes,
        },
      ]);

      setStatus("win-round");
      return true;
    }
    setStatus("error-round");
    return false;
  };

  const winGame = () => {
    setStatus("win");
  };

  const nextRound = () => {
    const alreadyShowed = [...animesAlreadyShowed, ...animes.map((a) => a.id)];
    setAnimesAlreadyShowed(alreadyShowed);
    if (selectedAnimes.length === 0 && currentRound > 0) {
      setRounds((prev) => [
        ...prev,
        {
          animes,
          characters,
          points: 0,
          selectedAnimes: [],
        },
      ]);
    }
    if (totalRounds !== 0 && currentRound === totalRounds) {
      setStatus("end");
      return;
    }
    setCurrentRound((prev) => prev + 1);
    initRound();

    redo(alreadyShowed);
  };

  const reload = useCallback(() => {
    initRound();
    redo(animesAlreadyShowed);
  }, [animesAlreadyShowed, redo]);

  useEffect(() => {
    if (isLoadingCharacters) return;
    if (characters.length === 4) return;
    reload();
  }, [reload, characters, isLoadingCharacters]);

  return (
    <CharaAnimeContext.Provider
      value={{
        characters: characters ?? [],
        animes,
        isLoading: isLoadingAnimes,
        status,
        setStatus,
        redo: reload,
        totalRounds,
        setTotalRounds,
        currentRound,
        setCurrentRound,
        rounds,
        totalPoints,
        addPoints,
        time,
        animesAlreadyShowed,
        addAnime,
        winGame,
        nextRound,
        currentPosition,
        setCurrentPosition,
        initGame,
        numCharacters,
        setNumCharacters,
        selectedAnimes,
        numCorrects,
        startGame,
      }}
    >
      {children}
    </CharaAnimeContext.Provider>
  );
}

export function useGetCharactersToCharaAnime(
  animes: SearchAnime[] | null = []
) {
  const [anime, setAnime] = useState<SearchAnime | null>(null);

  const {
    data: charactersData,
    isLoading,
    isRefetching,
    isFetching,
  } = useGetCharactersByAnimeIdMAL(anime?.idMal);

  const [charactersToReturn, setCharactersToReturn] = useState<CharacterData[]>(
    []
  );

  useEffect(() => {
    const charactersToReturn = getRandomCharacters(charactersData ?? [], 4);
    setCharactersToReturn(charactersToReturn);
  }, [charactersData]);

  const redo = useCallback(
    (alreadyShowed: number[] = []) => {
      if (!animes) return;
      const anime = getRandomByArray(
        animes.filter((anime) => !alreadyShowed.includes(anime.id))
      );

      setAnime(anime);
    },
    [animes]
  );

  return {
    characters: charactersToReturn,
    redo,
    anime,
    isLoading:
      isLoading ||
      isRefetching ||
      isFetching ||
      charactersToReturn.length === 0,
  };
}

function getRandomCharacters(charactersData: CharacterData[], X: number) {
  const characters = charactersData.filter((char) => {
    return (
      !char.character.images.jpg.image_url.includes("questionmark") &&
      !char.character.images.jpg.image_url.includes("questionmark")
    );
  });
  const supportingCharacters = characters.filter(
    (char) => char.role === "Supporting"
  );
  const mainCharacters = characters.filter((char) => char.role === "Main");

  if (supportingCharacters.length < X - 1 || mainCharacters.length < 1) {
    return [];
  }

  // Ordenar los Supporting Characters por favoritos
  supportingCharacters.sort((a, b) => a.favorites - b.favorites);

  // Obtener el valor mínimo y máximo de favoritos de los Supporting Characters
  const minFavourites = supportingCharacters[0].favorites;
  const maxFavourites =
    supportingCharacters[supportingCharacters.length - 1].favorites;

  // Calcular el rango de cada chunk
  const chunkSize = (maxFavourites - minFavourites) / (X - 1);

  // Crear los chunks de personajes de Supporting Characters
  const selectedSupportingCharacters: CharacterData[] = [];
  let remainingChunks = X - 1;

  for (let i = 0; i < X - 1; i++) {
    const chunkMin = minFavourites + i * chunkSize;
    const chunkMax = chunkMin + chunkSize;

    // Filtrar los personajes en el rango del chunk actual
    const charactersInChunk = supportingCharacters.filter(
      (char) => char.favorites >= chunkMin && char.favorites < chunkMax
    );

    // Seleccionar un personaje aleatorio del chunk, si está vacío, se pasa al siguiente
    if (charactersInChunk.length > 0) {
      selectedSupportingCharacters.push(
        charactersInChunk[Math.floor(Math.random() * charactersInChunk.length)]
      );
      remainingChunks--;
    }

    // Si ya se seleccionaron suficientes Supporting Characters, se detiene
    if (remainingChunks <= 0) break;
  }

  // Si no se alcanzaron suficientes Supporting Characters, completar con el resto
  let remainingCharacters = supportingCharacters.filter(
    (char) => !selectedSupportingCharacters.includes(char)
  );
  while (remainingChunks > 0 && remainingCharacters.length > 0) {
    selectedSupportingCharacters.push(
      remainingCharacters[
        Math.floor(Math.random() * remainingCharacters.length)
      ]
    );
    remainingCharacters = remainingCharacters.filter(
      (char) => !selectedSupportingCharacters.includes(char)
    );
    remainingChunks--;
  }

  // Seleccionar un Main Character aleatorio
  const mainCharacter =
    mainCharacters[Math.floor(Math.random() * mainCharacters.length)];

  // Devolver los Supporting Characters seleccionados más el Main Character
  // sort de menor a mayor
  return [
    ...selectedSupportingCharacters.sort((a, b) => a.favorites - b.favorites),
    mainCharacter,
  ];
}

export function useCharaAnimeContext() {
  return useContext(CharaAnimeContext);
}
