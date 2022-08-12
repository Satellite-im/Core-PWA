import * as Logger from '~/utilities/Logger'

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
    inst10 = new Logger.default('Janet Homenick')
    inst9 = new Logger.default('Gail Hoppe')
    inst8 = new Logger.default('Gail Hoppe')
    inst7 = new Logger.default('Gail Hoppe')
    inst6 = new Logger.default('Maurice Purdy')
    inst5 = new Logger.default('Maurice Purdy')
    inst4 = new Logger.default('Maurice Purdy')
    inst3 = new Logger.default('debug')
    inst = new Logger.default('Gail Hoppe')
    inst2 = new Logger.default('Ronald Keeling')
  })

  test('0', () => {
    let result: any = inst2._log(
      'Île-de-France',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst._log(
      'Abruzzo',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
      'log',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3._log(
      'Florida',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
      'error',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.info', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new Logger.default('Maurice Purdy')
    inst7 = new Logger.default('Maurice Purdy')
    inst6 = new Logger.default('Becky Bednar')
    inst5 = new Logger.default('Ronald Keeling')
    inst4 = new Logger.default('Maurice Purdy')
    inst3 = new Logger.default('debug')
    inst = new Logger.default('Maurice Purdy')
    inst2 = new Logger.default('Ronald Keeling')
  })

  test('0', () => {
    let result: any = inst2.info(
      'Florida',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.info(
      'Île-de-France',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.info(
      'Abruzzo',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.info(
      'Île-de-France',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.info(
      'Alabama',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst8.info('', '', {})
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.log', () => {
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
    inst10 = new Logger.default('Gail Hoppe')
    inst9 = new Logger.default('Becky Bednar')
    inst8 = new Logger.default('Becky Bednar')
    inst7 = new Logger.default('Maurice Purdy')
    inst6 = new Logger.default('Becky Bednar')
    inst5 = new Logger.default('debug')
    inst4 = new Logger.default('Janet Homenick')
    inst3 = new Logger.default('debug')
    inst = new Logger.default('Janet Homenick')
    inst2 = new Logger.default('Becky Bednar')
  })

  test('0', () => {
    let result: any = inst2.log(
      'Alabama',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.log(
      'Abruzzo',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.log(
      'Florida',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
      '12345',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.warn', () => {
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
    inst10 = new Logger.default('Ronald Keeling')
    inst9 = new Logger.default('Janet Homenick')
    inst8 = new Logger.default('Gail Hoppe')
    inst7 = new Logger.default('Ronald Keeling')
    inst6 = new Logger.default('Janet Homenick')
    inst5 = new Logger.default('info')
    inst4 = new Logger.default('Maurice Purdy')
    inst3 = new Logger.default('Maurice Purdy')
    inst = new Logger.default('Becky Bednar')
    inst2 = new Logger.default('Maurice Purdy')
  })

  test('0', () => {
    let result: any = inst2.warn(
      'Florida',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.warn(
      'Alabama',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.warn(
      'Abruzzo',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.warn(
      'Florida',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.warn(
      'Île-de-France',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst10.warn('', '', {})
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.error', () => {
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst7 = new Logger.default('Maurice Purdy')
    inst6 = new Logger.default('Maurice Purdy')
    inst5 = new Logger.default('Ronald Keeling')
    inst4 = new Logger.default('Gail Hoppe')
    inst3 = new Logger.default('Becky Bednar')
    inst = new Logger.default('Becky Bednar')
    inst2 = new Logger.default('Janet Homenick')
  })

  test('0', () => {
    let result: any = inst2.error(
      'Île-de-France',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.error(
      'Abruzzo',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.error(
      'Alabama',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.error(
      'Île-de-France',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.error(
      'Alabama',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst7.error('', '', {})
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.debug', () => {
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
    inst10 = new Logger.default('Ronald Keeling')
    inst9 = new Logger.default('warn')
    inst8 = new Logger.default('Gail Hoppe')
    inst7 = new Logger.default('Janet Homenick')
    inst6 = new Logger.default('Ronald Keeling')
    inst5 = new Logger.default('Maurice Purdy')
    inst4 = new Logger.default('Gail Hoppe')
    inst3 = new Logger.default('Ronald Keeling')
    inst = new Logger.default('warn')
    inst2 = new Logger.default('warn')
  })

  test('0', () => {
    let result: any = inst2.debug(
      'Île-de-France',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.debug(
      'Alabama',
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.debug(
      'Abruzzo',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.debug(
      'Île-de-France',
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.debug(
      'Florida',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst10.debug('', '', {})
    expect(result).toMatchSnapshot()
  })
})

describe('Logger.default.prod', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new Logger.default('Maurice Purdy')
    inst7 = new Logger.default('Janet Homenick')
    inst6 = new Logger.default('Ronald Keeling')
    inst5 = new Logger.default('Ronald Keeling')
    inst4 = new Logger.default('Gail Hoppe')
    inst3 = new Logger.default('Becky Bednar')
    inst = new Logger.default('Gail Hoppe')
    inst2 = new Logger.default('Gail Hoppe')
  })

  test('1', () => {
    let result: any = inst.prod(
      'Florida',
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.prod(
      'Florida',
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      {},
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.prod(
      'Île-de-France',
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      {},
    )
    expect(result).toMatchSnapshot()
  })
})
