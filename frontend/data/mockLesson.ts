import { Lesson } from "@/types"

export const mockLesson: Lesson = {
  bodyInstructions: [
    {
      sec: 23,
      min: 1,
      text: "ddddddddddd",
    },
    {
      sec: 50,
      min: 3,
      text: "qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
  ],
  warmUpInstructions: [
    {
      text: "ddddddddd ddddddddddddddddddddd dddddddddddddddddddd ddddddddddddddddddddddddd sssssssssssssss ssssssssss ssssss s s sssssssssssssss ssssssssssssssssssssssssssss s",
      min: 1,
      sec: 0,
    },
    {
      sec: 0,
      min: 2,
      text: "ssssssssssssssssssssssssss",
    },
  ],
  warmUp: "custom",
  coolDown: "custom",
  coolDownInstructions: [
    {
      text: "",
      min: 1,
      sec: 0,
    },
  ],
  sport: "Arnis",
  objective: "dddddddddddddddddddddddddddddddddddd",
}
