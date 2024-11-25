import {
  Entry,
  ListName,
  MediaListCollection,
  NodesStudio,
} from "@/types/anime";
import { SearchAnime } from "../game/context";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { getRandomByArray } from "./functions";
import { useEffect, useState } from "react";

export type FormatAnimesOptions = {
  types?: ListName[];
  tagsLimit?: number;
  excludeAnimes?: number[];
};

const DEFAULT_OPTIONS = {
  types: ["Completed"],
};

export function entryToSearchAnime(entry: Entry, tagsLimit?: number): SearchAnime {
  const { media } = entry;
  const altNames = [
    media.title.romaji.toLowerCase(),
    ...media.synonyms.map((s) => s.toLowerCase()),
  ];

  if (media.title.english) {
    altNames.push(media.title.english.toLowerCase());
    altNames.push(media.title.english);
  }

  const tags =
    tagsLimit && tagsLimit > 0
      ? media.tags.map((tag) => tag.name).slice(0, tagsLimit)
      : media.tags.map((tag) => tag.name);

  const studios: NodesStudio[] = [];
  media.studios.nodes.forEach((studio) => {
    if (studio.isAnimationStudio) {
      if (studios.findIndex((s) => s.id === studio.id) === -1) {
        studios.push(studio);
      }
    }
  });

  return {
    id: media.id,
    idMal: media.idMal,
    name: media.title.romaji,
    englishName: media.title.english,
    altNames,
    image: media.coverImage.large,
    genres: media.genres,
    tags,
    episodes: media.episodes,
    seasonYear: media.seasonYear,
    format: media.format,
    season: media.season,
    description: media.description,
    image_large: media.coverImage.extraLarge,
    studios,
    relations: media.relations.nodes.map((node) => {
      return {
        id: node.id,
        idMal: node.idMal,
        name: node.title.romaji,
        englishName: node.title.english,
      };
    }),
  };
}

export function formatAnimes(
  animes?: MediaListCollection,
  options?: FormatAnimesOptions
): SearchAnime[] {
  if (!animes) return [];
  const { types = DEFAULT_OPTIONS.types, tagsLimit } = options || {};
  if (types.length === 0) return [];
  const listsAnimes = animes.lists.filter((list) => {
    return types.includes(list.name);
  });

  const dataToReturn: SearchAnime[] = [];
  listsAnimes.forEach((list) => {
    const listAnimes = list.entries.map((entry) => {
      return entryToSearchAnime(entry, tagsLimit);
    });
    dataToReturn.push(...listAnimes);
  });

  return dataToReturn;
}



export function useGetAndFormatAnimes(
  user: string,
  options?: FormatAnimesOptions
) {
  const { data, isLoading } = useGetAnimeByUser(user);
  const animes = formatAnimes(data, options);

  return {
    animes,
    isLoading,
    allAnimes: data?.lists.flatMap((list) => list.entries.map((entry) => entryToSearchAnime(entry))) ?? [],
  };
}

export function useGetAndFormatRandomAnime(
  user: string,
  excludeAnimes: number[] = [],
  options?: FormatAnimesOptions
) {
  const { data, isLoading } = useGetAnimeByUser(user);

  const [anime, setAnime] = useState<SearchAnime>();

  useEffect(() => {
    const animes = formatAnimes(data);

    const filteredAnimes = animes.filter((anime) => {
      if (excludeAnimes.length === 0) return true;
      return !excludeAnimes.includes(anime.id);
    });
    const randomAnime = getRandomByArray(filteredAnimes);
    if (randomAnime) {
      setAnime(randomAnime);
    }
  }, [data, excludeAnimes]);

  const redo = () => {
    const animes = formatAnimes(data, options);
    const randomAnime = getRandomByArray(animes);
    if (randomAnime) {
      setAnime(randomAnime);
    }
  };

  return {
    anime,
    isLoading,
    redo,
  };
}

export function useGetAndFormatRandomAnimes(
  user: string,
  size: number,
  options?: FormatAnimesOptions
) {
  const { data, isLoading } = useGetAnimeByUser(user);
  const animes = formatAnimes(data, options);
  const randomAnimes = getManyRandom(animes, size);
  return {
    animes: randomAnimes,
    isLoading,
  };
}

function getManyRandom<T>(array: T[], size: number): T[] {
  const randoms: T[] = [];
  if (size === 0) return randoms;
  if (size >= array.length) return array;

  while (randoms.length < size) {
    const anime = array[Math.floor(Math.random() * array.length)];
    if (!randoms.includes(anime)) randoms.push(anime);
  }
  return randoms;
}
