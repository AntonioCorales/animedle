"use client";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti";

type Props = {
  active: boolean;
};

export default function Confetti({ active }: Props) {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  if (!active || size.width === 0) return null;

  return (
    <ConfettiExplosion
      width={size.width}
      height={size.height}
      recycle
      numberOfPieces={500}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    />
  );
}
