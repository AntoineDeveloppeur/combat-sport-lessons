export class DurationTooLow extends Error {
  status: number = 400
  log: { logMessage: string; duration: number; minDuration: number }
  constructor(duration: number, minDuration: number) {
    const publicMessage = `Durée minimale non atteinte. Min: ${minDuration} minutes, Donnée: ${duration} minutes`
    const logMessage = `Durée minimale non atteinte. Min: ${minDuration} minutes, Donnée: ${duration} minutes`
    super(publicMessage)
    this.log = { logMessage, duration, minDuration }
  }
}
