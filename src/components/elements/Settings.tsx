"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMEDLE_FORMATS_KEY, LIST_NAMES, LIST_NAMES_KEY, usePageContext } from "../context";
import { Settings } from "@mui/icons-material";
import {
  ANIME_FORMATS,
  Format,
  ListName,
} from "@/types/anime";

export type AnimedleHints = {
  showYears: boolean;
  showMainGenre: boolean;
  showMainTag: boolean;
};

export const ANIMEDLE_HINTS_KEY = "animedleHints";
export const DEFAULT_ANIMEDLE_HINTS: AnimedleHints = {
  showYears: false,
  showMainGenre: false,
  showMainTag: false,
};

export function readAnimedleHints(): AnimedleHints {
  try {
    const item = localStorage.getItem(ANIMEDLE_HINTS_KEY);
    if (!item) {
      localStorage.setItem(
        ANIMEDLE_HINTS_KEY,
        JSON.stringify(DEFAULT_ANIMEDLE_HINTS)
      );
      return { ...DEFAULT_ANIMEDLE_HINTS };
    }
    const parsed = JSON.parse(item);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      localStorage.setItem(
        ANIMEDLE_HINTS_KEY,
        JSON.stringify(DEFAULT_ANIMEDLE_HINTS)
      );
      return { ...DEFAULT_ANIMEDLE_HINTS };
    }
    return { ...DEFAULT_ANIMEDLE_HINTS, ...parsed };
  } catch {
    return { ...DEFAULT_ANIMEDLE_HINTS };
  }
}

export default function OptionsMenu() {
  const { user, listNames, setListNames, handleSetData, formats, setFormats } = usePageContext();
  const [newUser, setNewUser] = useState(user);
  const [newListOptions, setNewListOptions] = useState<ListName[]>(listNames);
  const [newFormats, setNewFormats] = useState<Format[]>(formats);
  const [hints, setHints] = useState<AnimedleHints>(DEFAULT_ANIMEDLE_HINTS);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNewUser(user);
    setNewListOptions(listNames);
    setNewFormats(formats);
    setHints(readAnimedleHints());
  }, [user, listNames, formats]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleHint = (key: keyof AnimedleHints) => {
    const newHints = { ...hints, [key]: !hints[key] };
    setHints(newHints);
    localStorage.setItem(ANIMEDLE_HINTS_KEY, JSON.stringify(newHints));
    window.dispatchEvent(new Event("animedle-hints-change"));
  };

  const toggleFormat = (format: Format) => {
    let updated: Format[];
    if (newFormats.includes(format)) {
      updated = newFormats.filter((f) => f !== format);
      if (updated.length === 0) return;
    } else {
      updated = [...newFormats, format];
    }
    setNewFormats(updated);
    setFormats(updated);
    localStorage.setItem(ANIMEDLE_FORMATS_KEY, JSON.stringify(updated));
  };

  const toggleListOption = (listName: ListName) => {
    let updated: ListName[];
    if (newListOptions.includes(listName)) {
      updated = newListOptions.filter((name) => name !== listName);
      if (updated.length === 0) return;
    } else {
      updated = [...newListOptions, listName];
    }
    setNewListOptions(updated);
    setListNames(updated);
    localStorage.setItem(LIST_NAMES_KEY, JSON.stringify(updated));
  };

  return (
    <div ref={containerRef} className="relative z-[9999]">
      <button className="hover:text-gray-200" onClick={toggleOpen}>
        <Settings sx={{ fontSize: 16 }} />
      </button>
      {isOpen && (
        <div className="absolute top-full p-2 right-0 w-72 bg-slate-900 border border-gray-400 rounded-md shadow-lg flex flex-col gap-2">
          <h3 className="text-gray-300">Configuración</h3>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex w-full">
              <label
                htmlFor="user"
                className="text-left flex flex-col gap-1 w-full"
              >
                Usuario de Anilist
                <input
                  type="text"
                  id="user"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  className="text-white outline-none bg-slate-800 border border-gray-500 rounded-sm p-1 w-full"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="flex flex-row gap-2 flex-wrap">
              <div className="flex flex-row gap-2 flex-wrap">
                {LIST_NAMES.map((listName) => (
                  <label key={listName} className="flex flex-row gap-1">
                    <input
                      type="checkbox"
                      checked={newListOptions.includes(listName)}
                      onChange={() => toggleListOption(listName)}
                    />
                    <span className="select-none">{listName}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-400 text-left">
                Formatos de anime
              </p>
              <div className="flex flex-row gap-2 flex-wrap">
                {ANIME_FORMATS.map((format) => (
                  <label key={format} className="flex flex-row gap-1">
                    <input
                      type="checkbox"
                      checked={newFormats.includes(format)}
                      onChange={() => toggleFormat(format)}
                    />
                    <span className="select-none">{format}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              className="bg-slate-800 text-white p-1 rounded-sm w-full hover:bg-slate-700"
              onClick={() => {
                handleSetData(newUser, newListOptions);
                toggleOpen();
              }}
            >
              Guardar
            </button>
          </div>
          <div className="border-t border-gray-700 pt-2 flex flex-col gap-1">
            <h4 className="text-gray-300">Configuración de Animedle</h4>
            <div>
              <p className="text-xs text-slate-400 text-left">Búsqueda</p>
              <label className="flex flex-row gap-1 select-none">
                <input
                  type="checkbox"
                  checked={hints.showYears}
                  onChange={() => toggleHint("showYears")}
                />
                <span>Ver años</span>
              </label>
              <label className="flex flex-row gap-1 select-none">
                <input
                  type="checkbox"
                  checked={hints.showMainGenre}
                  onChange={() => toggleHint("showMainGenre")}
                />
                <span>Ver género principal</span>
              </label>
              <label className="flex flex-row gap-1 select-none">
                <input
                  type="checkbox"
                  checked={hints.showMainTag}
                  onChange={() => toggleHint("showMainTag")}
                />
                <span>Ver etiqueta principal</span>
              </label>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
