import * as getters from '~/store/chat/getters'

describe('getters.default.getFiles', () => {
  test('0', () => {
    const object2: any = [
      { userId: '9876', value: 'Elio' },
      { userId: 'da7588892', value: 'Dillenberg' },
      { userId: '9876', value: 'Dillenberg' },
      { userId: '12345', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
    ]
    const object: any = [
      { replyId: '9876', value: true },
      { replyId: '12345', value: true },
      { replyId: 'da7588892', value: false },
      { replyId: '12345', value: false },
      { replyId: '9876', value: true },
    ]
    const result: any = getters.default.getFiles({
      replies: object,
      chatTexts: object2,
      files: {},
      countError: true,
      alertNsfw: true,
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object2: any = [
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Elio' },
      { userId: '12345', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
      { userId: '9876', value: 'Dillenberg' },
    ]
    const object: any = [
      { replyId: '9876', value: false },
      { replyId: '9876', value: true },
      { replyId: '9876', value: true },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: false },
    ]
    const result: any = getters.default.getFiles({
      replies: object,
      chatTexts: object2,
      files: {},
      countError: false,
      alertNsfw: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object2: any = [
      { userId: '9876', value: 'Dillenberg' },
      { userId: '9876', value: 'elio@example.com' },
      { userId: '9876', value: 'Elio' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
      { userId: '9876', value: 'elio@example.com' },
    ]
    const object: any = [
      { replyId: '9876', value: true },
      { replyId: '12345', value: true },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: false },
    ]
    const result: any = getters.default.getFiles({
      replies: object,
      chatTexts: object2,
      files: {},
      countError: true,
      alertNsfw: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object2: any = [
      { userId: '9876', value: 'Elio' },
      { userId: '9876', value: 'elio@example.com' },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Elio' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
      { userId: 'da7588892', value: 'Dillenberg' },
    ]
    const object: any = [
      { replyId: '9876', value: false },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: '9876', value: true },
    ]
    const result: any = getters.default.getFiles({
      replies: object,
      chatTexts: object2,
      files: {},
      countError: false,
      alertNsfw: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object2: any = [
      { userId: '9876', value: 'elio@example.com' },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Elio' },
      { userId: '12345', value: 'Elio' },
      { userId: '9876', value: 'Elio' },
      { userId: 'da7588892', value: 'Dillenberg' },
    ]
    const object: any = [
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: true },
      { replyId: 'da7588892', value: true },
      { replyId: 'da7588892', value: false },
      { replyId: '12345', value: true },
    ]
    const result: any = getters.default.getFiles({
      replies: object,
      chatTexts: object2,
      files: {},
      countError: true,
      alertNsfw: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = getters.default.getFiles({
      replies: [],
      chatTexts: [],
      files: {},
      countError: false,
      alertNsfw: true,
    })
    expect(result).toMatchSnapshot()
  })
})
