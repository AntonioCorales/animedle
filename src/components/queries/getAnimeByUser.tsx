import { MediaListCollection } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";

const queryAnimeByUser = `query Query($userName: String, $type: MediaType) {
  MediaListCollection(userName: $userName, type: $type) {
    lists {
      name
      entries {        
        id
        media {
          id
          idMal
          title {
            native
            romaji
            english
          }
          genres
          episodes
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          hashtag
          description
          synonyms
          seasonYear
          season
          format
          tags {
            name
          }
        }
      }
      
    }
  }
}`;

export function useGetAnimeByUser(userName: string) {
  return useQuery<MediaListCollection>({
    queryKey: ["anime", userName],
    queryFn: async () => {
      const response = await fetch(`https://graphql.anilist.co/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: queryAnimeByUser,
          variables: {
            userName,
            type: "ANIME",
          },
        }),
      });
      const { data } = await response.json();
      const { MediaListCollection } = data;
      return MediaListCollection;
    },
    enabled: !!userName && !!userName.trim(),
    refetchOnWindowFocus: false,
  });
}
