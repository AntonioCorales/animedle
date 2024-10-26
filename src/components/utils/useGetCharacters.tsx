import { Character } from "@/types/anime";

export function getCharacterOrderByFavourites(characters: Character[]) {
  return characters.sort((a, b) => {
    if (a.favourites === b.favourites) {
      return a.name.full.localeCompare(b.name.full);
    }
    return b.favourites - a.favourites;
  });
}


