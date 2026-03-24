export class DurationTooHigh extends Error {
  status = 400
  log
  constructor(duration, maxDuration) {
    const publicMessage = `Durée maximale dépassée. Max: ${maxDuration} minutes, Donnée: ${duration} minutes`
    const logMessage = `Durée maximale dépassée. Max: ${maxDuration} minutes, Donnée: ${duration} minutes`
    super(publicMessage)
    this.log = { logMessage, duration, maxDuration }
  }
}
