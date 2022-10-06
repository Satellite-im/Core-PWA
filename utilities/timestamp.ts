import { $dayjs } from '~/plugins/local/dayjs'

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

/**
 * @description return localized timestamp
 * @argument {number} time unix timestamp
 * @returns {string} formatted time
 * @example (23423424) => 2:49 PM
 * @example (23423424, full) => 6/6/22 2:49 PM
 */
export function getTimestamp(time: number, full?: boolean): string {
  return $dayjs(time)
    .local()
    .tz(timezone)
    .format(full ? 'L LT' : 'LT')
}

/**
 * @description return date associated with timestamp
 * @argument {number} time unix timestamp
 * @returns {string} formatted time
 * @example (23423424) => 6/6/22
 */
export function getDate(time: number): string {
  return $dayjs(time).local().tz(timezone).format('L')
}
