import { SearchAnime, SearchAnimeRelation } from "../game/context";

const ListExcludesRelations = [104454, 110178, 117074, 176287];

export function useGetAnimeRelated(
  animes: SearchAnime[],
  animeId?: number | null
): SearchAnimeRelation[] {
  if (!animeId) return [];
  const anime = animes.find((anime) => anime.id === animeId);
  if (!anime) return [];

  const relatedAnimes = [...anime.relations];
  const relatedAnimes2 = animes.filter((animeF) => {
    return animeF.relations.some((relation) => relation.id === anime.id);
  });

  // console.log({ relatedAnimes2 });

  relatedAnimes.push(...relatedAnimes2);

  relatedAnimes.forEach((relatedAnime) => {
    if (ListExcludesRelations.includes(relatedAnime.id)) return;
    const animeRel = animes.find((animeF) => animeF.id === relatedAnime.id);
    if (!animeRel) return;
    animeRel.relations.forEach((relation) => {
      if (ListExcludesRelations.includes(relation.id)) return;
      relatedAnimes.push(relation);
    });
  });

  // console.log({ relatedAnimes });

  relatedAnimes.push({
    id: anime.id,
    idMal: anime.idMal,
    name: anime.name,
    englishName: anime.englishName,
  });
  return relatedAnimes;
}
