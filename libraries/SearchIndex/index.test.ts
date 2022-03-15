import SearchIndex from './index'
// global.console.warn = jest.fn()
// TODO: Add coverage for the warning being logged

describe('', () => {
  test('update', async () => {
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
  test('serialize', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    expect(JSON.parse(idx.serialize())).toMatchObject({
      schema: { fields: ['text'], ref: 'id' },
    })
  })
  test('serialize', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    const serializedData = idx.serialize()
    expect(SearchIndex.deserialize(serializedData)).toMatchObject({
      schema: { fields: ['text'], ref: 'id' },
    })
  })
  test('unsubscribe', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    const observable = jest.fn()
    observable.unsubscribe = jest.fn()
    idx.unsubscribe(observable)
    expect(observable.unsubscribe).toHaveBeenCalled()
  })
  test.skip('subscribe', async () => {
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
    const observable = jest.fn()
    observable.subscribe = jest.fn()
    /* function callback(bool) {
      return bool
    }
    idx.subscribe(observable, callback) */
    const callback = jest.fn()
    idx.subscribe(observable, callback)
    expect(observable.subscribe).toHaveBeenCalled()
    expect(callback).toHaveBeenCalled()
  })
  test.skip('search but invalid search query', async () => {
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

    expect(console.warn).toHaveBeenCalled()
    expect(idx.search('$%@*&*#&@*', true)?.map((r) => r.ref)).toEqual([
      '1',
      '3',
    ])
  })
})
