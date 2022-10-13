import { notNull, truthy } from '~/utilities/typeGuard'

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

describe('Test truthy', () => {
  test('expect true to be true', () => {
    const result: boolean = truthy(true)
    expect(result).toBe(true)
  })

  test('expect 1 to be true', () => {
    const result: boolean = truthy(1)
    expect(result).toBe(true)
  })

  test('expect string to be true', () => {
    const result: boolean = truthy('string')
    expect(result).toBe(true)
  })

  test('expect empty object to be true', () => {
    const result: boolean = truthy({})
    expect(result).toBe(true)
  })

  test('expect false to be falsy', () => {
    const result: boolean = truthy(false)
    expect(result).toBeFalsy()
  })

  test('expect empty string to be falsy', () => {
    const result: boolean = truthy('')
    expect(result).toBeFalsy()
  })

  test('expect 0 to be falsy', () => {
    const result: boolean = truthy(0)
    expect(result).toBeFalsy()
  })

  test('expect null to be falsy', () => {
    const result: boolean = truthy(null)
    expect(result).toBeFalsy()
  })

  test('expect undefined to be falsy', () => {
    const result: boolean = truthy(undefined)
    expect(result).toBeFalsy()
  })
})
