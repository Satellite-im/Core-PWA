import { setInObject } from './utils'

describe('', () => {
  test('Initialize Crypto', () => {
    const params = {
      obj: {
        a: {
          b: {},
        },
      },
      path: 'a',
      value: {
        a: 1,
      },
    }
    const result = setInObject(params.obj, params.path, params.value)
    expect(result).toBeTruthy()
  })
})
