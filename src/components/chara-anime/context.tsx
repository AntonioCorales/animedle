import { createContext, useContext, useEffect, useState } from "react";
import { useGetAndFormatRandomAnime } from "../utils/useGetAnime";
import { useGetCharactersByAnimeIdMAL } from "../queries/getCharactersByAnime";
import { CharacterData } from "@/types/characters";
import {
  useGetAnimesRelatedToAL,
  useGetAnimesRelatedToMAL,
} from "../queries/getAnimesRelatedTo";
import { usePageContext } from "../context";

type CharaAnimeStatus =
  | "loading"
  | "init"
  | "stale"
  | "playing"
  | "win"
  | "end"
  | "win-round"
  | "error-round";

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
  addAnime: (anime: MinAnimeData) => boolean;
  winGame: () => void;
  nextRound: () => void;
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  initGame: () => void;
};

const CharaAnimeContext = createContext<CharaAnimeContext>({
  characters: [],
  animes: [],
  isLoading: true,
  status: "loading",
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

  const [selectedAnimes, setSelectedAnimes] = useState<MinAnimeData[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const { characters, isLoading, redo, animes } =
    useGetCharactersToCharaAnime(animesAlreadyShowed);

  const initRound = () => {    
    redo();
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
  };

  const addPoints = (points: number) => {
    setTotalPoints((prev) => prev + points);
  };

  const addAnime = (anime: MinAnimeData) => {
    const newSelectedAnimes = [anime, ...selectedAnimes];
    setSelectedAnimes((prev) => [anime, ...prev]);
    if (
      animes.some(
        (a) =>
          a.id === anime.id ||
          a.idMal === anime.idMal ||
          a.name.includes(anime.name) ||
          anime.name.includes(a.name)
      )
    ) {
      setAnimesAlreadyShowed((prev) => [...prev, ...animes.map((a) => a.id)]);
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
    setStatus("error-round")
    return false;
  };

  const winGame = () => {
    setStatus("win");
  };

  const nextRound = () => {
    if (totalRounds !== 0 && currentRound === totalRounds) {
      setStatus("end");
      return;
    }
    setCurrentRound((prev) => prev + 1);
    initRound();
  };

  return (
    <CharaAnimeContext.Provider
      value={{
        characters: characters ?? [],
        animes,
        isLoading: isLoading,
        status,
        setStatus,
        redo: initRound,
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
      }}
    >
      {children}
    </CharaAnimeContext.Provider>
  );
}

export function useGetCharactersToCharaAnime(alreadyShowed: number[]) {
  const { user } = usePageContext();
  const {
    anime,
    isLoading: isLoadingAnime,
    redo,
  } = useGetAndFormatRandomAnime(user);
  const { data: charactersData, isLoading } = useGetCharactersByAnimeIdMAL(
    anime?.idMal
  );

  const { data: animes, isLoading: isLoadingRel } = useGetAnimesRelatedToAL(
    anime?.id
  );

  const [charactersToReturn, setCharactersToReturn] = useState<CharacterData[]>(
    []
  );
  const [animesToReturn, setAnimesToReturn] = useState<MinAnimeData[]>([]);

  useEffect(() => {
    const charactersToReturn = getRandomCharacters(charactersData ?? [], 4);
    setCharactersToReturn(charactersToReturn);
  }, [charactersData]);

  useEffect(() => {
    const animesToReturn =
      animes?.map((anime) => ({
        id: anime.id,
        idMal: anime.idMal,
        name: anime.title.romaji,
        englishName: anime.title.english,
      })) ?? [];
    setAnimesToReturn(animesToReturn);
  }, [animes]);

  return {
    characters: charactersToReturn,
    redo,
    animes: animesToReturn,
    isLoading:
      isLoading ||
      isLoadingAnime ||
      isLoadingRel ||
      charactersToReturn.length === 0 ||
      animesToReturn.length === 0,
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
