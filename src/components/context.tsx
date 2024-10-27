"use client";
import { createContext, useContext, useState } from "react";
import { SearchAnime } from "./game/context";
import { useGetAndFormatAnimes } from "./utils/useGetAnime";

type PageContext = {
    
  user: string;
  setUser: (user: string) => void;
  animes: SearchAnime[];
};

const PageContext = createContext<PageContext>({
  user: "",
  setUser: () => {},
  animes: [],
});

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("DoubleCReacts");
  const { animes } = useGetAndFormatAnimes(user, {
    tagsLimit: 4,
  });

  return (
    <PageContext.Provider
      value={{
        user,
        setUser,
        animes,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
