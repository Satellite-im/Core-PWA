import { expect } from '@jest/globals'
import * as mutations from '~/store/search/mutations'

describe('mutations.default.setSearchQuery', () => {
  test('0', () => {
    const object2: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 100,
        type: 'number',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: 'Edmond',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Elio',
        value: 'elio@example.com',
      },
      {
        name: 'Jean-Philippe',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'elio@example.com',
        value: 'elio@example.com',
      },
      {
        name: 'Michael',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'elio@example.com',
        value: 'elio@example.com',
      },
      {
        name: 'George',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Elio',
        value: 'Elio',
      },
    ]
    const result: any = mutations.default.setSearchQuery(
      {
        query: 'DROP TABLE tmp;',
        result: {
          query:
            "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
          recommend: { key1: object, key3: [], key0: [], key2: [] },
          data: {
            pageInfo: { totalRows: 30, perPage: -1.0, pageIndex: -1 },
            list: object2,
          },
        },
      },
      'UPDATE Projects SET pname = %s WHERE pid = %s',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setSearchQuery(
      { query: 'UPDATE Projects SET pname = %s WHERE pid = %s', result: null },
      "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object2: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: -100,
        type: 'number',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: 1,
        type: 'number',
        user: undefined,
      },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 1,
        type: 'array',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Dillenberg',
        value: 'Dillenberg',
      },
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: undefined,
        key: 'elio@example.com',
        value: 'elio@example.com',
      },
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Dillenberg',
        value: 'elio@example.com',
      },
    ]
    const result: any = mutations.default.setSearchQuery(
      {
        query: 'UPDATE Projects SET pname = %s WHERE pid = %s',
        result: {
          query:
            "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
          recommend: { key1: object, key0: [], key2: [] },
          data: {
            pageInfo: { totalRows: 5, perPage: 0.5, pageIndex: 0 },
            list: object2,
          },
        },
      },
      "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object2: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 1,
        type: 'array',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: 'Michael',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/ky_128.jpg',
        key: 'elio@example.com',
        value: 'Dillenberg',
      },
      {
        name: 'George',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/joannefournier_128.jpg',
        key: 'Dillenberg',
        value: 'Elio',
      },
      {
        name: 'Jean-Philippe',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Dillenberg',
        value: 'elio@example.com',
      },
      {
        name: 'George',
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Elio',
        value: 'Dillenberg',
      },
    ]
    const result: any = mutations.default.setSearchQuery(
      {
        query: 'DELETE FROM Projects WHERE pid = %s',
        result: {
          query: 'DROP TABLE tmp;',
          recommend: { key1: object, key3: [], key0: [], key2: [] },
          data: {
            pageInfo: { totalRows: 4, perPage: 10.0, pageIndex: -1 },
            list: object2,
          },
        },
      },
      'UPDATE Projects SET pname = %s WHERE pid = %s',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: 0,
        type: 'string',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: -100,
        type: 'array',
        user: undefined,
      },
    ]
    const result: any = mutations.default.setSearchQuery(
      {
        query: 'UNLOCK TABLES;',
        result: {
          query: 'DELETE FROM Projects WHERE pid = %s',
          recommend: {},
          data: {
            pageInfo: { totalRows: 10, perPage: 10.23, pageIndex: 0 },
            list: object,
          },
        },
      },
      'UPDATE Projects SET pname = %s WHERE pid = %s',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setSearchQuery(
      {
        query: '',
        result: {
          query: '',
          recommend: { key1: [], key0: [], key2: [] },
          data: {
            pageInfo: { totalRows: NaN, perPage: NaN, pageIndex: NaN },
            list: [],
          },
        },
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.search', () => {
  test('0', () => {
    const object2: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: -5.48,
        type: 'array',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: 100,
        type: 'object',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: -100,
        type: 'object',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 100,
        type: 'array',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/ky_128.jpg',
        key: 'Elio',
        value: 'Dillenberg',
      },
    ]
    const result: any = mutations.default.search(
      { query: 'UNLOCK TABLES;', result: null },
      {
        query:
          "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
        recommend: { key0: object },
        data: {
          pageInfo: { totalRows: 4, perPage: 0.5, pageIndex: -100 },
          list: object2,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object2: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: -100,
        type: 'number',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: -100,
        type: 'object',
        user: undefined,
      },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: -100,
        type: 'object',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 0,
        type: 'object',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: 'Anas',
        address: '192.168.1.5',
        avatar: undefined,
        key: 'elio@example.com',
        value: 'Elio',
      },
      {
        name: 'Michael',
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Dillenberg',
        value: 'Dillenberg',
      },
      {
        name: 'Pierre Edouard',
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Elio',
        value: 'elio@example.com',
      },
    ]
    const object4: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 100,
        type: 'object',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: 1,
        type: 'array',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 100,
        type: 'object',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 100,
        type: 'array',
        user: undefined,
      },
    ]
    const object3: any = [
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: undefined,
        key: 'Elio',
        value: 'elio@example.com',
      },
    ]
    const result: any = mutations.default.search(
      {
        query: 'DELETE FROM Projects WHERE pid = %s',
        result: {
          query: 'UNLOCK TABLES;',
          recommend: { key0: object, key2: [], key4: [], key3: [], key1: [] },
          data: {
            pageInfo: { totalRows: 5, perPage: 10.0, pageIndex: 0 },
            list: object2,
          },
        },
      },
      {
        query: 'UPDATE Projects SET pname = %s WHERE pid = %s',
        recommend: { key1: object3, key0: [], key2: [null] },
        data: {
          pageInfo: { totalRows: 10, perPage: -1.0, pageIndex: 100 },
          list: object4,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object2: any = [
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: 100,
        type: 'array',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'elio@example.com',
        value: 'Dillenberg',
      },
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Dillenberg',
        value: 'Dillenberg',
      },
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Elio',
        value: 'elio@example.com',
      },
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Elio',
        value: 'elio@example.com',
      },
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'elio@example.com',
        value: 'Elio',
      },
    ]
    const result: any = mutations.default.search(
      { query: 'UPDATE Projects SET pname = %s WHERE pid = %s', result: null },
      {
        query: 'DROP TABLE tmp;',
        recommend: { key0: object, key2: [], key4: [], key3: [], key1: [] },
        data: {
          pageInfo: { totalRows: 10, perPage: -1.0, pageIndex: 100 },
          list: object2,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object2: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 0,
        type: 'number',
        user: undefined,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        at: -5.48,
        type: 'object',
        user: undefined,
      },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 0,
        type: 'array',
        user: undefined,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: 100,
        type: 'array',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: 'Michael',
        address: '192.168.1.5',
        avatar: undefined,
        key: 'Elio',
        value: 'Elio',
      },
      {
        name: 'George',
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Elio',
        value: 'Dillenberg',
      },
      {
        name: 'Anas',
        address: '0.0.0.0',
        avatar: undefined,
        key: 'Elio',
        value: 'elio@example.com',
      },
    ]
    const object4: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 100,
        type: 'number',
        user: undefined,
      },
    ]
    const object3: any = [
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: 'https://cdn.fakercloud.com/avatars/zvchkelly_128.jpg',
        key: 'Elio',
        value: 'Elio',
      },
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Elio',
        value: 'Dillenberg',
      },
      {
        name: undefined,
        address: '192.168.1.5',
        avatar: 'https://cdn.fakercloud.com/avatars/joannefournier_128.jpg',
        key: 'Elio',
        value: 'Elio',
      },
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: 'https://cdn.fakercloud.com/avatars/joannefournier_128.jpg',
        key: 'elio@example.com',
        value: 'Elio',
      },
      {
        name: undefined,
        address: '0.0.0.0',
        avatar: 'https://cdn.fakercloud.com/avatars/ky_128.jpg',
        key: 'elio@example.com',
        value: 'Elio',
      },
    ]
    const result: any = mutations.default.search(
      {
        query: 'DELETE FROM Projects WHERE pid = %s',
        result: {
          query: 'UNLOCK TABLES;',
          recommend: { key0: object, key2: [], key4: [], key3: [], key1: [] },
          data: {
            pageInfo: { totalRows: 0, perPage: -0.5, pageIndex: -100 },
            list: object2,
          },
        },
      },
      {
        query: 'DROP TABLE tmp;',
        recommend: { key0: object3, key2: [], key4: [], key3: [], key1: [] },
        data: {
          pageInfo: { totalRows: 3.0, perPage: 1.0, pageIndex: 1 },
          list: object4,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object2: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        at: -100,
        type: 'number',
        user: undefined,
      },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        at: 100,
        type: 'object',
        user: undefined,
      },
    ]
    const object: any = [
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Dillenberg',
        value: 'Elio',
      },
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/joannefournier_128.jpg',
        key: 'elio@example.com',
        value: 'elio@example.com',
      },
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg',
        key: 'Elio',
        value: 'Elio',
      },
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Elio',
        value: 'Dillenberg',
      },
      {
        name: undefined,
        address: undefined,
        avatar: 'https://cdn.fakercloud.com/avatars/weavermedia_128.jpg',
        key: 'Elio',
        value: 'Elio',
      },
    ]
    const result: any = mutations.default.search(
      { query: 'DROP TABLE tmp;', result: null },
      {
        query:
          "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
        recommend: { key0: object },
        data: {
          pageInfo: { totalRows: 5, perPage: 0.0, pageIndex: 0 },
          list: object2,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.search(
      { query: '', result: null },
      {
        query: '',
        recommend: { key0: [] },
        data: {
          pageInfo: { totalRows: NaN, perPage: NaN, pageIndex: NaN },
          list: [],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })
})
