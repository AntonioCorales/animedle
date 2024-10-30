import { SubtitleStyles, TitleStyles } from "../common";
import { useCharaAnimeContext } from "./context";
import { CharacterData } from "@/types/characters";
import FlipCard from "./FlipCard";
import { useState } from "react";
import SearchAnimeSelect from "../game/Search";
import { WinComponent } from "./WinComponent";
import { ArrowRightAlt, Check, Close, RestartAlt } from "@mui/icons-material";
import { SearchAnime } from "../game/context";
import styled from "styled-components";

export default function CharaAnimeGame() {
  const { status } = useCharaAnimeContext();

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div>
        <TitleStyles>CharaAnime</TitleStyles>
        <SubtitleStyles>Adivina el anime por sus personajes</SubtitleStyles>
      </div>

      {status === "init" && <Init />}
      {(status === "stale" ||
        status === "playing" ||
        status === "win-round" ||
        status === "error-round" ||
        status === "loading") && <Playing />}
      {status === "end" && <End />}
    </div>
  );
}

function Init() {
  const { nextRound, setTotalRounds } = useCharaAnimeContext();
  const [number, setNumber] = useState(10);
  return (
    <div className="flex flex-col gap-4 flex-1 justify-center items-center pb-64">
      <label className="flex flex-col gap-1 text-center">
        Número de rondas
        <input
          type="number"
          defaultValue={number}
          placeholder="Ingresa el número de rondas"
          className="bg-slate-800 text-white px-4 py-2 rounded-md focus:outline-none w-[300px] border-green-800 border-2 text-center"
          onChange={(e) => {
            setNumber(parseInt(e.target.value));
          }}
        />
      </label>
      <button
        onClick={() => {
          setTotalRounds(number > 0 ? number : 1);
          nextRound();
        }}
        className="bg-green-800 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
      >
        Iniciar Juego
      </button>
    </div>
  );
}

function Playing() {
  const { isLoading, addAnime, status } = useCharaAnimeContext();

  return (
    <div className="flex flex-col gap-4">
      <SearchAnimeSelect
        onSelect={addAnime}
        disabled={isLoading || status === "win-round"}
        className={`${
          status === "win-round"
            ? " outline-green-500 outline-2 disabled:outline-2"
            : status === "error-round"
            ? "focus-within:outline-red-500 focus-within:outline-2 outline-red-500"
            : undefined
        }`}
      />
      <Stats />
      <Round />
      <Controls />
      <AnimesSelected />
    </div>
  );
}

function Round() {
  const { characters, currentPosition, setCurrentPosition, status } =
    useCharaAnimeContext();

  console.log({ status });

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="characters grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center mx-auto">
        {status !== "loading" &&
          characters.map((character, index) => (
            <CardCharacter
              key={index + "-" + character.character.malID}
              characterData={character}
              onClick={() => {
                if (currentPosition === index) setCurrentPosition(index + 1);
              }}
              disabled={currentPosition !== index}
              position={index}
              flip={status === "win-round" ? true : undefined}
            />
          ))}
        {(status === "loading" || characters.length === 0) &&
          Array(4)
            .fill(0)
            .map((_, index) => <CardCharacterSkeleton key={index} />)}
      </div>
    </div>
  );
}

function Stats() {
  const { totalRounds, currentRound, totalPoints, status } =
    useCharaAnimeContext();
  return (
    <div className="flex flex-row gap-2 items-end justify-between">
      <span className="text-green-300">
        Ronda: {currentRound}/{totalRounds}
      </span>
      {status === "win-round" && (
        <AnimationPulseStyles>
          <span className="text-green-300 text-xl leading-4">
            <Check />
          </span>
        </AnimationPulseStyles>
      )}
      {status === "error-round" && (
        <AnimationPulseStyles>
          <span className="text-red-500 text-xl leading-4">
            <Close />
          </span>
        </AnimationPulseStyles>
      )}
      <span>Puntos: {totalPoints}</span>
    </div>
  );
}

function Controls() {
  const {
    nextRound,
    status,
    initGame,
    currentRound,
    totalRounds,
    currentPosition,
  } = useCharaAnimeContext();

  return (
    <div className="flex gap-2 justify-center md:justify-between items-center">
      <button
        className="bg-sky-700 text-white flex-1 md:flex-none justify-center px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none flex"
        onClick={initGame}
      >
        <RestartAlt />
        <span className="hidden md:flex md:ml-2">Reiniciar</span>
      </button>

      <button
        onClick={nextRound}
        disabled={status !== "win-round" && currentPosition !== 4}
        className="flex bg-green-700 text-white flex-1 md:flex-none justify-center px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none disabled:bg-slate-400 disabled:hover:scale-100"
      >
        <span className="hidden md:flex md:mr-2">
          {currentRound === totalRounds
            ? "Finalizar"
            : status === "win-round"
            ? "Siguiente"
            : "Pasar"}
        </span>
        <ArrowRightAlt />
      </button>
    </div>
  );
}

