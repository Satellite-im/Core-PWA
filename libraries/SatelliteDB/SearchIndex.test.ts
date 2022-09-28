import SearchIndex from './SearchIndex'

describe('SatelliteDB/SearchIndex', () => {
  let idx: SearchIndex
  beforeAll(() => {
    idx = new SearchIndex({
      schema: {
        fields: ['id', 'text'],
        storeFields: ['id', 'text'],
      },
    })
  })

  beforeEach(() => {
    idx.update([])
  })

  test('constructor without a schema', () => {
    const idxb = new SearchIndex()
  })

  test('searchIndex.update()', async () => {
    const data = [
      { id: '1', text: 'first match' },
      { id: '2', text: 'second match' },
      { id: '3', text: 'third match' },
    ]
    idx.update(data)
    expect(idx.search('first')?.map((r) => r.id)).toEqual(['1'])
    expect(idx.search('second')?.map((r) => r.id)).toEqual(['2'])
    expect(idx.search('third')?.map((r) => r.id)).toEqual(['3'])
    expect(idx.search('match')?.map((r) => r.id)).toEqual(['3', '2', '1'])
  })

  test('searchIndex.update()', async () => {
    const data = [
      { id: '1', text: 'first match' },
      { id: '2', text: 'second match' },
      { id: '3', text: 'third match' },
    ]
    idx.update(data)
    expect(idx.autoSuggest('first')).toMatchSnapshot()
  })

  test('searchIndex.update() without an id', async () => {
    const data = [{ text: 'foo bar' }]
    expect(() => idx.update(data)).toThrow()
  })

  test('searchIndex.add()', async () => {
    const data = { id: '1', text: 'foo bar' }
    idx.add(data)
    expect(idx.search('foo')?.map((r) => r.id)).toEqual(['1'])
  })

  test('searchIndex.add() without an id', async () => {
    const data = { text: 'foo bar' }
    expect(() => idx.add(data)).toThrow()
  })

  test('searchIndex.remove()', async () => {
    const data = [
      { id: '1', text: 'first match' },
      { id: '2', text: 'second match' },
    ]
    idx.update(data)
    expect(idx.search('first')?.map((r) => r.id)).toEqual(['1'])
    expect(idx.search('second')?.map((r) => r.id)).toEqual(['2'])
    expect(idx.search('match')?.map((r) => r.id)).toEqual(['2', '1'])
    idx.remove(data[0])
    expect(idx.search('first')?.map((r) => r.id)).toEqual([])
    expect(idx.search('match')?.map((r) => r.id)).toEqual(['2'])
  })

  test('searchIndex.addAll()', async () => {
    const data = [
      { id: '1', text: 'first match' },
      { id: '2', text: 'second match' },
    ]
    idx.addAll(data)
    expect(idx.search('first')?.map((r) => r.id)).toEqual(['1'])
    expect(idx.search('second')?.map((r) => r.id)).toEqual(['2'])
    expect(idx.search('match')?.map((r) => r.id)).toEqual(['2', '1'])
  })

  test('searchIndex.removeAll()', async () => {
    const data = [
      { id: '1', text: 'first match' },
      { id: '2', text: 'second match' },
    ]
    idx.update(data)
    idx.removeAll()
    expect(idx.search('first')?.map((r) => r.id)).toEqual([])
    expect(idx.search('second')?.map((r) => r.id)).toEqual([])
    expect(idx.search('match')?.map((r) => r.id)).toEqual([])
  })

  test('searchIndex.upsert()', async () => {
    const data = { id: '1', text: 'foo bar' }
    idx.upsert(data)
    idx.upsert({ id: '1', text: 'foo bar baz' })
    expect(idx.search('foo')?.length).toEqual(1)
    expect(idx.search('foo')?.[0]?.text).toEqual('foo bar baz')
  })

  test('searchIndex.upsertAll()', async () => {
    const data = [
      { id: '1', text: 'foo bar' },
      { id: '1', text: 'foo bar baz' },
    ]
    idx.upsertAll(data)
    expect(idx.search('foo')?.map((r) => r.text)).toEqual(['foo bar baz'])
  })
})
