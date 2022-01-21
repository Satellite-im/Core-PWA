/* Get utc offset from timezone name */
export const getUtcTimezoneOffset = (timeZone: string) => {
  const now = new Date()
  const tz = now
    .toLocaleString('en', { timeZone, timeStyle: 'long' })
    .split(' ')
    .slice(-1)[0]
  const dateString = now.toString()
  const offset =
    Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`)
  return offset / 60 / 1000
}
