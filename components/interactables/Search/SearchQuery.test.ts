import * as SearchQuery from '~/components/interactables/Search/SearchQuery'

import * as search from '~/types/search/search'
describe('SearchQuery.default.clear', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.clear()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.appendCommand', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.appendCommand(
      search.SearchCommand.During,
      'Dillenberg',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.appendCommand(
      search.SearchCommand.In,
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.appendCommand(search.SearchCommand.Has, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.appendCommand(
      search.SearchCommand.During,
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.appendCommand(search.SearchCommand.During, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst8.appendCommand(search.SearchCommand.During, '')
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.insertCommand', () => {
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
    inst10 = new SearchQuery.default()
    inst9 = new SearchQuery.default()
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.insertCommand(search.SearchCommand.Empty, 'Elio', 1)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.insertCommand(
      search.SearchCommand.Mentions,
      'Dillenberg',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.insertCommand(
      search.SearchCommand.Mentions,
      'Elio',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.insertCommand(
      search.SearchCommand.Empty,
      'elio@example.com',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.insertCommand(
      search.SearchCommand.During,
      'Dillenberg',
      1.0,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst8.insertCommand(
      search.SearchCommand.During,
      '',
      Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.setCommandValue', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.setCommandValue(-100, 'Dillenberg')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.setCommandValue(1, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.setCommandValue(-1, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.setCommandValue(0, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.setCommandValue(100, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst7.setCommandValue(NaN, '')
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.queryItemFrom', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.queryItemFrom(-5.48)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.queryItemFrom(0)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.queryItemFrom(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.queryItemFrom(100)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.queryItemFrom(1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst6.queryItemFrom(NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.deleteItemFrom', () => {
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.deleteItemFrom(100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.deleteItemFrom(-5.48)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.deleteItemFrom(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.deleteItemFrom(0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.deleteItemFrom(1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst6.deleteItemFrom(-Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.deleteItemAt', () => {
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.deleteItemAt(-100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.deleteItemAt(1)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.deleteItemAt(100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.deleteItemAt(0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.deleteItemAt(-1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst6.deleteItemAt(NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.setQuery', () => {
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
    inst10 = new SearchQuery.default()
    inst9 = new SearchQuery.default()
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.setQuery('DROP TABLE tmp;', 180)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.setQuery(
      'UPDATE Projects SET pname = %s WHERE pid = %s',
      2,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.setQuery('UNLOCK TABLES;', 31)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.setQuery('DROP TABLE tmp;', 4)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.setQuery('UNLOCK TABLES;', 2)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst9.setQuery('', Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe.skip('SearchQuery.default.setQueryByHTML', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.setQueryByHTML(
      document.querySelector(
        'canvas:first-of-type',
        'span:first-of-type',
        'div:first-of-type',
      ),
    )
    expect(result).toMatchSnapshot()
  })
}) // AP-780

describe('SearchQuery.default.getQueryString', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.getQueryString()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.caretPosition', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2.caretPosition(
      document.querySelector(
        'canvas:first-of-type',
        'span:first-of-type',
        'div:first-of-type',
      ),
    )
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default._parseQuery', () => {
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
    inst10 = new SearchQuery.default()
    inst9 = new SearchQuery.default()
    inst8 = new SearchQuery.default()
    inst7 = new SearchQuery.default()
    inst6 = new SearchQuery.default()
    inst5 = new SearchQuery.default()
    inst4 = new SearchQuery.default()
    inst3 = new SearchQuery.default()
    inst = new SearchQuery.default()
    inst2 = new SearchQuery.default()
  })

  test('0', () => {
    let result: any = inst2._parseQuery('\\u0020\\u0020', 8)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst._parseQuery(
      'DELETE FROM Projects WHERE pid = %s\\u0020UPDATE Projects SET pname = %s WHERE pid = %s',
      7,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3._parseQuery(
      'DELETE FROM Projects WHERE pid = %s\\u0020\\u0020UPDATE Projects SET pname = %s WHERE pid = %s',
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4._parseQuery(
      'UPDATE Projects SET pname = %s WHERE pid = %s\\u0020',
      1.0,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5._parseQuery('\\u0020\\u0020', 3)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst9._parseQuery('', -Infinity)
    expect(result).toMatchSnapshot()
  })
})
