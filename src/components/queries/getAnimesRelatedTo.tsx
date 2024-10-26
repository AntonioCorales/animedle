import { AnimeRelationResponse, AnimeRelations } from "@/types/animes-related";
import { AnimeRelatedResponseAL, Media } from "@/types/animes-related-al";
import { useQuery } from "@tanstack/react-query";

export function useGetAnimesRelatedToMAL(animeId?: number) {
  return useQuery<AnimeRelations[]>({
    queryKey: ["animesRelatedTo", animeId],
    queryFn: async () => {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/relations`
      );
      const { data } = (await response.json()) as AnimeRelationResponse;

      return data;
    },
    enabled: !!animeId,
    refetchOnWindowFocus: false,
  });
}

const animesRelatedToQuery = `
  query Media($mediaId: Int) {
  Media(id: $mediaId) {
    title {
      romaji
      english
    }
    id
    idMal
    relations {
      nodes {
        id
        idMal
        title {
          romaji
          english
        }
      }
    }
  }
}
`;

export function useGetAnimesRelatedToAL(animeId?: number) {
  return useQuery<Media[]>({
    queryKey: ["animesRelatedToAL", animeId],
    queryFn: async () => {
      const response = await fetch(`https://graphql.anilist.co/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: animesRelatedToQuery,
          variables: {
            mediaId: animeId,
            type: "ANIME",
          },
        }),
      });
      const { data } = (await response.json()) as AnimeRelatedResponseAL;
      const { Media } = data;
      const { relations, ...rest } = Media;
      const toReturn: Media[] = [{ ...rest }];
      if (relations?.nodes) {
        toReturn.push(...relations.nodes);
      }
      return toReturn;
    },
    enabled: !!animeId,
    refetchOnWindowFocus: false,
  });
}
