"use client";
import { useGetAnimesRelatedToAL } from "@/components/queries/getAnimesRelatedTo";

export default function Test() {
  const { data } = useGetAnimesRelatedToAL(21355);
  return <div>Test</div>;
}
