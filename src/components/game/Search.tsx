"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import InputSearch from "../server-views/InputSearch";
import { SearchAnime, useGameContext } from "./context";
import { CloseOutlined } from "@mui/icons-material";
import { usePageContext } from "../context";
import { useGetAnimeByUser } from "../queries/getAnimeByUser";
import { formatAnimes, FormatAnimesOptions } from "../utils/useGetAnime";

export default function SearchAnimeSelect(props: SearchProps) {
  const {
    showMainGenre,
    showMainTag,
    showYears,
    onSelect,
    disabled,
    formatOptions,
    excludeAnimes,
  } = props;
  const { user } = usePageContext();
  const { data, isLoading } = useGetAnimeByUser(user);

  const [animes, setAnimes] = useState<SearchAnime[]>([]);

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredAnimes = useFilteredAnimes(excludeAnimes ?? [], animes, search);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (anime: SearchAnime) => {
      onSelect?.(anime);
      setSearch("");
      setIsOpen(false);
      if (ref.current) {
        const inputElement = ref.current?.querySelector(
          "input"
        ) as HTMLInputElement;
        inputElement?.focus();
      }
    },
    [onSelect]
  );

  useEffect(() => {
    const animes = formatAnimes(data, formatOptions);
    setAnimes(animes);
  }, [data, formatOptions]);

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
        setSelectedIndex(
          (prevIndex) => (prevIndex + 1) % filteredAnimes.length
        );
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex + filteredAnimes.length - 1) % filteredAnimes.length
        );
      }
    };

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const selectedAnime = filteredAnimes[selectedIndex];
        if (!selectedAnime) return;
        handleSelect(selectedAnime);
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
          disabled={disabled}
          className={props.className}
        />
        <button
          className={`absolute bottom-[2px] text-sm right-2 p-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 ${
            isOpen && search && !disabled ? "" : "hidden"
          }`}
          onClick={() => {
            setSearch("");
            setIsOpen(false);
          }}
        >
          <CloseOutlined />
        </button>
      </div>
      {search && !disabled && (
        <div
          id="options-search"
          className="text-white bg-slate-900 z-[9999] position absolute top-[100%] w-full max-h-[500px] overflow-y-auto "
        >
          {filteredAnimes?.map((filteredAnime, index) => (
            <div
              key={filteredAnime.id}
              className={`flex flex-row gap-3 p-2 hover:bg-slate-800 cursor-pointer ${
                selectedIndex === index
                  ? "bg-slate-700 selected hover:bg-slate-700"
                  : ""
              }`}
              onClick={() => {
                handleSelect(filteredAnime);
              }}
            >
              <div className="min-w-[60px] max-w-[60px]">
                <img
                  src={filteredAnime.image}
                  className="rounded-md w-full object-cover"
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

function useFilteredAnimes(
  selectedAnimesIds: number[],
  animes?: SearchAnime[],
  search?: string
) {
  const [filteredAnimes, setFilteredAnimes] = useState<SearchAnime[]>([]);

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
  formatOptions?: FormatAnimesOptions;
  className?: string;
  excludeAnimes?: number[];
};
