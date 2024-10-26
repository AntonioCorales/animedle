export type Data = {
  mediaListCollection: MediaListCollection;
};

export type MediaType = "ANIME";

export type MediaListCollection = {
  lists: List[];
};

export type ResponseAnime = {
  Media: Media;
};

export type ResponseAnimeByUser = {
  MediaListCollection: MediaListCollection;
};

export type ListName = "Completed" | "Watching" | "Dropped" | "Paused";

export type List = {
  name: ListName;
  entries: Entry[];
};

export type Entry = {
  id: number;
  media: Media;
};

export type Media = {
  id: number;
  idMal: number;
  title: Title;
  genres: Genre[];
  chapters: null;
  coverImage: CoverImage;
  bannerImage: null | string;
  hashtag: null | string;
  description: null | string;
  episodes: number;
  tags: { name: string }[];
  seasonYear: number;
  season: string;
  format: string;
  synonyms: string[];
};

export type CoverImage = {
  extraLarge: string;
  large: string;
  medium: string;
};

export type Genre =
  | "Comedy"
  | "Romance"
  | "Slice of Life"
  | "Fantasy"
  | "Action"
  | "Drama"
  | "Supernatural"
  | "Sports"
  | "Sci-Fi"
  | "Adventure"
  | "Horror"
  | "Psychological"
  | "Thriller"
  | "Mystery"
  | "Ecchi"
  | "Mecha"
  | "Music"
  | "Mahou Shoujo";

export type Title = {
  native: string;
  romaji: string;
  english: null | string;
};

export type Gender = "Female" | "Male";

export type Image = {
  large: string;
  medium: string;
};

export type Name = {
  full:        string;
  alternative: string[];
}

export type Character = {
  id: number;
  age: null | string;
  gender: Gender;
  description: null | string;
  favourites: number;
  name: Name;
  image: Image;
  media: MediaClass;
};

export type MediaClass = {
  nodes: MediaNode[];
}

export type MediaNode = {
  id: number;
  idMal: number;
  format: Format;
  title:  Title;
}
export type Format = "NOVEL" | "TV" | "MANGA" | "ONE_SHOT";
