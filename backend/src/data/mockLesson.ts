import { Lesson } from "../domain/Entities/Lesson"
import { createTiptapJSON } from "../utils/tiptapHelpers.js"

export const mockLesson: Lesson = {
  lessonId: "lessonId123",
  title: "ouaiiiii",
  sport: "Boxe",
  objective: "dddddddddddddddddddddddddddddddddddd",
  creationDate: new Date(),
  userId: "userId456",
  isPublic: false,
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
        "ddddddddd ddddddddddddddddddddd dddddddddddddddddddd ddddddddddddddddddddddddd sssssssssssssss ssssssssss ssssss s s sssssssssssssss ssssssssssssssssssssssssssss s"
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
  coolDownInstructions: [
    {
      text: createTiptapJSON(""),
      min: 1,
      sec: 0,
    },
  ],
}
