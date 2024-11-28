"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import useStorage from "../useStorage";
import { useCharaAnimeContext } from "./context";
import { useCounterContext } from "../game/counter-context";
import { precisionToClass, precisionToText } from "./game";
import { WinComponent } from "./WinComponent";

export const RecordEndless = () => {
  const [endlessRecord, _setEndlessRecord] = useStorage(
    "charaAnime-endless-record",
    0
  );
  return (
    <div className="flex gap-2 justify-center items-end text-lg">
      Record actual:
      <span className="text-sky-400">{endlessRecord} puntos</span>
    </div>
  );
};

export const TimerBar = () => {
  const maxTime = 30;
  const { currentRound, currentPosition, status, setStatus } =
    useCharaAnimeContext();
  const { counter, setState } = useCounterContext();

  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (
      status === "win-round" ||
      status === "error-round" ||
      status === "show-names"
    ) {
      setState("pause");
    }
  }, [status, setState]);

  useEffect(() => {
    if (
      status === "win-round" ||
      status === "error-round" ||
      status === "show-names"
    ) {
      return;
    }
    if (currentPosition < 1) {
      setState("pause");
    } else {
      setState("play");
    }
  }, [currentRound, setState, currentPosition, status]);

  useEffect(() => {
    const percent =
      maxTime >= counter ? ((maxTime - counter) / maxTime) * 100 : 0;

    setPercent(percent);
  }, [counter]);

  useEffect(() => {
    if (percent <= 0) {
      setStatus("error-round");
    }
  }, [percent, setStatus]);

  return (
    <div className="w-full">
      <div className="flex items-center w-full bg-slate-800 h-2 rounded-md">
        <div
          className={`bg-sky-500 h-2 rounded-md `}
          style={{ width: `${percent}%`, transition: "all 10ms linear" }}
        ></div>
      </div>
    </div>
  );
};

export function EndlessEnd() {
  const {
    totalPoints,
    rounds,
    totalRounds,
    initGame,
    numCorrects,
    currentRound,
    isNewRecordEndless,
  } = useCharaAnimeContext();
  const [pointsText, setPointsText] = useState("Calculando...");
  const totalTries = rounds.reduce(
    (prev, curr) =>
      prev +
      (curr.selectedAnimes.length === 0 ? 1 : curr.selectedAnimes.length),
    0
  );
  const maxPoints = currentRound * 40;
  const precision =
    totalTries === 0 ? 0 : Math.round((numCorrects / totalTries) * 1000) / 10;
  const textClass = precisionToClass(precision);

  const pointsPercent = Math.round((totalPoints / maxPoints) * 1000) / 10;
  const pointsClass = precisionToClass(pointsPercent);

  useEffect(() => {
    setPointsText(precisionToText(precision, pointsPercent));
  }, [precision, pointsPercent]);

  return (
    <div className="flex flex-col gap-2 justify-center items-center pb-64 flex-1">
      {pointsPercent > 25 && <WinComponent />}

      {/* <span className={"text-lg uppercase leading-5 " + pointsClass}>
        {pointsText}
      </span> */}
      {isNewRecordEndless ? (
        <span className="text-center w-full p-1 rounded-md">
          <span className="text-sky-400 text-2xl">¡Nuevo record! </span>
        </span>
      ) : (
        <span className={"text-2xl"}>{"¡Finalizado!"}</span>
      )}
      {maxPoints === totalPoints && totalTries === totalRounds && (
        <span className="text-lg text-sky-400">¡Puntuación perfecta!</span>
      )}
      <span className={"text-lg mb-1 "}>
        Has obtenido {totalPoints} puntos
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

export function RecordBar() {
  const { totalPoints, isNewRecordEndless, setIsNewRecordEndless } =
    useCharaAnimeContext();
  const [record, setRecord] = useStorage("charaAnime-endless-record", 0);
  const [recordDate, setRecordDate] = useStorage(
    "charaAnime-endless-record-date",
    ""
  );
  const [percent, setPercent] = useState(0);

  const classByPercent =
    percent < 30
      ? "bg-red-400"
      : percent < 60
      ? "bg-yellow-400"
      : percent < 90
      ? "bg-green-400"
      : "bg-sky-400";

  useEffect(() => {
    if (totalPoints > record) {
      setRecord(totalPoints);
      setRecordDate(new Date().toLocaleString());
      setIsNewRecordEndless(true);
    }
  }, [totalPoints, setRecord, record, setRecordDate, setIsNewRecordEndless]);

  useEffect(() => {
    if (record === 0) {
      setPercent(100);
      return;
    }
    const percent = Math.round((totalPoints / record) * 100);
    setPercent(percent);
  }, [totalPoints, record]);

  return (
    <div className="flex gap-3 justify-center items-end text-lg flex-col">
      <div className="flex items-center w-full bg-slate-800 h-2 rounded-md">
        <div
          className={`${classByPercent} h-2 rounded-md `}
          style={{ width: `${percent}%`, transition: "all 300ms ease" }}
        ></div>
      </div>
      <div className="flex gap-2 items-end text-base justify-between w-full">
        <div className="flex gap-1 items-center">
          Record actual:
          <span>{record} puntos</span>
        </div>
        {isNewRecordEndless && (
          <span className="text-sky-400">¡Nuevo record! </span>
        )}
      </div>
    </div>
  );
}
