export class DurationTooHigh extends Error {
  status: number = 400
  constructor(duration: number, maxDuration: number) {
    super(
      `La durée de l'entrapinement est trop longue. Durée maximal : ${maxDuration} minutes. Durée donnée : ${duration} minutes`
    )
  }
}
