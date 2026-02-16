import { type AocDay } from "~/types";
import { pngBorder } from "~/utils/styling";

export const AocDayEntry = ({ day }: { day?: AocDay }) => { 
  return day !== undefined ? (
    <div>
      <img
        src={`/aoc-cal/img/logo/${day.lang.code}.png`}
        style={{
          maxWidth: "64px",
          filter: pngBorder(.2, "white")
        }}
      />
      <p>{day.lang.name}</p>
      <p>Answer 1: {day.answer1}</p>
      <p>Answer 2: {day.answer2}</p>
    </div>
  )
    : (<p>Not solved</p>);
}