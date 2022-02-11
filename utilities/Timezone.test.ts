import * as Timezone from './Timezone'

describe('init', () => {
  test('getTimezoneDropdowns', () => {
    const result = Timezone.getTimezoneDropdowns()

    expect(result).toMatchSnapshot()
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
