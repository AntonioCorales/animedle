"use client";

import { useEffect, useState } from "react";

export default function ButtonGameMode(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isSelected?: boolean;
  }
) {
  const { isSelected, ...rest } = props;
  const classNameBase =
    "text-white px-8 py-2 rounded-md transition-all focus:outline-none outline-none border-2 hover:bg-sky-700";
  const [className, setClassName] = useState(classNameBase);

  useEffect(() => {
    if (isSelected) {
      setClassName(classNameBase + " border-sky-500 bg-sky-700 ");
    } else {
      setClassName(classNameBase + " bg-transparent");
    }
  }, [isSelected]);

  return (
    <button {...rest} className={className}>
      {props.children}
    </button>
  );
}
