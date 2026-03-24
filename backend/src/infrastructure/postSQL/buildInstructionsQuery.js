export const buildInstructionsQuery = (
  warmUpInstructions,
  bodyInstructions,
  coolDownInstructions,
  lessonId,
  idGenerator
) => {
  const instructionGroups = [
    { instructions: warmUpInstructions, type: "warm_up" },
    { instructions: bodyInstructions, type: "body" },
    { instructions: coolDownInstructions, type: "cool_down" },
  ]
  const allInstructions = []
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
  const params = []
  allInstructions.forEach((item) => {
    params.push(
      idGenerator.generate(),
      item.instruction.text,
      item.type,
      item.instruction.min,
      item.instruction.sec,
      item.order,
      lessonId
    )
  })
  return [query, params]
}
