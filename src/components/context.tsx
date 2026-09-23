"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SearchAnime } from "./game/context";
import { useGetAndFormatAnimes } from "./utils/useGetAnime";
import {
  Format,
  ListName,
} from "@/types/anime";

export const LIST_NAMES: ListName[] = ["Completed", "Watching", "Dropped", "Paused", "Planning"];
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

function readStoredListNames(): ListName[] {
  try {
    const raw = localStorage.getItem(LIST_NAMES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (name): name is ListName =>
        typeof name === "string" &&
        (LIST_NAMES as readonly string[]).includes(name)
    );
  } catch {
    return [];
  }
}

function readStoredFormats(): Format[] {
  try {
    const raw = localStorage.getItem(ANIMEDLE_FORMATS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f): f is Format => typeof f === "string");
  } catch {
    return [];
  }
}

function readStoredUser(): string {
  try {
    return localStorage.getItem(USER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("");
  const [listNames, setListNames] = useState<ListName[]>([]);
  const [formats, setFormats] = useState<Format[]>([]);
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
    localStorage.setItem(USER_KEY, user);
    localStorage.setItem(LIST_NAMES_KEY, JSON.stringify(listNames));
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
