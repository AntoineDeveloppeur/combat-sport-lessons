import { Lesson } from "../domain/Entities/Lesson"

export const mockLesson: Lesson = {
  lessonId: 456,
  title: "ouaiiiii",
  sport: "Boxe",
  objective: "dddddddddddddddddddddddddddddddddddd",
  creationDate: new Date(),
  userID: 123,
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
  coolDownInstructions: [
    {
      text: "",
      min: 1,
      sec: 0,
    },
  ],
}
