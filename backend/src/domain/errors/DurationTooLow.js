export class DurationTooLow extends Error {
  status = 400
  log
  constructor(duration, minDuration) {
    const publicMessage = `Durée minimale non atteinte. Min: ${minDuration} minutes, Donnée: ${duration} minutes`
    const logMessage = `Durée minimale non atteinte. Min: ${minDuration} minutes, Donnée: ${duration} minutes`
    super(publicMessage)
    this.log = { logMessage, duration, minDuration }
  }
}
