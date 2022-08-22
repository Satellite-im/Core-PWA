import Logger from './Logger'

describe('Logger', () => {
  let instance: Logger

  beforeEach(() => {
    instance = new Logger()
  })

  it('instance should be an instanceof Logger', () => {
    expect(instance instanceof Logger).toBeTruthy()
  })
})
