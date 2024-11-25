import { useEffect, useState } from "react";
import { usePageContext } from "../context";
import { NumberOperator, OptionLine, StringOperator } from "./context";
import { SearchAnime } from "../game/context";
import { getRandomByArray } from "../utils/functions";

type OptionType = "year" | "genre" | "tag" | "format" | "chapters" | "studio";

const OPTION_TYPES: OptionType[] = [
  "year",
  "genre",
  "tag",
  "format",
  "chapters",
  "studio",
];

const NUMBER_OPERATORS: NumberOperator[] = [
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
];

const STRING_OPERATORS: StringOperator[] = ["contains", "notContains"];

interface OptionsType {
  type: OptionType;
  operators: StringOperator[] | NumberOperator[];
}

const TYPES: OptionsType[] = [
  {
    type: "year",
    operators: NUMBER_OPERATORS,
  },
  {
    type: "genre",
    operators: STRING_OPERATORS,
  },
  {
    type: "tag",
    operators: STRING_OPERATORS,
  },
  {
    type: "format",
    operators: STRING_OPERATORS,
  },
  {
    type: "chapters",
    operators: NUMBER_OPERATORS,
  },
  {
    type: "studio",
    operators: STRING_OPERATORS,
  },
];

export function useInitGame(size: number) {
  const { animes, isLoading } = usePageContext();

  useEffect(() => {
    if (animes.length === 0 || isLoading) return;
    const animesSelected = getManyAnimeByArray(animes, size);
  }, [animes, size, isLoading]);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function getAnimesByYear(
  animes: SearchAnime[],
  year: number,
  numberOperator: NumberOperator
) {
  const animesToReturn: SearchAnime[] = [];
  animes.forEach((anime) => {
    if (numberOperator === "eq") {
      if (anime.seasonYear === year) animesToReturn.push(anime);
    } else if (numberOperator === "lt") {
      if (anime.seasonYear < year) animesToReturn.push(anime);
    } else if (numberOperator === "lte") {
      if (anime.seasonYear <= year) animesToReturn.push(anime);
    } else if (numberOperator === "gt") {
      if (anime.seasonYear > year) animesToReturn.push(anime);
    } else if (numberOperator === "gte") {
      if (anime.seasonYear >= year) animesToReturn.push(anime);
    }
  });
  return animesToReturn;
}

function getManyAnimeByArray(
  items: SearchAnime[],
  size: number
): SearchAnime[] {
  if (items.length === 0) return [];
  const itemsSelected: SearchAnime[] = [];
  let tries = 0;
  while (itemsSelected.length < size && tries < 10) {
    const item = getRandomByArray(items);
    if (!item) continue;
    if (!itemsSelected.some((itemSelected) => itemSelected.id === item.id)) {
      itemsSelected.push(item);
    }
    tries++;
  }
  return itemsSelected;
}

function getAnimesByGenre(
  animes: SearchAnime[],
  genre: string,
  operator: StringOperator
) {}

function generateTypes(size: number) {
  const types: OptionsType[] = [];
  let isYear = false;
  let isFormat = false;
  let isChapters = false;
  let isStudio = false;
  let isGenre = false;
  let isTag = false;

  let tries = 0;

  while (types.length < size * 2 && tries < size * 3) {
    const type = getRandomByArray(TYPES);
    if (types.length >= size / 2) {
      isGenre = false;
      isTag = false;
    }
    if (!type) continue;
    if (type.type === "year") {
      if (isYear) continue;
      isYear = true;
    } else if (type.type === "format") {
      if (isFormat) continue;
      isFormat = true;
    } else if (type.type === "chapters") {
      if (isChapters) continue;
      isChapters = true;
    } else if (type.type === "studio") {
      if (isStudio) continue;
      isStudio = true;
    } else if (type.type === "genre") {
      if (isGenre) continue;
      isGenre = true;
    } else if (type.type === "tag") {
      if (isTag) continue;
      isTag = true;
    }
    tries++;
    types.push(type);
  }

  return types;
}

function generateOptions(animes: SearchAnime[], size: number) {}

function generateLine(matriz: SearchAnime[][], size: number) {}
