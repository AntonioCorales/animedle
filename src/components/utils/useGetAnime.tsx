import { ListName, MediaListCollection } from "@/types/anime";
import { SearchAnime } from "../game/context";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { getRandomByArray } from "./functions";
import { useEffect, useState } from "react";

export type FormatAnimesOptions = {
  types?: ListName[];
  tagsLimit?: number;
};

const DEFAULT_OPTIONS = {
  types: ["Completed"],
};

export function formatAnimes(
  animes?: MediaListCollection,
  options?: FormatAnimesOptions
): SearchAnime[] {
  if (!animes) return [];
  const { types = DEFAULT_OPTIONS.types, tagsLimit } = options || {};
  if (types.length === 0) return [];
  const listAnimes = animes.lists.find((list) => {
    return types.includes(list.name);
  });
  if (!listAnimes) return [];

  return listAnimes.entries.map((entry) => {
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
    };
  });
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
  };
}

export function useGetAndFormatRandomAnime(
  user: string,
  options?: FormatAnimesOptions
) {
  const { data, isLoading } = useGetAnimeByUser(user);

  const [anime, setAnime] = useState<SearchAnime>();

  useEffect(() => {
    const animes = formatAnimes(data, options);
    const randomAnime = getRandomByArray(animes);
    if (randomAnime) {
      setAnime(randomAnime);
    }
  }, [data, options]);

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
