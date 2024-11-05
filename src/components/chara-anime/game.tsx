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
  const { isLoading, addAnime, status, selectedAnimes } =
    useCharaAnimeContext();

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
        excludeAnimes={selectedAnimes.map((anime) => anime.id)}
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

function precisionToClass(precision: number) {
  if (precision <= 25) return "text-red-400";
  if (precision <= 50) return "text-orange-400";
  if (precision <= 75) return "text-yellow-400";
  if (precision < 100) return "text-green-400";
  return "text-sky-400";
}

function precisionToText(
  precisionTries: number,
  precisionPoints: number
): string {
  const getRandomMessage = (messages: string[]) =>
    messages[Math.floor(Math.random() * messages.length)];

  const precisionPointsMessages = {
    0: [
      "Ni fallando apropósito lo hubiera hecho tan mal...",
      "¿Jugaste con los ojos cerrados?",
      "¿Estás seguro de que sabes cómo se juega?",
      "Tienes un talento especial... para fallar.",
      "Lo siento, pero esto es épico... en el mal sentido.",
    ],
    25: [
      "Si no lo hiciste apropósito... no lo entiendo",
      "¿A eso le llamas intentarlo?",
      "La próxima vez puedes intentar con un poco más de ganas.",
      "Estás cerca de no hacer nada, ¡intenta más fuerte!",
      "Apenas y lo intentaste... o eso parece.",
      "¿Un esfuerzo mínimo? ¡Inténtalo en serio!",
      "Este juego necesita que enciendas la pantalla.",
      '"Eres Manco, como Yair17" -henry__0408',
    ],
    50: [
      "¡¿Cómo sacaste tan pocos puntos?!",
      "Con algo más de empeño seguro fallas más.",
      "No está mal… para haber jugado ciego.",
      "Si le pones algo más de ganas seguro subes.",
      "La mitad del camino... ¡Para llegar a un nivel normal!",
      "¿Te estabas tomando un descanso?",
    ],
    75: [
      "Igual no esperaba mucho...",
      "Te falta poquito... ¡Pero para caer!",
      "No es mal resultado, pero Pingu te gana.",
      "A medio camino entre bien y el caer en pozo.",
      "¡Vas bien!, pero te falta un poco de neuronas.",
      "¿Ya estás cansado?... Porque se esta notando",
      '"Hasta los fans de Dragon Ball saben mas." -Ahunae',
      '"El chat te esta insultando ¿Te dejas?" - akio7512'
    ],
    90: [
      "¡Bueno, pero no tanto!",
      "¡Casi lo logras! Ahora intenta usar el resto del cerebro.",
      "Pues ni tan mal, no pense que llegarías a tanto.",
      "Estás muy cerca... ¿Y si lo intentas otra vez?",
      '"Muy bien, pero el chat lo haría mejor." -endertroll12345_original',
    ],
    100: [
      "¡¡GOOOOOD!!",
      "Perfección casi lograda, ¡JEJE GOD!",
      "¿Tus habilidades ya están al límite?",
      "Estoy sinceramente impresionado.",
      "Casi inmejorable, pero Goku te gana.",
    ],
  };

  const precisionTriesMessages = {
    true: [
      "¡¡ERES DIOS, ¿¿PERO TANTO ESFUERZO VALIÓ LA PENA??!!",
      '"Ya era hora que hicieseis todo bien, no cuesta tanto." -Rodri12721',
      "Increíble! Lo alcanzaste, ¿Cuantas neuronas sacrificaste?",
    ],
    false: [
      "NADA, ERES BUENÍSIMO. ¿PERO LA PRECISIÓN PARA CUANDO?",
      "¡No te lo crees ni tú!, ¿pero la precisión te la sabes?!",
      '"Los segundos son los primeros perdedores." -Rodri12721',
    ],
  };

  if (precisionPoints === 100) {
    const isSuccess: "true" | "false" =
      precisionTries === 100 ? "true" : "false";
    return getRandomMessage(precisionTriesMessages[isSuccess]);

  }

  type Range = 0 | 25 | 50 | 75 | 90 | 100;

  const ranges: Range[] = [0, 25, 50, 75, 90, 100];
  const range = ranges.find((r) => precisionPoints <= r) ?? 100;

  return getRandomMessage(precisionPointsMessages[range]);
}

function End() {
  const { totalPoints, rounds, totalRounds, initGame, numCorrects } = useCharaAnimeContext();
  const totalTries = rounds.reduce(
    (prev, curr) => prev + (curr.selectedAnimes.length === 0 ? 1 : curr.selectedAnimes.length),
    0
  );
  const maxPoints = totalRounds * 40;
  const precision =
    totalTries === 0 ? 0 : Math.round((numCorrects / totalTries) * 1000) / 10;
  const textClass = precisionToClass(precision);

  const pointsPercent = Math.round((totalPoints / maxPoints) * 1000) / 10;
  const pointsClass = precisionToClass(pointsPercent);

  const pointsText = precisionToText(precision, pointsPercent);

  return (
    <div className="flex flex-col gap-3 justify-center items-center pb-64 flex-1">
      {pointsPercent > 25 && <WinComponent />}

      <span className={"text-2xl"}>{"¡Finalizado!"}</span>
      <span className={"text-lg uppercase leading-5 " + pointsClass}>
        {pointsText}
      </span>
      {maxPoints === totalPoints && totalTries === totalRounds && (
        <span className="text-lg text-sky-400">¡Puntuación perfecta!</span>
      )}
      <span>
        Has obtenido {totalPoints} de {maxPoints} puntos
      </span>
      <div className="flex flex-col text-center ">
        <span className={`text-2xl ${textClass} relative leading-5`}>
          {precision}
          <span className="text-xs">%</span>
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
      {selectedAnimes.map((selectedAnime) => (
        <AnimeSelectedCard
          key={selectedAnime.name + selectedAnime.id}
          anime={selectedAnime}
        />
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
  const isCorrect = animes.some(
    (a) =>
      a.id === anime.id ||
      a.idMal === anime.idMal ||
      a.name.toLowerCase().includes(anime.name.toLowerCase()) ||
      anime.name.toLowerCase().includes(a.name.toLowerCase())
  );

  return (
    <CardAnimationPuseStyles>
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
    </CardAnimationPuseStyles>
  );
}

const AnimationPulseStyles = styled.div`
  animation: pulse 1s;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.7);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const CardAnimationPuseStyles = styled.div`
  animation: pulse 1s;
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;
