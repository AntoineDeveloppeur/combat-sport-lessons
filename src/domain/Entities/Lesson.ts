import { type Sport } from "../type"
import { Instructions } from "./Instructions"

export class Lesson {
  constructor(
    public readonly objective: string,
    public readonly duration: number,
    public readonly sport: Sport,
    public readonly coreInstructions: Instructions,
    public readonly warmUpInstructions: Instructions,
    public readonly coolDownInstructions: Instructions
  ) {}
}
