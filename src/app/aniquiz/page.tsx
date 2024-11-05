
import AniQuiz from "@/components/ani-quiz";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AniQuiz",
  description: "Escoge el anime que corresponde a la pregunta",
};

export default function AniQuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AniQuiz />
    </Suspense>
  );
}
