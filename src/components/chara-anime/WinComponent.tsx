import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti";
import { useCharaAnimeContext } from "./context";

export function WinComponent() {
  const { status } = useCharaAnimeContext();

  const [height, setHeight] = useState(0);

  const updateWindowSize = () => {
    const totalHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    setHeight(totalHeight);
  };

  useEffect(() => {
    updateWindowSize();
  }, []);

  return (
    <>
      {status === "end" && (
        <ConfettiExplosion
          style={{
            zIndex: 1000,
            width: "90vw",
            height: height + "px",
            marginInline: "auto",
          }}
        />
      )}
    </>
  );
}
