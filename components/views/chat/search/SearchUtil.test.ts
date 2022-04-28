import * as SearchUtil from '~/components/views/chat/search/SearchUtil'
import * as search from '~/types/search/search'

describe('SearchUtil.default.getTextCommandMap', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getTextCommandMap()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.getCommandTypeParams', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getCommandTypeParams()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.getCommandMetaList', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getCommandMetaList()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.getSearchResultGroupList', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getSearchResultGroupList()
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.getCommandMeta', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getCommandMeta(
      search.SearchCommand.Before,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SearchUtil.default.getCommandMeta(
      search.SearchCommand.Empty,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.getCommandTypeParam', () => {
  test('0', () => {
    const result: any = SearchUtil.default.getCommandTypeParam(
      search.SearchCommand.Empty,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SearchUtil.default.getCommandTypeParam(
      search.SearchCommand.During,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = SearchUtil.default.getCommandTypeParam(
      search.SearchCommand.Has,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('SearchUtil.default.filterSearchRecommendResult', () => {
  test('0', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult(
      ['Expressway', 'Extensions', 'Lights', 'Extensions'],
      {
        command: 'parse mobile firewall',
        Empty: ' ',
        value: { toLowerCase: () => 'Michael' },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult(
      ['Harbors', 'Expressway', 'Expressway', 'Extensions'],
      {
        command: 'parse mobile firewall',
        Empty: '',
        value: { toLowerCase: () => 'Anas' },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult(
      ['Port', 'Port', 'Port', 'Lights'],
      {
        command: 'transmit bluetooth bus',
        Empty: ' ',
        value: { toLowerCase: () => 'Edmond' },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult(
      ['Port', 'Port', 'Lights', 'Expressway'],
      {
        command: 'transmit bluetooth bus',
        Empty: ' ',
        value: { toLowerCase: () => 'Michael' },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult(
      ['Extensions', 'Port', 'Harbors', 'Port'],
      {
        command: 'parse mobile firewall',
        Empty: '',
        value: { toLowerCase: () => 'Michael' },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = SearchUtil.default.filterSearchRecommendResult([], {
      command: '',
      Empty: '',
      value: { toLowerCase: () => '' },
    })
    expect(result).toMatchSnapshot()
  })
})
