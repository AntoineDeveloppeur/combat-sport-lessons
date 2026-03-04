import { type Sport } from "../type"
import { Instruction } from "./Instructions"

export class Lesson {
  constructor(
    public readonly lessonId: number,
    public readonly title: string,
    public readonly sport: Sport,
    public readonly objective: string,
    public readonly warmUpInstructions: Instruction[],
    public readonly bodyInstructions: Instruction[],
    public readonly coolDownInstructions: Instruction[],
    public readonly creationDate: Date,
    public readonly userId: number,
  ) {}
}
