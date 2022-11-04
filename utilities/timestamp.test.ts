import { getTimestamp, getDate } from './timestamp'

Date.now = jest.fn(() => 1667490408373)
const localDate: number = Date.now()

describe('Test timestamp', () => {
  it('timezone should be utc', () => {
    expect(new Date().getTimezoneOffset()).toBe(0)
  })

  test('Get non-full timezone', () => {
    // Returns without date
    const result = getTimestamp(localDate, false)
    expect(result).toBe('3:46 PM')
  })

  test('Get full timezone', () => {
    // Returns with date
    const result = getTimestamp(localDate, true)
    expect(result).toBe('11/03/2022 3:46 PM')
  })

  test('Get full date', () => {
    const result = getDate(localDate)
    expect(result).toBe('11/03/2022')
  })
})
