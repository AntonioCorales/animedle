import { useEffect, useState } from "react";
import { SubtitleStyles, TitleStyles } from "../common";
import { SearchAnime } from "../game/context";
import { useCounterContext } from "../game/counter-context";
import { type Quiz, useAniQuizContext } from "./context";
import { WinComponent } from "../game";
import ConfettiExplosion from "react-confetti";
import styled from "styled-components";

export default function AniQuizGame() {
  const { status } = useAniQuizContext();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div>
        <TitleStyles>AniQuiz</TitleStyles>
        <SubtitleStyles>
          Escoge el anime que corresponde a la pregunta
        </SubtitleStyles>
      </div>
      {status === "init" && <Start />}
      {(status === "playing" ||
        status === "win-round" ||
        status === "error-round") && <Quiz />}
      {status === "end" && <End />}
    </div>
  );
}

function Quiz() {
  const { quiz, nextQuiz, restartGame, isLoading } = useAniQuizContext();
  const { restart } = useCounterContext();
  return (
    <>
      {!isLoading && quiz ? (
        <div className="flex flex-col gap-6 pt-8">
          <h3 className="text-center text-sky-400 text-xl text-balance">{quiz.question}</h3>

          <TimerBar />
          <div className="grid grid-cols-4 gap-2 content-center">
            {quiz.options.map((option, index) => (
              <Option key={option.id + "-" + index} option={option} />
            ))}
          </div>
          <div className="flex gap-2 justify-between items-center">
            <button
              onClick={restartGame}
              className="bg-blue-500 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
            >
              Reiniciar
            </button>
            <button
              className="bg-green-700 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
              onClick={() => {
                restart();
                nextQuiz();
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1>Cargando...</h1>
        </div>
      )}
    </>
  );
}

const AnimationDown = styled.div`
  @keyframes animation {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      top: 0;
      transform: translateY(0);
    }
  }

  animation: animation 0.5s ease-in-out;
`;

function Option(props: { option: SearchAnime }) {
  const { option } = props;
  const { status, quiz, onSelectOption, selectedOption } = useAniQuizContext();
  const { counter, setState } = useCounterContext();

  const classes =
    status !== "playing"
      ? quiz?.answer.id === option.id
        ? " border-green-600 outline-green-600 shadow-lg shadow-green-600 scale-105 outline-2  "
        : selectedOption?.id === option.id && quiz?.answer.id !== option.id
        ? " border-red-600 outline-red-600 shadow-lg shadow-red-600 "
        : ""
      : "  cursor-pointer hover:border-sky-600 hover:outline hover:outline-2 hover:outline-sky-600 hover:shadow-lg hover:shadow-sky-600 ";

  const genres = new Intl.ListFormat().format(option.genres);
  const tags = new Intl.ListFormat().format([...option.tags.slice(0, 4)]);
  const studios = new Intl.ListFormat().format(option.studios.map((s) => s.name));

  return (
    <div
      className={
        "flex flex-col aspect-[200/300] gap-2 justify-center items-center rounded-md relative overflow-hidden w-fit transition-all border-[1px] border-white  " +
        classes
      }
      onClick={() => {
        onSelectOption?.(option, counter);
        setState("pause");
      }}
    >
      {status !== "playing" && quiz && (
        <AnimationDown
          className="text-center max-w-[250px] 
        text-base bg-slate-800/80 absolute 
        top-0 left-0 w-full p-1 rounded-md"
        >
          {/* {quiz.type === "format" && option.format} */}
          {quiz.type === "season" && `${option.season} - ${option.seasonYear}`}
          {quiz.type === "year" && option.seasonYear}
          {quiz.type === "genre" && <span className="text-sm">{genres}</span>}
          {quiz.type === "studio" && studios}
          {quiz.type === "tag" && <span className="text-sm " style={{lineHeight: "10px"}}>{tags}{4 < option.tags.length ? <span className="text-sky-400">... +{option.tags.length - 4} tags</span>: ""}</span>}          
          {(quiz.type === "quantityChapters" || quiz.type === "chapters") && <span className="text-sm ">{option.episodes} {option.episodes === 1 ? "capítulo" : "capítulos"}</span>}
        </AnimationDown>
      )}
      <img
        src={option.image}
        alt={option.name}
        height={300}
        width={200}
        className="h-full w-full object-fill"
      />
      <div
        className="text-center max-w-[250px] 
        text-base bg-slate-800/80 absolute 
        bottom-0 left-0 w-full p-1 rounded-md"
      >
        {option.name}
      </div>
    </div>
  );
}

function TimerBar() {
  const {
    thinkingTime,
    answeredTime,
    status,
    totalQuiz,
    currentQuiz,
    totalPoints,
  } = useAniQuizContext();
  const { counter, setState } = useCounterContext();

  useEffect(() => {
    if (status !== "playing") {
      setState("pause");
      return;
    }
    setState("play");
  }, [status, setState]);

  const statusTimeBar =
    counter <= thinkingTime
      ? "thinking"
      : counter > answeredTime
      ? status
      : "answered";
  // const percent =
  //   statusTimeBar === "thinking"
  //     ? counter / thinkingTime
  //     : (answeredTime - counter + thinkingTime) / answeredTime;

  const percent = 1 - counter / (answeredTime + thinkingTime);

  const classByPercent =
    counter > 15
      ? "bg-red-400"
      : counter > 10
      ? "bg-yellow-400"
      : counter > 5
      ? "bg-green-400"
      : "bg-sky-400";

  const borderByPercent =
    counter > 15
      ? "border-red-400"
      : counter > 10
      ? "border-yellow-400"
      : counter > 5
      ? "border-green-400"
      : "border-sky-400";

  return (
    <div className="flex flex-col gap-1">
      <div
        className={
          "flex flex-col gap-2 justify-center items-start border-[1px] w-full h-2 rounded-md overflow-hidden " +
          borderByPercent
        }
      >
        <div
          className={`h-full transition ${classByPercent}`}
          style={{
            width: `${(percent > 0 ? percent : 0) * 100}%`,
            transition: "width 10ms linear",
          }}
        ></div>
      </div>
      <div className="flex gap-2 justify-between items-center">
        <span>
          Ronda: {currentQuiz}/{totalQuiz}
        </span>
        <span>Puntos: {totalPoints}</span>
      </div>
    </div>
  );
}

function Start() {
  const [number, setNumber] = useState(10);
  const { startGame } = useAniQuizContext();
  const { reset } = useCounterContext();
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
          startGame(number);
          reset();
        }}
        className="bg-green-800 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
      >
        Iniciar Juego
      </button>
    </div>
  );
}

function End() {
  const { totalPoints, totalQuiz, restartGame } = useAniQuizContext();

  const maxPoints = totalQuiz * 100;

  return (
    <div className="flex flex-col gap-4 flex-1 justify-center items-center pb-64">
      {totalPoints > 0 && (
        <ConfettiExplosion
          style={{
            zIndex: 1000,
            width: "90vw",
            height: "100vh",
            marginInline: "auto",
          }}
        />
      )}
      <span className={"text-2xl"}>{"¡Finalizado!"}</span>

      <span>
        Has obtenido {totalPoints} de {maxPoints} puntos
      </span>

      <button
        className="bg-green-700 text-white px-8 py-2 rounded-md hover:scale-105 transition-transform focus:outline-none"
        onClick={restartGame}
      >
        Reiniciar
      </button>
    </div>
  );
}
