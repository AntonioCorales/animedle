import { useEffect, useState } from "react";
import { useGameContext } from "./context";

export type Responses = "success" | "error" | "missing";

const RESPONSE_COLORS = {
  success: "bg-lime-600",
  error: "bg-red-500",
  missing: "bg-yellow-700",
};

export function useCompareGenres(genres: string[]) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {        
      const genresMatch = anime.genres.every((genre) => genres.includes(genre));
      if (genresMatch && genres.length === anime.genres.length) {
        setResponse("success");
        return;
      }

      const genresSomeMatch = anime.genres.some((genre) =>
        genres.includes(genre)
      );
      if (genresSomeMatch) {
        setResponse("missing");
        return;
      }
      setResponse("error");
    }
  }, [anime, genres]);

  return {
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}

export function useCompareTags(tags: string[]) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {
      const tagsMatch = anime.tags.every((tag) => tags.includes(tag));
      if (tagsMatch && tags.length === anime.tags.length) {

        setResponse("success");
        return;
      }

      const tagsSomeMatch = anime.tags.some((tag) => tags.includes(tag));
      if (tagsSomeMatch) {
        setResponse("missing");
        return;
      }
      setResponse("error");
    }
  }, [anime, tags]);

  return {
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}

export function useCompareYear(year: number) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {
      const yearMatch = anime.seasonYear === year;
      if (yearMatch) {
        setResponse("success");
        return;
      }
      setResponse("error");
    }
  }, [anime, year]);

  return {
    position: !anime?.seasonYear || anime.seasonYear === year ? "none" : year > anime.seasonYear ? "down" : "up",
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}

export function useCompareEpisodes(episodes: number) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {
      const episodesMatch = anime.episodes === episodes;
      if (episodesMatch) {
        setResponse("success");
        return;
      }
      setResponse("error");
    }
  }, [anime, episodes]);

  return {
    position: !anime?.episodes || anime.episodes === episodes ? "none" : episodes > anime.episodes ? "down" : "up",
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}

export function useCompareFormat(format: string) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {
      const formatMatch = anime.format === format;
      if (formatMatch) {
        setResponse("success");
        return;
      }
      setResponse("error");
    }
  }, [anime, format]);

  return {
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}

export function useCompareSeason(season: string) {
  const { anime } = useGameContext();

  const [response, setResponse] = useState<Responses>("missing");

  useEffect(() => {
    if (anime) {
      const seasonMatch = anime.season === season;
      if (seasonMatch) {
        setResponse("success");
        return;
      }
      setResponse("error");
    }
  }, [anime, season]);

  return {
    response,
    responseColor: RESPONSE_COLORS[response],
  };
}