export class Lesson {
  lessonId
  title
  sport
  objective
  warmUpInstructions
  bodyInstructions
  coolDownInstructions
  creationDate
  userId
  constructor(
    lessonId,
    title,
    sport,
    objective,
    warmUpInstructions,
    bodyInstructions,
    coolDownInstructions,
    creationDate,
    userId
  ) {
    this.lessonId = lessonId
    this.title = title
    this.sport = sport
    this.objective = objective
    this.warmUpInstructions = warmUpInstructions
    this.bodyInstructions = bodyInstructions
    this.coolDownInstructions = coolDownInstructions
    this.creationDate = creationDate
    this.userId = userId
  }
}
