import { getTimestamp, getDate } from './timestamp'

Date.now = jest.fn(() => 1667490408373)
let localDate: number

describe.skip('Test timestamp', () => {
  beforeAll(() => {
    localDate = Date.now()
  })

  test('Get non-full timezone', () => {
    // Returns without date
    const result = getTimestamp(localDate, false)
    expect(result).toBe('10:46 PM')
  })

  test('Get full timezone', () => {
    // Returns with date
    const result = getTimestamp(localDate, true)
    expect(result).toBe('11/03/2022 10:46 PM')
  })

  test('Get full date', () => {
    const result = getDate(localDate)
    expect(result).toBe('11/03/2022')
  })
})
