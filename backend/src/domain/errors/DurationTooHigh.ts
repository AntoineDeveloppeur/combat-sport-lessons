export class DurationTooHigh extends Error {
  status: number = 400
  log: { logMessage: string; duration: number; maxDuration: number }
  constructor(duration: number, maxDuration: number) {
    const publicMessage = `Durée maximale dépassée. Max: ${maxDuration} minutes, Donnée: ${duration} minutes`
    const logMessage = `Durée maximale dépassée. Max: ${maxDuration} minutes, Donnée: ${duration} minutes`
    super(publicMessage)
    this.log = { logMessage, duration, maxDuration }
  }
}
