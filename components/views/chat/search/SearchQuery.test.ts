import * as SearchQuery from '~/components/views/chat/search/SearchQuery'
import * as search from '~/types/search/search'

const SearchQueryDefault = SearchQuery.default

describe('SearchQuery.default.clear', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.clear()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.appendCommand', () => {
  let inst8: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.appendCommand(
      search.SearchCommand.During,
      'Dillenberg',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.appendCommand(
      search.SearchCommand.In,
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.appendCommand(search.SearchCommand.Has, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.appendCommand(
      search.SearchCommand.During,
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.appendCommand(search.SearchCommand.During, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst8.appendCommand(search.SearchCommand.During, '')
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.insertCommand', () => {
  let inst8: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst8 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.insertCommand(
      search.SearchCommand.Empty,
      'Elio',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.insertCommand(
      search.SearchCommand.Mentions,
      'Dillenberg',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.insertCommand(
      search.SearchCommand.Mentions,
      'Elio',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.insertCommand(
      search.SearchCommand.Empty,
      'elio@example.com',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.insertCommand(
      search.SearchCommand.During,
      'Dillenberg',
      1.0,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst8.insertCommand(
      search.SearchCommand.During,
      '',
      Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.setCommandValue', () => {
  let inst7: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst7 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.setCommandValue(-100, 'Dillenberg')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.setCommandValue(1, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.setCommandValue(-1, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.setCommandValue(0, 'Elio')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.setCommandValue(100, 'elio@example.com')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst7.setCommandValue(NaN, '')
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.queryItemFrom', () => {
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst6 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.queryItemFrom(-5.48)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.queryItemFrom(0)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.queryItemFrom(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.queryItemFrom(100)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.queryItemFrom(1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst6.queryItemFrom(NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.deleteItemFrom', () => {
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst6 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.deleteItemFrom(100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.deleteItemFrom(-5.48)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.deleteItemFrom(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.deleteItemFrom(0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.deleteItemFrom(1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst6.deleteItemFrom(-Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.deleteItemAt', () => {
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst6 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.deleteItemAt(-100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.deleteItemAt(1)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.deleteItemAt(100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.deleteItemAt(0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.deleteItemAt(-1)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst6.deleteItemAt(NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.setQuery', () => {
  let inst9: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst9 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.setQuery('DROP TABLE tmp;', 180)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.setQuery(
      'UPDATE Projects SET pname = %s WHERE pid = %s',
      2,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.setQuery('UNLOCK TABLES;', 31)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.setQuery('DROP TABLE tmp;', 4)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.setQuery('UNLOCK TABLES;', 2)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst9.setQuery('', Infinity)
    expect(result).toMatchSnapshot()
  })
})

let spy: any
beforeAll(() => {
  spy = jest.spyOn(document, 'getElementById')
})

describe('SearchQuery.default.setQueryByHTML', () => {
  let inst2: any
  let mockElement: any

  beforeEach(() => {
    inst2 = new SearchQueryDefault()
    mockElement = document.createElement('div:first-of-type')
    spy.mockReturnValue(mockElement)
  })

  test('found element', () => {
    const result: any = inst2.setQueryByHTML(mockElement)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.getQueryString', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.getQueryString()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default.caretPosition', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2.caretPosition(
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
  let inst9: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst9 = new SearchQueryDefault()
    inst5 = new SearchQueryDefault()
    inst4 = new SearchQueryDefault()
    inst3 = new SearchQueryDefault()
    inst = new SearchQueryDefault()
    inst2 = new SearchQueryDefault()
  })

  test('0', () => {
    const result: any = inst2._parseQuery('\\u0020\\u0020', 8)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst._parseQuery(
      'DELETE FROM Projects WHERE pid = %s\\u0020UPDATE Projects SET pname = %s WHERE pid = %s',
      7,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3._parseQuery(
      'DELETE FROM Projects WHERE pid = %s\\u0020\\u0020UPDATE Projects SET pname = %s WHERE pid = %s',
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4._parseQuery(
      'UPDATE Projects SET pname = %s WHERE pid = %s\\u0020',
      1.0,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5._parseQuery('\\u0020\\u0020', 3)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst9._parseQuery('', -Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('SearchQuery.default._hasAncestor', () => {
  let inst: any

  beforeEach(() => {
    inst = new SearchQuery.default()
  })

  test('0', () => {
    const result: any = inst._hasAncestor('', '')
    expect(result).toMatchSnapshot()
  })
})
