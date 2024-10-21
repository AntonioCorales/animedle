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

export type List = {
  name: "Completed" | "Watching" | "Dropped" | "Paused";
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
  tags: {name: string}[];
  seasonYear: number;
  season: string;
  format: string;
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
