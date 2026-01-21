export class DurationTooLow extends Error {
  status: number = 400
  constructor(duration: number, minDuration: number) {
    super(
      `La durée de l'entraînement est trop courte.  Durée minimale ${minDuration} minutes, Durée donnée : ${duration} minutes`
    )
  }
}
