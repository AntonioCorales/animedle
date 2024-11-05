"use client";
import { createContext, useContext, useState } from "react";
import { SearchAnime } from "./game/context";
import { useGetAndFormatAnimes } from "./utils/useGetAnime";

type PageContext = {
    
  user: string;
  setUser: (user: string) => void;
  animes: SearchAnime[];
  isLoading: boolean;
};

const PageContext = createContext<PageContext>({
  user: "",
  setUser: () => {},
  animes: [],
  isLoading: false,
});

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("DoubleCReacts");
  const { animes, isLoading } = useGetAndFormatAnimes(user);

  return (
    <PageContext.Provider
      value={{
        user,
        setUser,
        animes,
        isLoading
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
