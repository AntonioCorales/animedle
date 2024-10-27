import { createContext, useContext, useEffect, useState } from "react";

type CounterContextType = {
  counter: number;
  state: "play" | "pause";
  setState: (state: "play" | "pause") => void;
  reset: () => void;
};

const CounterContext = createContext<CounterContextType>({
  counter: 0,
  state: "play",
  setState: () => {},
  reset: () => {},
});

export function CounterProvider({ children }: React.PropsWithChildren) {
  const [counter, setCounter] = useState<number>(0);
  const [state, setState] = useState<"play" | "pause">("pause");
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (state !== "play") return;
      setCounter((counter) => counter + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [counter, state]);

  const reset = () => {
    setState("pause");
    setCounter(0);
  };

  return (
    <CounterContext.Provider
      value={{
        counter,
        state,
        setState,
        reset,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  return useContext(CounterContext);
}
