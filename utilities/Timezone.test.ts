import * as Timezone from './Timezone'

describe('Test utilities/timezone', () => {
  test('getTimezoneDropdowns for Western Indonesia', () => {
    const result = Timezone.getTimezoneDropdowns()
    const nonDaylightTimezone = result.find((obj) => {
      return obj.alternativeName === 'Western Indonesia Time'
    })

    expect(result.length).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
    expect(nonDaylightTimezone.abbreviation).toEqual('WIB') // Make sure that the nonDaylightTimezone exists.

    expect(nonDaylightTimezone.continentCode).toEqual('AS')
    expect(nonDaylightTimezone.continentName).toEqual('Asia')
    expect(nonDaylightTimezone.countryCode).toEqual('ID')
    expect(nonDaylightTimezone.countryName).toEqual('Indonesia')
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
