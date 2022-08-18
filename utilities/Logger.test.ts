import { expect } from '@jest/globals'
import Logger from './Logger'

describe('Logger', () => {
  let instance

  beforeEach(() => {
    instance = new Logger()
  })

  it('instance should be an instanceof Logger', () => {
    expect(instance instanceof Logger).toBeTruthy()
  })
})
