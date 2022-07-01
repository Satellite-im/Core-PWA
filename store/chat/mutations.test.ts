import { ChatState, ChatFileUpload } from './types'
import * as module from '~/store/chat/mutations'

describe('module.default.setChatReply', () => {
  test('0', () => {
    const object2: any = [
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'elio@example.com' },
      { userId: '9876', value: 'Elio' },
      { userId: '12345', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
      { userId: '9876', value: 'Elio' },
    ]
    const object: any = [
      { replyId: 'da7588892', value: false },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: '12345', value: true },
      { replyId: 'da7588892', value: true },
      { replyId: 'da7588892', value: true },
    ]
    const result: any = module.default.setChatReply(
      { replies: object, chatTexts: object2 },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: true },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object2: any = [
      { userId: 'da7588892', value: 'Elio' },
      { userId: 'da7588892', value: 'elio@example.com' },
      { userId: 'da7588892', value: 'Dillenberg' },
    ]
    const object: any = [{ replyId: 'da7588892', value: true }]
    const result: any = module.default.setChatReply(
      { replies: object, chatTexts: object2 },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object2: any = [
      { userId: '12345', value: 'Elio' },
      { userId: '9876', value: 'elio@example.com' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
    ]
    const object: any = [
      { replyId: 'da7588892', value: false },
      { replyId: '12345', value: false },
      { replyId: 'da7588892', value: true },
    ]
    const result: any = module.default.setChatReply(
      { replies: object, chatTexts: object2 },
      { replyId: '12345', value: false },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object2: any = [
      { userId: '12345', value: 'elio@example.com' },
      { userId: '9876', value: 'Dillenberg' },
    ]
    const object: any = [
      { replyId: '12345', value: false },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: true },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: false },
    ]
    const result: any = module.default.setChatReply(
      { replies: object, chatTexts: object2 },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: true },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object2: any = [
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
      { userId: '9876', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
      { userId: 'da7588892', value: 'elio@example.com' },
      { userId: 'da7588892', value: 'Elio' },
    ]
    const object: any = [
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: true },
      { replyId: '12345', value: true },
    ]
    const result: any = module.default.setChatReply(
      { replies: object, chatTexts: object2 },
      { replyId: 'da7588892', value: false },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.setChatReply(
      { replies: [], chatTexts: [] },
      { replyId: '', value: false },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('module.default.chatText', () => {
  test('0', () => {
    const object2: any = [
      { userId: '12345', value: 'elio@example.com' },
      { userId: '9876', value: 'Elio' },
    ]
    const object: any = [
      { replyId: '9876', value: false },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
    ]
    const result: any = module.default.chatText(
      { replies: object, chatTexts: object2 },
      { userId: '12345', value: 'Elio' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object2: any = [
      { userId: '12345', value: 'Dillenberg' },
      { userId: '12345', value: 'elio@example.com' },
      { userId: '12345', value: 'Elio' },
    ]
    const object: any = [
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: '12345', value: false },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: 'da7588892', value: true },
      { replyId: '12345', value: false },
    ]
    const result: any = module.default.chatText(
      { replies: object, chatTexts: object2 },
      { userId: '9876', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object2: any = [
      { userId: '12345', value: 'Elio' },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'elio@example.com' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'elio@example.com' },
    ]
    const object: any = [
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: false },
    ]
    const result: any = module.default.chatText(
      { replies: object, chatTexts: object2 },
      { userId: '12345', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object2: any = [
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'elio@example.com' },
      { userId: '12345', value: 'Elio' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Elio' },
    ]
    const object: any = [
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: false },
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
      { replyId: '9876', value: true },
      { replyId: 'bc23a9d531064583ace8f67dad60f6bb', value: true },
    ]
    const result: any = module.default.chatText(
      { replies: object, chatTexts: object2 },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Dillenberg' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object2: any = [
      { userId: '12345', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
      { userId: '12345', value: 'elio@example.com' },
      { userId: '9876', value: 'elio@example.com' },
    ]
    const object: any = [
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: '12345', value: false },
    ]
    const result: any = module.default.chatText(
      { replies: object, chatTexts: object2 },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Dillenberg' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.chatText(
      { replies: [], chatTexts: [] },
      { userId: '', value: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('misc', () => {
  const object2: any = [
    { userId: '12345', value: 'Dillenberg' },
    { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
    { userId: '12345', value: 'elio@example.com' },
    { userId: '9876', value: 'elio@example.com' },
  ]
  const object: any = [
    { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
    { replyId: '12345', value: false },
  ]
  const object3: ChatFileUpload[] = []
  const state = { replies: object, chatTexts: object2, files: object3 }

  test('module.default.addFile with empty files array', () => {
    const obj = {
      file: {
        file: 'path2',
        url: 'string2',
        nsfw: {
          checking: false,
          status: false,
        },
      },
      address: 'address1',
    }
    module.default.addFile(state, obj)
    expect(state.files).toMatchSnapshot()
  })
})

describe('module.default.chatText', () => {
  test('0', () => {
    const result: any = module.default.chatText(
      {
        chatTexts: {
          some: () => false,
          map: () => 'Michael',
          concat: () => 256,
        },
      },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = module.default.chatText(
      {
        chatTexts: { some: () => true, map: () => 'George', concat: () => 32 },
      },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = module.default.chatText(
      {
        chatTexts: { some: () => false, map: () => 'George', concat: () => 0 },
      },
      { userId: 'da7588892', value: 'Dillenberg' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = module.default.chatText(
      { chatTexts: { some: () => true, map: () => 'Anas', concat: () => 32 } },
      { userId: 'c466a48309794261b64a4f02cfcc3d64', value: 'Elio' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = module.default.chatText(
      { chatTexts: { some: () => false, map: () => 'Anas', concat: () => 64 } },
      { userId: 'da7588892', value: 'Dillenberg' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.chatText(
      { chatTexts: { some: () => false, map: () => '', concat: () => NaN } },
      { userId: '', value: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('module.default.setChatReply', () => {
  test('0', () => {
    const result: any = module.default.setChatReply(
      {
        replies: {
          some: () => false,
          map: () => 'Pierre Edouard',
          concat: () => 16,
        },
      },
      { replyId: 'da7588892', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = module.default.setChatReply(
      { replies: { some: () => false, map: () => 'Anas', concat: () => 16 } },
      { replyId: '9876', value: 'elio@example.com' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = module.default.setChatReply(
      { replies: { some: () => false, map: () => 'Edmond', concat: () => 0 } },
      {
        replyId: 'c466a48309794261b64a4f02cfcc3d64',
        value: 'elio@example.com',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = module.default.setChatReply(
      {
        replies: { some: () => false, map: () => 'Michael', concat: () => 64 },
      },
      { replyId: '12345', value: 'Dillenberg' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = module.default.setChatReply(
      {
        replies: {
          some: () => false,
          map: () => 'Pierre Edouard',
          concat: () => 10,
        },
      },
      {
        replyId: 'c466a48309794261b64a4f02cfcc3d64',
        value: 'elio@example.com',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.setChatReply(
      { replies: { some: () => false, map: () => '', concat: () => Infinity } },
      { replyId: '', value: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('module.default.addFile', () => {
  test('0', () => {
    const object: any = [
      ['index.js', 'index.js', 'image.png', 'program.exe'],
      ['index.js', 'program.exe', 'script.py', 'program.exe'],
      ['program.exe', 'image.png', 'image.png', 'install.deb'],
      ['script.py', 'install.deb', 'note.txt', 'image.png'],
    ]
    const result: any = module.default.addFile({ files: object }, 'program.exe')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      ['script.py', 'install.deb', 'install.deb', 'note.txt'],
      ['program.exe', 'script.py', 'install.deb', 'install.deb'],
      ['script.py', 'image.png', 'install.deb', 'index.js'],
      ['note.txt', 'note.txt', 'program.exe', 'script.py'],
    ]
    const result: any = module.default.addFile({ files: object }, 'script.py')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      ['note.txt', 'index.js', 'install.deb', 'note.txt'],
      ['script.py', 'image.png', 'note.txt', 'index.js'],
      ['image.png', 'image.png', 'script.py', 'note.txt'],
      ['program.exe', 'script.py', 'note.txt', 'image.png'],
    ]
    const result: any = module.default.addFile({ files: object }, 'index.js')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      ['script.py', 'image.png', 'image.png', 'index.js'],
      ['image.png', 'image.png', 'note.txt', 'note.txt'],
      ['image.png', 'index.js', 'image.png', 'program.exe'],
      ['image.png', 'note.txt', 'index.js', 'script.py'],
    ]
    const result: any = module.default.addFile({ files: object }, 'image.png')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      ['note.txt', 'image.png', 'image.png', 'image.png'],
      ['note.txt', 'program.exe', 'index.js', 'index.js'],
      ['script.py', 'program.exe', 'image.png', 'image.png'],
      ['install.deb', 'note.txt', 'index.js', 'program.exe'],
    ]
    const result: any = module.default.addFile({ files: object }, 'install.deb')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.addFile({ files: [] }, '')
    expect(result).toMatchSnapshot()
  })
})

describe('module.default.deleteFiles', () => {
  test('0', () => {
    const object: any = [
      ['image.png', 'install.deb', 'image.png', 'program.exe'],
      ['program.exe', 'image.png', 'index.js', 'program.exe'],
      ['note.txt', 'script.py', 'index.js', 'index.js'],
      ['program.exe', 'program.exe', 'install.deb', 'index.js'],
    ]
    const object2: any = [
      ['script.py', 'note.txt', 'index.js', 'note.txt'],
      ['note.txt', 'script.py', 'program.exe', 'note.txt'],
      ['image.png', 'program.exe', 'image.png', 'script.py'],
      ['index.js', 'script.py', 'program.exe', 'index.js'],
    ]
    const object3: any = [
      ['script.py', 'script.py', 'script.py', 'index.js'],
      ['image.png', 'install.deb', 'script.py', 'image.png'],
      ['program.exe', 'install.deb', 'index.js', 'note.txt'],
      ['install.deb', 'program.exe', 'index.js', 'note.txt'],
    ]
    const object4: any = [
      ['program.exe', 'image.png', 'note.txt', 'image.png'],
      ['program.exe', 'program.exe', 'index.js', 'script.py'],
      ['install.deb', 'install.deb', 'image.png', 'program.exe'],
      ['script.py', 'script.py', 'install.deb', 'script.py'],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      ['index.js', 'install.deb', 'program.exe', 'index.js'],
      ['install.deb', 'index.js', 'note.txt', 'image.png'],
      ['image.png', 'install.deb', 'script.py', 'index.js'],
      ['install.deb', 'program.exe', 'image.png', 'script.py'],
    ]
    const object7: any = [
      ['image.png', 'image.png', 'install.deb', 'install.deb'],
      ['program.exe', 'image.png', 'note.txt', 'program.exe'],
      ['install.deb', 'install.deb', 'script.py', 'install.deb'],
      ['note.txt', 'program.exe', 'note.txt', 'index.js'],
    ]
    const object8: any = [
      ['image.png', 'program.exe', 'program.exe', 'install.deb'],
      ['note.txt', 'install.deb', 'script.py', 'index.js'],
      ['script.py', 'program.exe', 'index.js', 'program.exe'],
      ['program.exe', 'script.py', 'install.deb', 'install.deb'],
    ]
    const object9: any = [
      ['install.deb', 'note.txt', 'script.py', 'image.png'],
      ['script.py', 'index.js', 'image.png', 'note.txt'],
      ['image.png', 'script.py', 'note.txt', 'index.js'],
      ['script.py', 'install.deb', 'image.png', 'install.deb'],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      ['install.deb', 'image.png', 'install.deb', 'program.exe'],
      ['index.js', 'install.deb', 'script.py', 'index.js'],
      ['install.deb', 'script.py', 'script.py', 'note.txt'],
      ['index.js', 'note.txt', 'image.png', 'image.png'],
    ]
    const object12: any = [
      ['note.txt', 'script.py', 'program.exe', 'script.py'],
      ['note.txt', 'note.txt', 'note.txt', 'note.txt'],
      ['note.txt', 'note.txt', 'script.py', 'program.exe'],
      ['install.deb', 'index.js', 'install.deb', 'index.js'],
    ]
    const object13: any = [
      ['image.png', 'script.py', 'image.png', 'index.js'],
      ['install.deb', 'note.txt', 'image.png', 'note.txt'],
      ['index.js', 'image.png', 'image.png', 'index.js'],
      ['image.png', 'image.png', 'script.py', 'program.exe'],
    ]
    const object14: any = [
      ['image.png', 'note.txt', 'install.deb', 'note.txt'],
      ['image.png', 'install.deb', 'install.deb', 'program.exe'],
      ['program.exe', 'program.exe', 'script.py', 'note.txt'],
      ['image.png', 'script.py', 'script.py', 'script.py'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      ['script.py', 'image.png', 'image.png', 'index.js'],
      ['install.deb', 'image.png', 'index.js', 'image.png'],
      ['note.txt', 'image.png', 'install.deb', 'note.txt'],
      ['index.js', 'image.png', 'note.txt', 'index.js'],
    ]
    const object17: any = [
      ['image.png', 'install.deb', 'image.png', 'script.py'],
      ['note.txt', 'install.deb', 'note.txt', 'program.exe'],
      ['image.png', 'note.txt', 'install.deb', 'program.exe'],
      ['script.py', 'image.png', 'index.js', 'program.exe'],
    ]
    const object18: any = [
      ['image.png', 'note.txt', 'install.deb', 'program.exe'],
      ['script.py', 'image.png', 'install.deb', 'program.exe'],
      ['note.txt', 'program.exe', 'program.exe', 'index.js'],
      ['script.py', 'script.py', 'note.txt', 'program.exe'],
    ]
    const object19: any = [
      ['install.deb', 'note.txt', 'note.txt', 'index.js'],
      ['image.png', 'program.exe', 'script.py', 'install.deb'],
      ['script.py', 'script.py', 'script.py', 'note.txt'],
      ['index.js', 'note.txt', 'program.exe', 'image.png'],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = module.default.deleteFiles(
      { files: object21 },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      ['index.js', 'program.exe', 'script.py', 'index.js'],
      ['install.deb', 'install.deb', 'note.txt', 'install.deb'],
      ['install.deb', 'script.py', 'program.exe', 'note.txt'],
      ['install.deb', 'program.exe', 'script.py', 'note.txt'],
    ]
    const object2: any = [
      ['image.png', 'script.py', 'install.deb', 'image.png'],
      ['install.deb', 'install.deb', 'program.exe', 'program.exe'],
      ['image.png', 'image.png', 'index.js', 'index.js'],
      ['image.png', 'index.js', 'install.deb', 'image.png'],
    ]
    const object3: any = [
      ['index.js', 'note.txt', 'index.js', 'install.deb'],
      ['note.txt', 'note.txt', 'program.exe', 'script.py'],
      ['script.py', 'image.png', 'script.py', 'install.deb'],
      ['index.js', 'image.png', 'index.js', 'program.exe'],
    ]
    const object4: any = [
      ['install.deb', 'program.exe', 'image.png', 'program.exe'],
      ['program.exe', 'index.js', 'program.exe', 'image.png'],
      ['install.deb', 'program.exe', 'script.py', 'program.exe'],
      ['index.js', 'script.py', 'image.png', 'script.py'],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      ['script.py', 'image.png', 'install.deb', 'image.png'],
      ['program.exe', 'install.deb', 'image.png', 'program.exe'],
      ['note.txt', 'install.deb', 'note.txt', 'script.py'],
      ['index.js', 'script.py', 'index.js', 'image.png'],
    ]
    const object7: any = [
      ['image.png', 'install.deb', 'note.txt', 'index.js'],
      ['image.png', 'index.js', 'note.txt', 'note.txt'],
      ['index.js', 'program.exe', 'note.txt', 'note.txt'],
      ['program.exe', 'image.png', 'program.exe', 'install.deb'],
    ]
    const object8: any = [
      ['note.txt', 'program.exe', 'image.png', 'install.deb'],
      ['image.png', 'program.exe', 'script.py', 'index.js'],
      ['note.txt', 'install.deb', 'image.png', 'script.py'],
      ['install.deb', 'image.png', 'image.png', 'note.txt'],
    ]
    const object9: any = [
      ['image.png', 'script.py', 'install.deb', 'note.txt'],
      ['program.exe', 'program.exe', 'index.js', 'note.txt'],
      ['program.exe', 'install.deb', 'program.exe', 'program.exe'],
      ['script.py', 'image.png', 'image.png', 'script.py'],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      ['note.txt', 'index.js', 'program.exe', 'program.exe'],
      ['install.deb', 'index.js', 'program.exe', 'program.exe'],
      ['program.exe', 'script.py', 'program.exe', 'script.py'],
      ['script.py', 'image.png', 'install.deb', 'script.py'],
    ]
    const object12: any = [
      ['image.png', 'program.exe', 'install.deb', 'script.py'],
      ['program.exe', 'index.js', 'note.txt', 'program.exe'],
      ['program.exe', 'index.js', 'index.js', 'image.png'],
      ['index.js', 'script.py', 'install.deb', 'script.py'],
    ]
    const object13: any = [
      ['image.png', 'install.deb', 'index.js', 'image.png'],
      ['script.py', 'install.deb', 'script.py', 'script.py'],
      ['script.py', 'note.txt', 'script.py', 'index.js'],
      ['script.py', 'install.deb', 'image.png', 'install.deb'],
    ]
    const object14: any = [
      ['install.deb', 'program.exe', 'script.py', 'program.exe'],
      ['note.txt', 'program.exe', 'program.exe', 'note.txt'],
      ['program.exe', 'image.png', 'index.js', 'install.deb'],
      ['install.deb', 'install.deb', 'note.txt', 'index.js'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      ['program.exe', 'note.txt', 'program.exe', 'install.deb'],
      ['index.js', 'program.exe', 'index.js', 'image.png'],
      ['note.txt', 'install.deb', 'script.py', 'note.txt'],
      ['note.txt', 'image.png', 'script.py', 'note.txt'],
    ]
    const object17: any = [
      ['note.txt', 'program.exe', 'image.png', 'note.txt'],
      ['note.txt', 'script.py', 'note.txt', 'index.js'],
      ['note.txt', 'program.exe', 'image.png', 'program.exe'],
      ['install.deb', 'script.py', 'note.txt', 'note.txt'],
    ]
    const object18: any = [
      ['note.txt', 'image.png', 'image.png', 'note.txt'],
      ['script.py', 'program.exe', 'program.exe', 'index.js'],
      ['install.deb', 'index.js', 'note.txt', 'index.js'],
      ['note.txt', 'program.exe', 'program.exe', 'program.exe'],
    ]
    const object19: any = [
      ['note.txt', 'program.exe', 'image.png', 'image.png'],
      ['install.deb', 'script.py', 'script.py', 'script.py'],
      ['image.png', 'install.deb', 'script.py', 'index.js'],
      ['program.exe', 'note.txt', 'index.js', 'script.py'],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = module.default.deleteFiles(
      { files: object21 },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      ['install.deb', 'index.js', 'note.txt', 'install.deb'],
      ['program.exe', 'script.py', 'index.js', 'note.txt'],
      ['note.txt', 'index.js', 'note.txt', 'script.py'],
      ['note.txt', 'install.deb', 'image.png', 'image.png'],
    ]
    const object2: any = [
      ['image.png', 'image.png', 'note.txt', 'image.png'],
      ['index.js', 'program.exe', 'image.png', 'install.deb'],
      ['index.js', 'program.exe', 'install.deb', 'index.js'],
      ['install.deb', 'index.js', 'install.deb', 'image.png'],
    ]
    const object3: any = [
      ['install.deb', 'program.exe', 'image.png', 'image.png'],
      ['image.png', 'script.py', 'index.js', 'script.py'],
      ['script.py', 'script.py', 'index.js', 'program.exe'],
      ['script.py', 'image.png', 'install.deb', 'script.py'],
    ]
    const object4: any = [
      ['note.txt', 'image.png', 'index.js', 'script.py'],
      ['program.exe', 'program.exe', 'index.js', 'install.deb'],
      ['install.deb', 'script.py', 'note.txt', 'install.deb'],
      ['program.exe', 'image.png', 'script.py', 'program.exe'],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      ['index.js', 'program.exe', 'note.txt', 'program.exe'],
      ['note.txt', 'script.py', 'install.deb', 'image.png'],
      ['note.txt', 'index.js', 'program.exe', 'index.js'],
      ['index.js', 'install.deb', 'program.exe', 'note.txt'],
    ]
    const object7: any = [
      ['program.exe', 'index.js', 'script.py', 'script.py'],
      ['index.js', 'script.py', 'index.js', 'program.exe'],
      ['program.exe', 'program.exe', 'install.deb', 'program.exe'],
      ['program.exe', 'script.py', 'index.js', 'index.js'],
    ]
    const object8: any = [
      ['index.js', 'script.py', 'image.png', 'install.deb'],
      ['script.py', 'image.png', 'index.js', 'program.exe'],
      ['program.exe', 'script.py', 'program.exe', 'install.deb'],
      ['index.js', 'index.js', 'program.exe', 'script.py'],
    ]
    const object9: any = [
      ['index.js', 'index.js', 'index.js', 'program.exe'],
      ['index.js', 'note.txt', 'install.deb', 'install.deb'],
      ['install.deb', 'install.deb', 'script.py', 'program.exe'],
      ['note.txt', 'install.deb', 'install.deb', 'note.txt'],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      ['image.png', 'note.txt', 'image.png', 'image.png'],
      ['note.txt', 'install.deb', 'image.png', 'image.png'],
      ['image.png', 'image.png', 'install.deb', 'script.py'],
      ['install.deb', 'image.png', 'image.png', 'script.py'],
    ]
    const object12: any = [
      ['index.js', 'script.py', 'image.png', 'install.deb'],
      ['image.png', 'index.js', 'script.py', 'install.deb'],
      ['note.txt', 'note.txt', 'image.png', 'script.py'],
      ['image.png', 'install.deb', 'install.deb', 'index.js'],
    ]
    const object13: any = [
      ['index.js', 'index.js', 'script.py', 'note.txt'],
      ['install.deb', 'image.png', 'image.png', 'note.txt'],
      ['program.exe', 'install.deb', 'program.exe', 'script.py'],
      ['install.deb', 'install.deb', 'install.deb', 'image.png'],
    ]
    const object14: any = [
      ['install.deb', 'image.png', 'image.png', 'note.txt'],
      ['note.txt', 'program.exe', 'install.deb', 'program.exe'],
      ['program.exe', 'script.py', 'program.exe', 'install.deb'],
      ['image.png', 'install.deb', 'note.txt', 'script.py'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      ['script.py', 'install.deb', 'image.png', 'program.exe'],
      ['note.txt', 'install.deb', 'index.js', 'program.exe'],
      ['index.js', 'install.deb', 'image.png', 'program.exe'],
      ['image.png', 'image.png', 'note.txt', 'image.png'],
    ]
    const object17: any = [
      ['note.txt', 'script.py', 'program.exe', 'install.deb'],
      ['install.deb', 'install.deb', 'install.deb', 'script.py'],
      ['image.png', 'script.py', 'index.js', 'script.py'],
      ['image.png', 'note.txt', 'note.txt', 'note.txt'],
    ]
    const object18: any = [
      ['image.png', 'program.exe', 'index.js', 'image.png'],
      ['index.js', 'program.exe', 'image.png', 'install.deb'],
      ['script.py', 'script.py', 'script.py', 'install.deb'],
      ['program.exe', 'install.deb', 'install.deb', 'index.js'],
    ]
    const object19: any = [
      ['script.py', 'program.exe', 'install.deb', 'note.txt'],
      ['program.exe', 'note.txt', 'install.deb', 'index.js'],
      ['index.js', 'image.png', 'install.deb', 'image.png'],
      ['script.py', 'image.png', 'script.py', 'script.py'],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = module.default.deleteFiles(
      { files: object21 },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      ['program.exe', 'index.js', 'image.png', 'script.py'],
      ['script.py', 'image.png', 'note.txt', 'program.exe'],
      ['image.png', 'note.txt', 'image.png', 'image.png'],
      ['install.deb', 'index.js', 'index.js', 'image.png'],
    ]
    const object2: any = [
      ['index.js', 'image.png', 'index.js', 'script.py'],
      ['note.txt', 'index.js', 'note.txt', 'install.deb'],
      ['note.txt', 'image.png', 'note.txt', 'program.exe'],
      ['index.js', 'note.txt', 'image.png', 'install.deb'],
    ]
    const object3: any = [
      ['note.txt', 'install.deb', 'image.png', 'image.png'],
      ['script.py', 'program.exe', 'program.exe', 'image.png'],
      ['index.js', 'program.exe', 'note.txt', 'image.png'],
      ['index.js', 'image.png', 'index.js', 'note.txt'],
    ]
    const object4: any = [
      ['index.js', 'note.txt', 'note.txt', 'install.deb'],
      ['note.txt', 'program.exe', 'program.exe', 'install.deb'],
      ['image.png', 'image.png', 'image.png', 'index.js'],
      ['script.py', 'install.deb', 'index.js', 'install.deb'],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      ['install.deb', 'install.deb', 'program.exe', 'index.js'],
      ['image.png', 'install.deb', 'install.deb', 'note.txt'],
      ['image.png', 'program.exe', 'install.deb', 'program.exe'],
      ['program.exe', 'image.png', 'index.js', 'note.txt'],
    ]
    const object7: any = [
      ['program.exe', 'note.txt', 'image.png', 'index.js'],
      ['image.png', 'script.py', 'program.exe', 'program.exe'],
      ['image.png', 'script.py', 'index.js', 'program.exe'],
      ['install.deb', 'index.js', 'program.exe', 'index.js'],
    ]
    const object8: any = [
      ['image.png', 'install.deb', 'install.deb', 'script.py'],
      ['image.png', 'index.js', 'note.txt', 'program.exe'],
      ['note.txt', 'note.txt', 'note.txt', 'index.js'],
      ['script.py', 'image.png', 'program.exe', 'note.txt'],
    ]
    const object9: any = [
      ['note.txt', 'image.png', 'program.exe', 'index.js'],
      ['image.png', 'note.txt', 'script.py', 'install.deb'],
      ['script.py', 'install.deb', 'note.txt', 'program.exe'],
      ['image.png', 'script.py', 'install.deb', 'image.png'],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      ['script.py', 'image.png', 'script.py', 'program.exe'],
      ['image.png', 'image.png', 'image.png', 'image.png'],
      ['install.deb', 'note.txt', 'note.txt', 'script.py'],
      ['index.js', 'image.png', 'index.js', 'script.py'],
    ]
    const object12: any = [
      ['script.py', 'index.js', 'program.exe', 'index.js'],
      ['index.js', 'index.js', 'script.py', 'image.png'],
      ['install.deb', 'image.png', 'note.txt', 'image.png'],
      ['note.txt', 'program.exe', 'note.txt', 'script.py'],
    ]
    const object13: any = [
      ['note.txt', 'index.js', 'program.exe', 'program.exe'],
      ['image.png', 'install.deb', 'script.py', 'program.exe'],
      ['image.png', 'script.py', 'image.png', 'note.txt'],
      ['note.txt', 'index.js', 'index.js', 'install.deb'],
    ]
    const object14: any = [
      ['install.deb', 'script.py', 'index.js', 'note.txt'],
      ['image.png', 'index.js', 'program.exe', 'note.txt'],
      ['script.py', 'install.deb', 'index.js', 'note.txt'],
      ['install.deb', 'image.png', 'script.py', 'script.py'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      ['image.png', 'program.exe', 'index.js', 'note.txt'],
      ['program.exe', 'install.deb', 'image.png', 'note.txt'],
      ['image.png', 'program.exe', 'note.txt', 'index.js'],
      ['install.deb', 'index.js', 'program.exe', 'script.py'],
    ]
    const object17: any = [
      ['note.txt', 'note.txt', 'install.deb', 'script.py'],
      ['index.js', 'program.exe', 'program.exe', 'note.txt'],
      ['script.py', 'note.txt', 'note.txt', 'note.txt'],
      ['image.png', 'image.png', 'note.txt', 'script.py'],
    ]
    const object18: any = [
      ['note.txt', 'program.exe', 'index.js', 'script.py'],
      ['index.js', 'install.deb', 'image.png', 'install.deb'],
      ['image.png', 'image.png', 'note.txt', 'program.exe'],
      ['note.txt', 'index.js', 'program.exe', 'install.deb'],
    ]
    const object19: any = [
      ['program.exe', 'note.txt', 'program.exe', 'install.deb'],
      ['script.py', 'program.exe', 'program.exe', 'note.txt'],
      ['image.png', 'note.txt', 'program.exe', 'script.py'],
      ['program.exe', 'script.py', 'install.deb', 'program.exe'],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = module.default.deleteFiles(
      { files: object21 },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      ['install.deb', 'index.js', 'install.deb', 'script.py'],
      ['script.py', 'script.py', 'image.png', 'index.js'],
      ['install.deb', 'program.exe', 'image.png', 'program.exe'],
      ['image.png', 'script.py', 'install.deb', 'image.png'],
    ]
    const object2: any = [
      ['image.png', 'script.py', 'index.js', 'script.py'],
      ['install.deb', 'image.png', 'image.png', 'install.deb'],
      ['note.txt', 'note.txt', 'install.deb', 'script.py'],
      ['note.txt', 'note.txt', 'index.js', 'install.deb'],
    ]
    const object3: any = [
      ['image.png', 'script.py', 'index.js', 'program.exe'],
      ['script.py', 'script.py', 'note.txt', 'index.js'],
      ['note.txt', 'script.py', 'program.exe', 'index.js'],
      ['program.exe', 'program.exe', 'install.deb', 'install.deb'],
    ]
    const object4: any = [
      ['program.exe', 'index.js', 'image.png', 'script.py'],
      ['script.py', 'program.exe', 'script.py', 'image.png'],
      ['note.txt', 'install.deb', 'image.png', 'install.deb'],
      ['program.exe', 'note.txt', 'install.deb', 'index.js'],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      ['note.txt', 'install.deb', 'note.txt', 'install.deb'],
      ['program.exe', 'script.py', 'program.exe', 'image.png'],
      ['install.deb', 'index.js', 'index.js', 'index.js'],
      ['program.exe', 'script.py', 'index.js', 'script.py'],
    ]
    const object7: any = [
      ['image.png', 'install.deb', 'program.exe', 'index.js'],
      ['script.py', 'note.txt', 'script.py', 'script.py'],
      ['image.png', 'note.txt', 'install.deb', 'install.deb'],
      ['script.py', 'program.exe', 'index.js', 'image.png'],
    ]
    const object8: any = [
      ['script.py', 'program.exe', 'install.deb', 'index.js'],
      ['install.deb', 'image.png', 'install.deb', 'image.png'],
      ['program.exe', 'note.txt', 'script.py', 'install.deb'],
      ['image.png', 'program.exe', 'install.deb', 'index.js'],
    ]
    const object9: any = [
      ['install.deb', 'index.js', 'index.js', 'install.deb'],
      ['image.png', 'image.png', 'program.exe', 'script.py'],
      ['script.py', 'install.deb', 'note.txt', 'index.js'],
      ['index.js', 'program.exe', 'program.exe', 'index.js'],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      ['program.exe', 'image.png', 'program.exe', 'index.js'],
      ['script.py', 'index.js', 'note.txt', 'program.exe'],
      ['note.txt', 'install.deb', 'install.deb', 'script.py'],
      ['install.deb', 'index.js', 'index.js', 'image.png'],
    ]
    const object12: any = [
      ['install.deb', 'note.txt', 'image.png', 'install.deb'],
      ['install.deb', 'image.png', 'image.png', 'install.deb'],
      ['install.deb', 'note.txt', 'note.txt', 'index.js'],
      ['install.deb', 'script.py', 'index.js', 'program.exe'],
    ]
    const object13: any = [
      ['index.js', 'program.exe', 'script.py', 'install.deb'],
      ['image.png', 'install.deb', 'note.txt', 'install.deb'],
      ['program.exe', 'index.js', 'program.exe', 'index.js'],
      ['install.deb', 'image.png', 'script.py', 'index.js'],
    ]
    const object14: any = [
      ['install.deb', 'image.png', 'install.deb', 'note.txt'],
      ['note.txt', 'image.png', 'note.txt', 'image.png'],
      ['index.js', 'program.exe', 'install.deb', 'script.py'],
      ['note.txt', 'index.js', 'note.txt', 'script.py'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      ['script.py', 'program.exe', 'image.png', 'note.txt'],
      ['script.py', 'image.png', 'program.exe', 'install.deb'],
      ['index.js', 'image.png', 'image.png', 'program.exe'],
      ['note.txt', 'image.png', 'image.png', 'image.png'],
    ]
    const object17: any = [
      ['image.png', 'script.py', 'program.exe', 'note.txt'],
      ['install.deb', 'index.js', 'program.exe', 'install.deb'],
      ['image.png', 'image.png', 'program.exe', 'index.js'],
      ['script.py', 'program.exe', 'index.js', 'note.txt'],
    ]
    const object18: any = [
      ['install.deb', 'program.exe', 'program.exe', 'image.png'],
      ['program.exe', 'install.deb', 'image.png', 'install.deb'],
      ['script.py', 'program.exe', 'image.png', 'install.deb'],
      ['program.exe', 'note.txt', 'script.py', 'note.txt'],
    ]
    const object19: any = [
      ['script.py', 'install.deb', 'program.exe', 'image.png'],
      ['note.txt', 'install.deb', 'note.txt', 'note.txt'],
      ['script.py', 'index.js', 'install.deb', 'script.py'],
      ['install.deb', 'note.txt', 'note.txt', 'note.txt'],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = module.default.deleteFiles(
      { files: object21 },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = module.default.deleteFiles({ files: [] }, '')
    expect(result).toMatchSnapshot()
  })
})

describe('misc', () => {
  const InitialChatState = (): ChatState => ({
    replies: [],
    chatTexts: [],
    files: {},
    countError: false,
    currentChat: {
      direction: 'TOP',
      hasNextPage: true,
      isMessagesLoading: false,
      isScrollOver: true,
      lastLoadedMessageId: '',
      messages: [],
      offset: 0,
      page: 1,
      showOlderMessagesInfo: false,
      size: 10,
    },
  })

  test('module.setCountError', () => {
    const argument = true
    const localState = { ...InitialChatState }

    module.default.setCountError(localState, argument)

    expect(localState.countError).toEqual(argument)
  })

  test('module.setCurrentChat', () => {
    const argument = {
      direction: 'BOTTOM',
      hasNextPage: true,
      isMessagesLoading: false,
      isScrollOver: true,
      lastLoadedMessageId: '',
      messages: [],
      offset: 0,
      page: 1,
      showOlderMessagesInfo: false,
      size: 10,
    }
    const localState = { ...InitialChatState }

    module.default.setCurrentChat(localState, argument)

    expect(localState.currentChat).toEqual(argument)
  })

  test('module.resetCurrentChat', () => {
    const localState = { ...InitialChatState }

    module.default.resetCurrentChat(localState)

    expect(localState.currentChat).toEqual({
      direction: 'TOP',
      hasNextPage: true,
      isMessagesLoading: false,
      isScrollOver: true,
      lastLoadedMessageId: '',
      messages: [],
      offset: 0,
      page: 1,
      showOlderMessagesInfo: false,
      size: 10,
    })
  })

  test('module.removeFile', () => {
    const localState = {
      ...InitialChatState,
      files: {
        file1: [
          {
            file: 'path2',
            url: 'string2',
            nsfw: {
              checking: false,
              status: false,
            },
            progress: 0,
          },
        ],
      },
    }
    const argument = { address: 'file1', index: 0 }

    module.default.removeFile(localState, argument)

    expect(localState.files).toEqual({ file1: [] })
  })

  test('module.setFileProgress', () => {
    const localState = {
      ...InitialChatState,
      files: {
        file1: [
          {
            file: 'path2',
            url: 'string2',
            nsfw: {
              checking: false,
              status: false,
            },
            progress: 0,
          },
        ],
      },
    }
    const argument = { address: 'file1', index: 0, progress: 10 }

    module.default.setFileProgress(localState, argument)

    expect(localState.files).toEqual({
      file1: [
        {
          file: 'path2',
          nsfw: { checking: false, status: false },
          progress: 10,
          url: 'string2',
        },
      ],
    })
  })
})
