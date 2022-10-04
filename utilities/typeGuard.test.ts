import { notNull } from '~/utilities/typeGuard'

describe('notNull utility', () => {
  test('Expect undefined to be true', () => {
    const result: boolean = notNull(undefined)
    expect(result).toBe(true)
  })

  test('Expect null to be false', () => {
    const result: boolean = notNull(null)
    expect(result).toBe(false)
  })
})
