import 'fake-indexeddb/auto'
import { SatelliteDB } from './SatelliteDB'
import SearchIndex from './SearchIndex'

describe('SatelliteDB', () => {
  let db: SatelliteDB
  beforeEach(async () => {
    db = new SatelliteDB()
  })
  test('tables', () => {
    expect(Object.keys(db.tables)).toMatchSnapshot()
  })

  test('storing and retrieving data', async () => {
    const data = [
      {
        key: '1',
        lastInbound: 1,
      },
      {
        key: '2',
        lastInbound: 2,
      },
    ]
    await db.conversations.bulkPut(data)
    expect(await db.conversations.toArray()).toEqual(data)
  })

  test('creating search indexes', async () => {
    await db.initializeSearchIndexes()
    expect(Object.keys(db.search)).toEqual(['friends', 'conversationMessages'])
    expect(db.search.conversationMessages).toBeInstanceOf(SearchIndex)
  })

  test('restoring search indexes', async () => {
    const where = { address: 'foo' }
    const data = { name: 'bar', textilePubkey: 'baz' }
    await db.initializeSearchIndexes()
    await db.upsert('friends', where, data)
    await db.saveSearchIndexes()
    await db.close()

    db = new SatelliteDB()
    await db.initializeSearchIndexes()
    expect(await db.search.friends.search('bar')?.[0]?.address).toEqual(
      where.address,
    )
  })

  test('upserting records', async () => {
    const where = { address: '1' }
    const original = {
      textilePubkey: 'foobarbaz',
      name: 'foo',
      photoHash: 'bar',
      lastUpdate: 1,
    }
    await db.upsert('friends', where, original)
    expect(await db.friends.get('1')).toEqual({ ...where, ...original })
    const update = {
      name: 'foo bar',
    }
    await db.upsert('friends', where, update)
    expect(await db.friends.get('1')).toEqual({
      ...where,
      ...original,
      ...update,
    })
  })
})
