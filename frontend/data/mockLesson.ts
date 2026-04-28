import { Lesson } from "@/types/index"
import { createTiptapJSON } from "@/utils/tiptapHelpers"

export const mockLesson: Lesson = {
  bodyInstructions: [
    {
      sec: 23,
      min: 1,
      text: createTiptapJSON("ddddddddddd"),
    },
    {
      sec: 50,
      min: 3,
      text: createTiptapJSON("qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
    },
  ],
  warmUpInstructions: [
    {
      text: createTiptapJSON(
        "ddddddddd ddddddddddddddddddddd dddddddddddddddddddd ddddddddddddddddddddddddd sssssssssssssss ssssssssss ssssss s s sssssssssssssss ssssssssssssssssssssssssssss s",
      ),
      min: 1,
      sec: 0,
    },
    {
      sec: 0,
      min: 2,
      text: createTiptapJSON("ssssssssssssssssssssssssss"),
    },
  ],
  warmUp: "custom",
  coolDown: "custom",
  coolDownInstructions: [
    {
      text: createTiptapJSON(""),
      min: 1,
      sec: 0,
    },
  ],
  sport: "Arnis",
  objective: "dddddddddddddddddddddddddddddddddddd",
}
