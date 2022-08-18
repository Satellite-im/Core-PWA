import { setInObject } from './utils'

describe('Iridium utils', () => {
  test('test params', () => {
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
