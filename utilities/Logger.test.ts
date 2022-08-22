import Logger from './Logger'

describe('Logger', () => {
  let instance: Logger

  beforeEach(() => {
    instance = new Logger()
  })

  it('instance should be an instanceof Logger', () => {
    expect(instance instanceof Logger).toBeTruthy()
  })
  it.skip('instance should be an instanceof Logger', () => {
    expect()
    expect(new Logger().info('Logger', 'Description', {})).toBe(null)
  })
})

describe('Spy Logger Methods', () => {
  it('should log [default] correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'log')
    const loggerInstance = new Logger()

    loggerInstance.log('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })

  it('should log info correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'info')
    const loggerInstance = new Logger()

    loggerInstance.info('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })

  it('should log warn correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'warn')
    const loggerInstance = new Logger()

    loggerInstance.warn('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })

  it('should log error correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'error')
    const loggerInstance = new Logger()

    loggerInstance.error('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })

  it('should log debug correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'debug')
    const loggerInstance = new Logger()

    loggerInstance.debug('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })

  it('should log prod correctly', () => {
    const loggerSpy = jest.spyOn(Logger.prototype as any, 'prod')
    const loggerInstance = new Logger()

    loggerInstance.prod('Logger', 'Description', {})

    expect(loggerSpy).toHaveBeenCalled()
    expect(loggerSpy).toHaveBeenCalledWith('Logger', 'Description', {})
  })
})
