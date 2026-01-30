import { type Sport } from "../type"
import { Instruction } from "./Instructions"

export class Lesson {
  constructor(
    public readonly sport: Sport,
    public readonly objective: string,
    public readonly duration: number,
    public readonly coreInstructions: Instruction[],
    public readonly warmUpInstructions: Instruction[],
    public readonly coolDownInstructions: Instruction[]
  ) {}
}
