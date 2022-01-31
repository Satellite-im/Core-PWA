import Logger from '../utilities/Logger'
global.console.log = jest.fn()

describe('Test class Logger', () => {
  it('Logger-log', () => {
    // Arguments
    const debug1 = undefined!
    const tag1 = 'Oha'
    const desc1 = 'Oha'
    const data1 = undefined!
    const level1 = undefined!

    // Method call
    const logger = new Logger(debug1)
    logger.log(tag1, desc1, data1, level1)

    expect(console.log).toBeCalledTimes(1)
  })
  it('Logger-log with data', () => {
    // Arguments
    const debug1 = undefined!
    const tag1 = 'Oha'
    const desc1 = 'Oha'
    const data1 = {
      peerId: 'abc123',
      typingState: 'NOT_TYPING',
    }
    const level1 = undefined!

    // Method call
    const logger = new Logger(debug1)
    logger.log(tag1, desc1, data1, level1)

    expect(console.log).toBeCalledTimes(2) // Is called two times because the script will log the data if the data argument is not an empty object
    expect(console.log).toBeCalledWith(data1)
  })

  it('Logger-debug', () => {
    // Arguments
    const debug2 = undefined!
    const debug3 = undefined!

    // Property call
    const logger = new Logger(debug2)
    logger.debug = debug3
    const result = logger.debug

    // Expect result
    expect(result).toEqual(debug3)
  })
})
