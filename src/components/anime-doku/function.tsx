import { useEffect, useState } from "react";
import { usePageContext } from "../context";
import { NumberOperator, OptionLine, StringOperator } from "./context";
import { SearchAnime } from "../game/context";
import { getRandomByArray } from "../utils/functions";

type OptionType = "year" | "genre" | "tag" | "format" | "chapters";

const OPTION_TYPES: OptionType[] = [
  "year",
  "genre",
  "tag",
  "format",
  "chapters",
];

const NUMBER_OPERATORS: NumberOperator[] = [
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
];

const STRING_OPERATORS: StringOperator[] = [
  "contains",
  "notContains",
];


export function useInitGame(size: number) {
  const [animeBase, setAnimeBase] = useState<SearchAnime | null>();
  const [years, setYears] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [episodes, setEpisodes] = useState<number[]>([]);

  const [optionsVertical, setOptionsVertical] = useState<OptionLine[]>([]);
  const [optionsHorizontal, setOptionsHorizontal] = useState<OptionLine[]>([]);
  const { animes } = usePageContext();

  useEffect(() => {
    if (animes.length === 0) return;

    const years: number[] = [];
    const tags: string[] = [];
    const genres: string[] = [];
    const formats: string[] = [];
    const episodes: number[] = [];

    animes.forEach((anime) => {
      years.push(anime.seasonYear);
      tags.push(...anime.tags);
      genres.push(...anime.genres);
      formats.push(anime.format);
      episodes.push(anime.episodes);
    });

    console.log({years, tags, genres, formats, episodes})

    setYears(years);
    setTags(unique(tags));
    setGenres(unique(genres));
    setFormats(unique(formats));
    setEpisodes(episodes);

    let isFinal;
    const optionsVertical: OptionLine[] = []; // i
    const optionsHorizontal: OptionLine[] = []; // j
    const matriz: SearchAnime[][] = [];
    for(let i = 0; i < size; i++) {
      
      const optionType = getRandomByArray(OPTION_TYPES) ?? "genre";
      const numberOperator = getRandomByArray(NUMBER_OPERATORS) ?? "eq";

      if(optionType === "year") {
        const year = getRandomByArray(years) ?? 2020;
        const animesToReturn = getAnimesByYear(animes, year, numberOperator);
        matriz[i] = animesToReturn;
        optionsVertical.push({
          type: "year",
          value: year,
          operator: numberOperator,
        });
      }

      for(let j = 0; j < size; j++) {
         
      }
    }
  }, [animes, size]);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function getAnimesByYear(animes: SearchAnime[], year: number, numberOperator: NumberOperator, ) {
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