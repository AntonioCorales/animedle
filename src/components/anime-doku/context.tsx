import { createContext, useContext, useState } from "react";
import { SearchAnime } from "../game/context";

export type NumberOperator = "lt" | "lte" | "gt" | "gte" | "eq" | "neq";
export type StringOperator = "contains" | "notContains";
export type OptionType = "year" | "genre" | "tag" | "format" | "chapters";

export type OptionLine =
  | {
      type: "year";
      value: number;
      operator: NumberOperator;
    }
  | {
      type: "genre";
      value: string[];
      operator: StringOperator;
    }
  | {
      type: "tag";
      value: string[];
      operator: StringOperator;
    }
  | {
      type: "format";
      value: string;
      operator: StringOperator;
    }
  | {
      type: "chapters";
      value: number;
      operator: NumberOperator;
    };

type AnimeDokuContext = {
  size: number;
  setSize: (size: number) => void;
  optionsVertical: OptionLine[];
  optionsHorizontal: OptionLine[];
  matriz: SearchAnime[][];
};

const AnimeDokuContext = createContext<AnimeDokuContext>({
  size: 3,
  setSize: () => {},
  optionsVertical: [],
  optionsHorizontal: [],
  matriz: [],
});

export function AnimeDokuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useState(3);
  const [optionsVertical, setOptionsVertical] = useState<OptionLine[]>([]);
  const [optionsHorizontal, setOptionsHorizontal] = useState<OptionLine[]>([]);
  const [matriz, setMatriz] = useState<SearchAnime[][]>([]);
  

  return (
    <AnimeDokuContext.Provider
      value={{
        size,
        setSize,
        optionsVertical,
        optionsHorizontal,
        matriz
      }}
    >
      {children}
    </AnimeDokuContext.Provider>
  );
}

export function useAnimeDokuContext() {
  return useContext(AnimeDokuContext);
}