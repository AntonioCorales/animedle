"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SearchAnime } from "./game/context";
import { useGetAndFormatAnimes } from "./utils/useGetAnime";
import {
  DEFAULT_ANIME_FORMATS,
  DEFAULT_LIST_NAMES,
  Format,
  ListName,
} from "@/types/anime";

export const LIST_NAMES: ListName[] = [
  "Completed",
  "Watching",
  "Dropped",
  "Paused",
  "Planning",
];
export const USER_KEY = "user";
export const LIST_NAMES_KEY = "listNames";
export const ANIMEDLE_FORMATS_KEY = "animedleFormats";

type PageContext = {
  user: string;
  setUser: (user: string) => void;
  animes: SearchAnime[];
  isLoading: boolean;
  listNames: ListName[];
  setListNames: (listNames: ListName[]) => void;
  handleSetData: (user: string, listNames: ListName[]) => void;
  allAnimes: SearchAnime[];
  formats: Format[];
  setFormats: (formats: Format[]) => void;
};

const PageContext = createContext<PageContext>({
  user: "",
  setUser: () => {},
  listNames: [],
  setListNames: () => {},
  animes: [],
  isLoading: false,
  handleSetData: () => {},
  allAnimes: [],
  formats: [],
  setFormats: () => {},
});

function safeRead(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (e.g. disabled / quota exceeded)
  }
}

function readStoredListNames(): ListName[] {
  const raw = safeRead(LIST_NAMES_KEY);
  if (!raw) {
    safeWrite(LIST_NAMES_KEY, JSON.stringify(DEFAULT_LIST_NAMES));
    return [...DEFAULT_LIST_NAMES];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      safeWrite(LIST_NAMES_KEY, JSON.stringify(DEFAULT_LIST_NAMES));
      return [...DEFAULT_LIST_NAMES];
    }
    const filtered = parsed.filter(
      (name): name is ListName =>
        typeof name === "string" &&
        (LIST_NAMES as readonly string[]).includes(name)
    );
    if (filtered.length === 0) {
      safeWrite(LIST_NAMES_KEY, JSON.stringify(DEFAULT_LIST_NAMES));
      return [...DEFAULT_LIST_NAMES];
    }
    return filtered;
  } catch {
    safeWrite(LIST_NAMES_KEY, JSON.stringify(DEFAULT_LIST_NAMES));
    return [...DEFAULT_LIST_NAMES];
  }
}

function readStoredFormats(): Format[] {
  const raw = safeRead(ANIMEDLE_FORMATS_KEY);
  if (!raw) {
    safeWrite(ANIMEDLE_FORMATS_KEY, JSON.stringify(DEFAULT_ANIME_FORMATS));
    return [...DEFAULT_ANIME_FORMATS];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      safeWrite(ANIMEDLE_FORMATS_KEY, JSON.stringify(DEFAULT_ANIME_FORMATS));
      return [...DEFAULT_ANIME_FORMATS];
    }
    const filtered = parsed.filter((f): f is Format => typeof f === "string");
    if (filtered.length === 0) {
      safeWrite(ANIMEDLE_FORMATS_KEY, JSON.stringify(DEFAULT_ANIME_FORMATS));
      return [...DEFAULT_ANIME_FORMATS];
    }
    return filtered;
  } catch {
    safeWrite(ANIMEDLE_FORMATS_KEY, JSON.stringify(DEFAULT_ANIME_FORMATS));
    return [...DEFAULT_ANIME_FORMATS];
  }
}

function readStoredUser(): string {
  const raw = safeRead(USER_KEY);
  if (raw === null) {
    safeWrite(USER_KEY, "");
    return "";
  }
  return raw;
}

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("");
  const [listNames, setListNames] = useState<ListName[]>(DEFAULT_LIST_NAMES);
  const [formats, setFormats] = useState<Format[]>(DEFAULT_ANIME_FORMATS);
  const { animes, isLoading, allAnimes } = useGetAndFormatAnimes(user, {
    types: listNames,
    formats,
  });

  useEffect(() => {
    setUser(readStoredUser());
    setListNames(readStoredListNames());
    setFormats(readStoredFormats());
  }, []);

  const handleSetData = (user: string, listNames: ListName[]) => {
    setUser(user);
    setListNames(listNames);
    safeWrite(USER_KEY, user);
    safeWrite(LIST_NAMES_KEY, JSON.stringify(listNames));
  };

  return (
    <PageContext.Provider
      value={{
        user,
        setUser,
        animes,
        isLoading,
        listNames,
        setListNames,
        handleSetData,
        allAnimes,
        formats,
        setFormats,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}