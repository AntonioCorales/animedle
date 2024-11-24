import { CharacterData, CharacterResponse } from "@/types/characters";

import { useMutation, useQuery } from "@tanstack/react-query";

// const queryCharacterByAnimeId = `query QueryChar($animeId: Int)
//    {
//   Media(id: $animeId) {
//     characters {
//       nodes {
//         id
//         age
//         gender
//         description
//         favourites
//         name {
//           full
//           alternative
//         }
//         image {
//           large
//           medium
//         }
//         media {
//           nodes {
//             format
//             title {
//               romaji
//             }
//           }
//         }
//       }
//     }
//   }
// }`;

// export function useGetCharactersByAnimeIdMAL(animeId?: number) {
//   return useQuery<CharacterData[]>({
//     queryKey: ["characters", animeId],
//     queryFn: async () => {
//       const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`) ;
//       const { data } = await response.json() as CharacterResponse;

//       return data;
//     },
//     enabled: !!animeId,
//     refetchOnWindowFocus: false,
//   });
// }

export function useGetCharactersByAnimeIdMAL() {
  return useMutation({
    mutationFn: async (animeId: number) => {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/characters`
      );
      const { data } = await response.json() as CharacterResponse;

      return data;
    },
  });
}
