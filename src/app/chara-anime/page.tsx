import CharaAnime from "@/components/chara-anime";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CharaAnime",
  description: "Adivina el anime a partir de sus personajes",
};

export default function CharaAnimePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharaAnime />
    </Suspense>
  );
}
