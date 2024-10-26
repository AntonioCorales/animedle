"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import InputSearch from "../server-views/InputSearch";
import { SearchAnime, useGameContext } from "./context";
import Image from "next/image";
import { CloseOutlined } from "@mui/icons-material";
import { usePageContext } from "../context";

export default function Search(props: SearchProps) {
  const { showMainGenre, showMainTag, showYears, onSelect } = props;
  const { state } = useGameContext();
  const { animes } = usePageContext();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredAnimes = useFilteredAnimes(animes, search);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((anime: SearchAnime) => {
    onSelect?.(anime);
    setSearch("");
    setIsOpen(false);
    if (ref.current) {
      const inputElement = ref.current?.querySelector(
        "input"
      ) as HTMLInputElement;
      inputElement?.focus();
    }
  },[onSelect]);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredAnimes.length);
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          (prevIndex + filteredAnimes.length - 1) % filteredAnimes.length
        );
      }
    };

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSelect(filteredAnimes[selectedIndex]);
      }
    };

    const divElement = ref.current;

    divElement?.addEventListener("click", handleClickInside);
    document.addEventListener("click", handleClickOutside);
    divElement?.addEventListener("focusIn", () => {
      setIsOpen(true);
    });
    divElement?.addEventListener("keydown", handleKeyDown);
    divElement?.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      divElement?.removeEventListener("click", handleClickInside);
      divElement?.removeEventListener("keydown", handleKeyDown);
      divElement?.removeEventListener("keydown", handleEnter);
    };
  }, [ref, filteredAnimes, handleSelect, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const optionsElement = document.getElementById("options-search");
    if (optionsElement) {
      const selectedOption = optionsElement.querySelector(".selected");
      if (selectedOption) {
        selectedOption.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="flex flex-col gap-2 relative">
      <div ref={ref} className="relative">
        <InputSearch
          value={search}
          placeholder="Buscar"
          onChange={(e) => setSearch(e.target.value)}
          disabled={state === "win" || props.disabled}
        />
        <button
          className={`absolute bottom-[2px] text-sm right-2 p-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 ${
            isOpen && search && state === "play" ? "" : "hidden"
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
          {filteredAnimes?.map((filteredAnime, index) => (
            <div
              key={filteredAnime.id}
              className={`flex flex-row gap-3 p-2 hover:bg-slate-800 cursor-pointer ${selectedIndex === index ? "bg-slate-700 selected hover:bg-slate-700" : ""}`}
              onClick={() => {
                handleSelect(filteredAnime);
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

type SearchProps = {
  disabled?: boolean;
  showMainGenre?: boolean;
  showMainTag?: boolean;
  showYears?: boolean;
  onSelect?: (anime: SearchAnime) => void;
};
