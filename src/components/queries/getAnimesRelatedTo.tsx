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
    id
    idMal
    synonyms
    title {
      romaji
      english
    }
    relations {
      nodes {
        id
        idMal
        synonyms
        title {
          romaji
          english
        }
        relations {
          nodes {
            id
            idMal
            synonyms
            title {
              romaji
              english
            }
          }
        }
      }
    }
  }
}
`;

const ListExcludesRelations = [104454, 110178, 117074]

function flattenMedia(data: Media, idAnime?: number): Media[] {
  const uniqueMediaMap = new Map<number, Media>();
  const mainIsExclude = idAnime ? ListExcludesRelations.includes(idAnime) : false;
  let depth = 0;

  function traverseNodes(nodes?: Media[]) {
    if(!nodes) return;
    nodes.forEach(node => {
      const media: Media = {
        title: {
          romaji: node.title.romaji,
          english: node.title.english || null
        },
        id: node.id,
        idMal: node.idMal
      };

      // Agregar a uniqueMediaMap solo si no existe con el mismo `id`
      if (!uniqueMediaMap.has(media.id)) {
        uniqueMediaMap.set(media.id, media);
      }

      // Recursividad para nodos relacionados
      if (node.relations && node.relations.nodes) {
        const nodeIsExclude = ListExcludesRelations.includes(node.id);
        if(depth > 0 && !mainIsExclude && nodeIsExclude) return;
        traverseNodes(node.relations.nodes);
      }

      depth++;
    });
  }

  // Iniciar el recorrido de la lista principal de nodos
  traverseNodes(data.relations?.nodes);

  // Convertir el Map a un array
  return Array.from(uniqueMediaMap.values());
}

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
      const flattenMediaList = flattenMedia(Media, animeId);
      return flattenMediaList;
    },
    enabled: !!animeId,
    refetchOnWindowFocus: false,
  });
}
