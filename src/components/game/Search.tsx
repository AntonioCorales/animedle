"use client";

import { useEffect, useRef, useState } from "react";
import InputSearch from "../server-views/InputSearch";
import { SearchAnime, useGameContext } from "./context";
import Image from "next/image";
import { CloseOutlined } from "@mui/icons-material";

export default function Search() {
  const { animes, addAnime, state, anime, setState, showMainGenre, showMainTag, showYears } = useGameContext();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredAnimes = useFilteredAnimes(animes, search);
  

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const inputElement = ref.current?.querySelector(
          "input"
        ) as HTMLInputElement;

        if (inputElement) {
        }
      }
    };

    const handleClickInside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        setIsOpen(true);
      }
    };
    const divElement = ref.current;

    divElement?.addEventListener("click", handleClickInside);
    document.addEventListener("click", handleClickOutside);
    divElement?.addEventListener("focusIn", () => {
      setIsOpen(true);
    });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      divElement?.removeEventListener("click", handleClickInside);
    };
  }, [ref]);

  return (
    <div className="flex flex-col gap-2 relative">
      <div ref={ref} className="relative">
        <InputSearch
          value={search}
          placeholder="Buscar"
          onChange={(e) => setSearch(e.target.value)}
          disabled={state === "win"}
        />
        <button
          className={`absolute bottom-[2px] text-sm right-2 p-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 ${
            isOpen && search && state === "play"? "" : "hidden"
          }`}
          onClick={() => {
            setSearch("");
            setIsOpen(false);
          }}
        >
          <CloseOutlined />
        </button>
      </div>
      {search && state === "play" && (
        <div
          id="options-search"
          className="text-white bg-slate-900 z-[9999] position absolute top-[100%] w-full max-h-[500px] overflow-y-auto "
        >
          {filteredAnimes?.map((filteredAnime) => (
            <div
              key={filteredAnime.id}
              className="flex flex-row gap-3 p-2 hover:bg-slate-800 cursor-pointer"
              onClick={() => {
                if (state === "play") {
                  addAnime(filteredAnime);
                  setSearch("");
                  setIsOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                if(filteredAnime.id === anime?.id){
                  setState("win");
                  return;
                }
                if(ref.current){
                  const inputElement = ref.current?.querySelector(
                    "input"
                  ) as HTMLInputElement;
                  inputElement?.focus();
                }
              }}
            >
              <div className="min-w-[60px] max-w-[60px]">
                <Image
                  src={filteredAnime.image}
                  className="rounded-md w-full"
                  alt={filteredAnime.name}
                  width={60}
                  height={85}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold leading-5">
                  {filteredAnime.name}
                </span>
                <span className="text-sm text-slate-400 leading-4">
                  {filteredAnime.englishName}
                </span>
                <div className="text-xs text-sky-400 leading-4 flex flex-col gap-1">
                  {showMainGenre && <span>{filteredAnime.genres[0]}</span>}
                  {showMainTag && <span>{filteredAnime.tags[0]}</span>}
                  {showYears && <span>{filteredAnime.seasonYear}</span>}
                </div>
              </div>
            </div>
          ))}
          {animes && filteredAnimes.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-2">
              No hay resultados
            </div>
          )}
          {!animes && (
            <div className="text-center text-slate-400 text-sm py-2">
              Cargando...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function useFilteredAnimes(animes?: SearchAnime[], search?: string) {
  const [filteredAnimes, setFilteredAnimes] = useState<SearchAnime[]>([]);
  const { selectedAnimesIds } = useGameContext();

  useEffect(() => {
    if (search && animes) {
      const filteredStartsWith = animes.filter((anime) => {
        if (selectedAnimesIds.includes(anime.id)) {
          return false;
        }
        return (
          anime.name.toLowerCase().startsWith(search.toLowerCase()) ||
          anime.altNames.some((altName) =>
            altName.toLowerCase().startsWith(search.toLowerCase())
          )
        );
      });

      const filteredIncludes = animes.filter((anime) => {
        if (selectedAnimesIds.includes(anime.id)) {
          return false;
        }
        return anime.altNames.some((altName) =>
          altName.toLowerCase().includes(search.toLowerCase())
        );
      });

      const filteredSet = new Set([...filteredStartsWith, ...filteredIncludes]);

      setFilteredAnimes(Array.from(filteredSet));
    } else {
      setFilteredAnimes(
        animes?.filter((anime) => {
          if (selectedAnimesIds.includes(anime.id)) {
            return false;
          }
          return true;
        }) ?? []
      );
    }
  }, [animes, search, selectedAnimesIds]);

  return filteredAnimes.slice(0, 10);
}
