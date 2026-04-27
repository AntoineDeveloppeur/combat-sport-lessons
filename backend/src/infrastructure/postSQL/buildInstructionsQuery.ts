import { Instruction } from "../../domain/Entities/Instructions.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"

export const buildInstructionsQuery = (
  warmUpInstructions: Instruction[],
  bodyInstructions: Instruction[],
  coolDownInstructions: Instruction[],
  lessonId: string,
  idGenerator: IdGenerator,
): [string, Array<string | number>] => {
  const instructionGroups = [
    { instructions: warmUpInstructions, type: "warm_up" as const },
    { instructions: bodyInstructions, type: "body" as const },
    { instructions: coolDownInstructions, type: "cool_down" as const },
  ]

  const allInstructions: Array<{
    instruction: Instruction
    type: string
    order: number
  }> = []

  instructionGroups.forEach((group) => {
    group.instructions.forEach((instruction, index) => {
      allInstructions.push({
        instruction,
        type: group.type,
        order: index + 1,
      })
    })
  })

  const valuesPlaceholders = allInstructions
    .map((_, index) => {
      const offset = index * 7
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`
    })
    .join(", ")

  const query = `
    INSERT INTO instructions (instruction_id, text, type, min, sec, "order", lesson_id)
    VALUES ${valuesPlaceholders}
  `

  const params: Array<string | number> = []
  allInstructions.forEach((item) => {
    params.push(
      idGenerator.generate(),
      JSON.stringify(item.instruction.text),
      item.type,
      item.instruction.min,
      item.instruction.sec,
      item.order,
      lessonId,
    )
  })

  return [query, params]
}
