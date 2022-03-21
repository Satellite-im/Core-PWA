import * as Logger from '~/utilities/Logger'
const LoggerDefault = Logger.default
global.console.log = jest.fn()

describe('Logger.default._log', () => {
  let inst10: any
  let inst9: any
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst10 = new LoggerDefault(false)
    inst9 = new LoggerDefault(true)
    inst8 = new LoggerDefault(true)
    inst7 = new LoggerDefault(false)
    inst6 = new LoggerDefault(true)
    inst5 = new LoggerDefault(false)
    inst4 = new LoggerDefault(true)
    inst3 = new LoggerDefault(true)
    inst = new LoggerDefault(true)
    inst2 = new LoggerDefault(true)
  })

  test('0', () => {
    const result: any = inst2._log(
      'Alabama',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
      Logger.LogLevel.PROD,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst._log(
      'Alabama',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3._log(
      'Alabama',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
      Logger.LogLevel.PROD,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4._log(
      'Florida',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
      Logger.LogLevel.PROD,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5._log(
      'Alabama',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst9._log('', '', {}, Logger.LogLevel.DEV)
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.log', () => {
  let inst10: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst10 = new LoggerDefault(false)
    inst5 = new LoggerDefault(false)
    inst4 = new LoggerDefault(false)
    inst3 = new LoggerDefault(false)
    inst = new LoggerDefault(false)
    inst2 = new LoggerDefault(false)
  })

  test('0', () => {
    const result: any = inst2.log(
      'Île-de-France',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.log(
      'Abruzzo',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
      Logger.LogLevel.PROD,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.log(
      'Île-de-France',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.log(
      'Abruzzo',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.log(
      'Alabama',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
      Logger.LogLevel.DEV,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst10.log('', '', {}, Logger.LogLevel.DEV)
    expect(result).toMatchSnapshot()
  })

  test('6', () => {
    const debug1 = undefined!
    const tag1 = 'Oha'
    const desc1 = 'Oha'
    const data1 = undefined!
    const level1 = undefined!

    const logger = new LoggerDefault(debug1)
    logger.log(tag1, desc1, data1, level1)

    expect(console.log).toBeCalledTimes(7) // eslint-disable-line
  })
  test('7, data object provided', () => {
    const debug1 = undefined!
    const tag1 = 'Oha'
    const desc1 = 'Oha'
    const data1 = {
      peerId: 'abc123',
      typingState: 'NOT_TYPING',
    }
    const level1 = undefined!

    const logger = new LoggerDefault(debug1)
    logger.log(tag1, desc1, data1, level1)

    // Console log will called two times because the script will log the data if the data argument is not an empty object
    // We pass in 7 because there has been 5 calls before this unit test
    expect(console.log).toBeCalledTimes(8) // eslint-disable-line
    expect(console.log).toBeCalledWith(data1) // eslint-disable-line
  })
})

describe('Logger.default.debug', () => {
  test('0', () => {
    const debug2 = undefined!
    const debug3 = undefined!

    const logger = new LoggerDefault(debug2)
    logger.debug = debug3
    const result = logger.debug

    expect(result).toEqual(debug3)
  })
})
