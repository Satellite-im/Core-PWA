import * as mutations from '~/store/files/mutations'

describe('mutations.default.addDownload', () => {
  test('0', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => 10 } },
      'Jean-Philippe',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => 32 } },
      'Anas',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => 256 } },
      'Edmond',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => 16 } },
      'Pierre Edouard',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => 32 } },
      'Edmond',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = mutations.default.addDownload(
      { downloadList: { push: () => -Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.removeDownload', () => {
  test('0', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => 0, splice: () => 16 } },
      'Edmond',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => 1, splice: () => 10 } },
      'Jean-Philippe',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => 100, splice: () => 16 } },
      'Pierre Edouard',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => -100, splice: () => 10 } },
      'Jean-Philippe',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => 100, splice: () => 0 } },
      'Pierre Edouard',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = mutations.default.removeDownload(
      { downloadList: { indexOf: () => NaN, splice: () => NaN } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setSort', () => {
  test('0', () => {
    let result: any = mutations.default.setSort(
      {
        sort: {
          category:
            'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
          asc: 56784,
        },
      },
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = mutations.default.setSort(
      {
        sort: {
          category:
            'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
          asc: 'a1969970175',
        },
      },
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = mutations.default.setSort(
      {
        sort: {
          category:
            'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
          asc: 12345,
        },
      },
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = mutations.default.setSort(
      {
        sort: {
          category:
            "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
          asc: 'a1969970175',
        },
      },
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = mutations.default.setSort(
      {
        sort: {
          category:
            'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
          asc: 56784,
        },
      },
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = mutations.default.setSort(
      { sort: { category: '', asc: Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.toggleLayout', () => {
  test('0', () => {
    let result: any = mutations.default.toggleLayout({
      gridLayout:
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = mutations.default.toggleLayout({ gridLayout: '' })
    expect(result).toMatchSnapshot()
  })
})
