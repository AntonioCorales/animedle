export type CharacterResponse = {
  data: CharacterData[];
};

export type CharacterRoles = "Main" | "Supporting";

export type CharacterData = {
  character: Character;
  role: CharacterRoles;
  voiceActors: VoiceActor[];
  favorites: number;
};

type CharacterImage = {
    jpg: Image;
    webp: Image;
  }

export type Character = {
  mal_id: number;
  url: string;
  images: CharacterImage;
  name: string;
};

export type Image = {
  image_url: string;
  small_image_url: string;
};

export type VoiceActor = {
  person: Person;
  language: string;
};

export type Person = {
  mal_id: number;
  url: string;
  images: Images;
  name: string;
};

export type Jpg = {
  imageURL: string;
};

export type CharacterDetails = {
  mal_id: number;
  url: string;
  images: CharacterImage;
  name: string;
  nameKanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  anime: AnimeElement[];
  manga: Manga[];
  voices: Voice[];
};

export type AnimeElement = {
  role: string;
  anime: MangaClass;
};

export type MangaClass = {
  mal_id: number;
  url: string;
  images: { [key: string]: AnimeImage };
  title: string;
};

export type AnimeImage = {
  imageURL: string;
  smallImageURL: string;
  largeImageURL: string;
};

export type DataImage = {
  imageURL: string;
  smallImageURL: string;
};

export type Manga = {
  role: string;
  manga: MangaClass;
};

export type Voice = {
  language: string;
  person: Person;
};

export type Images = {
  jpg: Jpg;
};
