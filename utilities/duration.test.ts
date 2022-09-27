import { formatDuration } from '~/utilities/duration'

Date.now = jest.fn(() => 1656069280)
// Date.setSeconds = jest.fn(() => 1656069280)
let localDate: number

describe('Test utilities/duration', () => {
  beforeAll(() => {
    localDate = Date.now()
  })
  test('call with latest date', () => {
    // const argument = localDate.now() // Get unix timestamp

    const result: any = formatDuration(localDate)
    expect(result).toEqual('59:14:40')
  })
  test('call with 45 seconds date', () => {
    const rawDate = new Date()
    const argument = rawDate.setSeconds(45) // Returns unix timestamp

    const result: any = formatDuration(argument)
    expect(result).not.toEqual('59:14:40') // Because date is not what we defaulted above
    expect(typeof result).toBe('string')
  })
})
