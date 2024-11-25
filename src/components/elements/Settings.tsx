"use client";

import { useEffect, useState } from "react";
import { LIST_NAMES, usePageContext } from "../context";
import { Settings } from "@mui/icons-material";
import { ListName } from "@/types/anime";

export default function OptionsMenu() {
  const {user, listNames, handleSetData } = usePageContext();
  const [newUser, setNewUser] = useState(user);
  const [newListOptions, setNewListOptions] = useState<ListName[]>(listNames);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    setNewUser(user);
    setNewListOptions(listNames);
  },[ user, listNames ]);

  return (
    <div className="relative z-[9999]">
      <button className="hover:text-gray-200" onClick={toggleOpen}>
        <Settings className="text-base"/>
      </button>
      {isOpen && (
        <div className="absolute top-full p-2 right-0 w-72 bg-slate-900 border border-gray-400 rounded-md shadow-lg flex flex-col gap-1">
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
                      onChange={() => {
                        if (newListOptions.includes(listName)) {
                          const newList = newListOptions.filter((name) => name !== listName);
                          if (newList.length === 0) return;
                          setNewListOptions(newList);
                        } else {
                          setNewListOptions([...newListOptions, listName]);
                        }
                      }}
                    />
                    <span className="select-none">{listName}</span>
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
        </div>
      )}
    </div>
  );
}
