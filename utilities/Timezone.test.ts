import * as Timezone from './Timezone'

describe('Test utilities/timezone', () => {
  test('getTimezoneDropdowns for Western Indonesia', () => {
    const result = Timezone.getTimezoneDropdowns()
    const nonDaylightTimezone = result.find((obj) => {
      return obj.alternativeName === 'Western Indonesia Time'
    })

    expect(result.length).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
    expect(nonDaylightTimezone.currentTimeFormat).toEqual(
      '+07:00 Western Indonesia Time - Jakarta, Surabaya, Bandung, Medan',
    ) // Make sure that the nonDaylightTimezone exists.
  })

  test('getUtfOffsetInMins for an existing timezone', () => {
    const result = Timezone.getUtfOffsetInMins('Asia/Singapore')

    expect(result).toBe(480)
  })

  test('getUtfOffsetInMins for a non existing timezone', () => {
    const result = Timezone.getUtfOffsetInMins('Asia/Singapura')

    expect(result).toBeNull()
  })
})
