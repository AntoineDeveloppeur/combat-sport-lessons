import { type Sport } from "../type"
import { Instruction } from "./Instructions"

export class Lesson {
  constructor(
    public readonly lessonId: string,
    public readonly title: string,
    public readonly sport: Sport,
    public readonly objective: string,
    public warmUpInstructions: Instruction[],
    public bodyInstructions: Instruction[],
    public coolDownInstructions: Instruction[],
    public readonly creationDate: Date,
    public readonly userId: string,
    public readonly isPublic: boolean,
  ) {}
}
