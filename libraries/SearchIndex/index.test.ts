import SearchIndex from './index'

describe('', () => {
  test('', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    idx.update(data)

    expect(idx.search('hello')?.map((r) => r.ref)).toEqual(['1', '3'])
    expect(idx.search('world')?.map((r) => r.ref)).toEqual(['2', '3'])
    expect(idx.search('hello world')?.map((r) => r.ref)).toEqual([
      '3',
      '1',
      '2',
    ])
  })
})
