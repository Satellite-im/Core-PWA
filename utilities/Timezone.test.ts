import * as Timezone from './Timezone'

describe('init', () => {
  test('getTimezoneDropdowns', () => {
    const result = Timezone.getTimezoneDropdowns()
    const nonDaylightTimezone = result.find((obj) => {
      return obj.alternativeName === 'Western Indonesia Time'
    })

    expect(result.length).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
    expect(nonDaylightTimezone.currentTimeFormat).toEqual(
      '+07:00 Western Indonesia Time - Jakarta, Surabaya, Medan, Bandung',
    ) // Make sure that the nonDaylightTimezone exists.
  })
  test('getUtfOffsetInMins for an existing timezone', () => {
    const result = Timezone.getUtfOffsetInMins('Asia/Jakarta')

    expect(result).toBe(420)
  })
  test('getUtfOffsetInMins for a non existing timezone', () => {
    const result = Timezone.getUtfOffsetInMins('Asia/Jayakarta')

    expect(result).toBeNull()
  })
})
