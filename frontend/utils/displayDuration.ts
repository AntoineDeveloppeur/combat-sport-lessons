export const displayDuration = (duration: number): string => {
  const [hour, minute] = minutesToHoursAndMinutes(duration)
  if (hour === 0 && minute === 0) return "pas de durée"
  if (hour === 0) return `${minute}min`
  if (minute === 0) return `${hour}h`
  return `${hour}h ${minute}min`
}

export const minutesToHoursAndMinutes = (
  duration: number
): [number, number] => {
  if (duration <= 0) return [0, 0]
  const hour = Math.floor(duration / 60)
  const minute = Math.floor(duration % 60) // Math.floor pour éviter les décimales
  return [hour, minute]
}