function End() {
  const { totalPoints, rounds, totalRounds, initGame } = useCharaAnimeContext();
  const totalTries = rounds.reduce(
    (prev, curr) => prev + curr.selectedAnimes.length,
    0
  );
  const maxPoints = totalRounds * 40;
  const precision =
    totalTries === 0 ? 0 : Math.round((totalRounds / totalTries) * 1000) / 10;
  const textClass =
    precision <= 25
      ? "text-red-400"
      : precision <= 50
      ? "text-orange-400"
      : precision <= 75
      ? "text-yellow-400"
      : "text-green-400";

  const pointsPercent = Math.round((totalPoints / maxPoints) * 1000) / 10;
  const pointsClass =
    pointsPercent <= 25
      ? "text-red-400"
      : pointsPercent <= 50
      ? "text-orange-400"
      : pointsPercent <= 75
      ? "text-yellow-400"
      : "text-green-400";

  const pointsText =
    pointsPercent <= 10
      ? "Si no lo hiciste apropósito... no lo entiendo"
      : pointsPercent <= 25
      ? "¡¿Cómo sacaste tan pocos puntos?!"
      : pointsPercent <= 50
      ? "Igual no esperaba nada..."
      : pointsPercent <= 75
      ? "¡Bueno, pero no tanto!"
      : pointsPercent <= 90
      ? "¡¿Como llegaste tan lejos?!"
      : "¡¡GOOOOOD!!";

  return (
    <div className="flex flex-col gap-3 justify-center items-center pb-64 flex-1">
      {pointsPercent > 25 && <WinComponent />}

      <span className={"text-2xl leading-5"}>{"¡Finalizado!"}</span>
      <span className={"text-lg " + pointsClass}>{pointsText}</span>
      {maxPoints === totalPoints && totalTries === totalRounds && (
        <span className="text-xl text-sky-400">¡Puntuación perfecta!</span>
      )}
      <span>
        Has obtenido {totalPoints} de {maxPoints} puntos
      </span>
      <div className="flex flex-col text-center ">
        <span className={`text-2xl ${textClass} relative leading-5`}>
          {precision}
          <span className="text-xs absolute right bottom-0">%</span>
        </span>
        <span className="text-sm">precisión</span>
      </div>
      <button
        className="bg-green-700 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
        onClick={initGame}
      >
        Reiniciar
      </button>
    </div>
  );
}

interface CardCharacterProps {
  flip?: boolean;
  position: number;
  characterData: CharacterData;
  disabled?: boolean;
  onClick?: () => void;
}

function CardCharacter(props: CardCharacterProps) {
  const { characterData, disabled, onClick, position, flip } = props;
  const { character } = characterData;
  const { images } = character;

  const color =
    position === 0
      ? "outline outline-3 outline-red-600 bg-red-300 text-red-600"
      : position === 1
      ? "outline outline-3 outline-orange-600 bg-orange-300 text-orange-600"
      : position === 2
      ? "outline outline-3 outline-yellow-700 bg-yellow-300 text-yellow-600"
      : "outline outline-3 outline-green-600 bg-green-300 text-green-600";

  const points = 40 - 10 * position;

  return (
    <div
      className="flex flex-col w-full justify-center items-center "
      onClick={onClick}
    >
      <FlipCard
        frontContent={
          <div
            className={`w-[150px] h-[280px] md:w-[225px] md:h-[350px] overflow-hidden rounded-md ${color} bg-slate-900`}
          >
            <img
              alt="character"
              src={images.webp.image_url ?? images.jpg.image_url}
              width={201}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        }
        backContent={
          <div
            className={`w-[150px] h-[280px] md:w-[225px] md:h-[350px] rounded-md flex flex-col gap-2 justify-center items-center cursor-pointer ${color}`}
          >
            <img alt="card" src={"/logo-md.webp"} width={50} height={50} />
            <span className="uppercase text-xl font-mono font-bold">
              {points} puntos
            </span>
          </div>
        }
        disabled={disabled}
        oneWay
        flip={flip}
      />
    </div>
  );
}

function CardCharacterSkeleton() {
  return (
    <div className="w-[150px] h-[280px] md:w-[225px] md:h-[350px] overflow-hidden rounded-md bg-slate-900 flex items-center justify-center">
      <img
        alt="card"
        src={"/logo-md.webp"}
        width={50}
        height={50}
        className="animate-spin"
      />
    </div>
  );
}

function AnimesSelected() {
  const { selectedAnimes } = useCharaAnimeContext();

  return (
    <div className="flex flex-col gap-2">
      {selectedAnimes.map((selectedAnime, index) => (
        <AnimeSelectedCard key={selectedAnime.name} anime={selectedAnime} />
      ))}
    </div>
  );
}

interface AnimeSelectedCardProps {
  anime: SearchAnime;
}

function AnimeSelectedCard(props: AnimeSelectedCardProps) {
  const { animes } = useCharaAnimeContext();
  const { anime } = props;
  console.log({ anime, animes });
  const isCorrect = animes.some(
    (a) =>
      a.id === anime.id ||
      a.idMal === anime.idMal ||
      a.name.toLowerCase().includes(anime.name.toLowerCase())
  );

  return (
    <div
      className={`flex gap-2 p-2 rounded-md ${
        isCorrect ? "bg-green-700" : "bg-red-600"
      }`}
    >
      <div>
        <img src={anime.image} alt={anime.name} height={60} width={40} />
      </div>
      <div className="flex flex-1">{anime.name}</div>
    </div>
  );
}

const AnimationPulseStyles = styled.div`
  animation: pulse 1s;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.6);
    }
    100% {
      transform: scale(1);
    }
  }
`;

function AnimationPulse(props?: { children?: React.ReactNode }) {}
