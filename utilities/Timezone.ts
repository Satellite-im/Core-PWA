import { getTimeZones } from '@vvo/tzdb'
/* Get dropdown list for timezone */
export const getTimezoneDropdowns = () => {
  const timezones = getTimeZones()
  return timezones.map((timezone: any) => {
    return {
      ...timezone,
      value: timezone.name,
      text: `UTC ${timezone.currentTimeFormat}`,
    }
  })
}

export const getUtfOffsetInMins = (name: string) => {
  const timezones = getTimeZones()
  const timezone = timezones.find((elm) => elm.name === name)
  return timezone ? timezone.currentTimeOffsetInMinutes : null
}
