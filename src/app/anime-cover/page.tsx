import AniCover from "@/components/ani-cover";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AniCover",
  description: "Adivina el anime a partir de su portada",
};

export default function AniCoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AniCover />
    </Suspense>
  );
}
