import * as Timezone from './Timezone'

describe('init', () => {
  test.skip('getTimezoneDropdowns', () => {
    const result = Timezone.getTimezoneDropdowns()
    const nonDaylightTimezone = result.find((obj) => {
      return obj.alternativeName === 'Singapore Time'
    })

    expect(result.length).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
    expect(nonDaylightTimezone.currentTimeFormat).toEqual(
      '+08:00 Singapore Time - Singapore, Woodlands, Marine Parade',
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
