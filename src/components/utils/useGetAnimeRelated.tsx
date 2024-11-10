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
  const relatedAnimes2 = animes.filter((anime) => {
    return anime.relations.some((relation) => relation.id === anime.id);
  });

  relatedAnimes.push(...relatedAnimes2);

  relatedAnimes.forEach((relatedAnime) => {
    if (ListExcludesRelations.includes(relatedAnime.id)) return;
    const animeRel = animes.find((anime) => anime.id === relatedAnime.id);
    if (!animeRel) return;    
    animeRel.relations.forEach((relation) => {
        if (ListExcludesRelations.includes(relation.id)) return;
        if (relatedAnimes.some((relatedAnime) => relatedAnime.id === relation.id)) return;
        relatedAnimes.push(relation);
    });
    
  });

  relatedAnimes.push({
    id: anime.id,
    idMal: anime.idMal,
    name: anime.name,
    englishName: anime.englishName,
  });
  return relatedAnimes;
}
