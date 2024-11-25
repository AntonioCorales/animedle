"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SearchAnime } from "./game/context";
import { useGetAndFormatAnimes } from "./utils/useGetAnime";
import { ListName } from "@/types/anime";

export const LIST_NAMES: ListName[] = ["Completed", "Watching", "Dropped", "Paused", "Planning"];

type PageContext = {
  user: string;
  setUser: (user: string) => void;
  animes: SearchAnime[];
  isLoading: boolean;
  listNames: ListName[];
  setListNames: (listNames: ListName[]) => void;
  handleSetData: (user: string, listNames: ListName[]) => void;
  allAnimes: SearchAnime[];
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
});

const DEFAULT_LIST_NAMES: ListName[] = ["Completed"];
const DEFAULT_USER = "DoubleCReacts";

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("");
  const [listNames, setListNames] = useState<ListName[]>([]);
  const { animes, isLoading, allAnimes } = useGetAndFormatAnimes(user, {
    types: listNames,
  });

  useEffect(() => {
    const localListNames = localStorage.getItem("listNames");
    const user = localStorage.getItem("user");
    if (localListNames) {
      setListNames(JSON.parse(localListNames));
    } else {
      setListNames(DEFAULT_LIST_NAMES);
      localStorage.setItem("listNames", JSON.stringify(DEFAULT_LIST_NAMES));
    }
    if (user) {
      setUser(user);
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem("user", DEFAULT_USER);
    }
  }, []);

  const handleSetData = (user: string, listNames: ListName[]) => {
    setUser(user);
    setListNames(listNames);
    localStorage.setItem("user", user);
    localStorage.setItem("listNames", JSON.stringify(listNames));
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
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
