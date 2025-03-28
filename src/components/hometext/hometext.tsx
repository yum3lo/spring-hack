"use client";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "To",
    },
    {
      text: "get",
    },
    {
      text: "on",
    },
    {
        text: "board",
      },
    {
      text: "of",
    },
    {
      text: "Qship",
      className: "text-purple-500 dark:text-purple-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center  ">
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}
