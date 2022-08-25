import * as chat from '~/utilities/chat'
import * as file from '~/libraries/Files/types/file'

describe('chat.conversationMessageIsNotice', () => {
  test('test case 1', () => {
    const object: any = [
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        name: 'Michael',
        type: file.FILE_TYPE.TGPA,
        size: 32,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: false,
      },
    ]
    const result: any = chat.conversationMessageIsNotice({
      id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
      conversationId: 'https://',
      from: 'C:\\\\path\\to\\folder\\',
      type: 'file',
      at: -100,
      body: 'role',
      glyph: undefined,
      attachments: object,
      reactions: {},
      replyToId: 'https://',
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })

  test('test case 2', () => {
    const object: any = [
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        name: 'Anas',
        type: file.FILE_TYPE.BIN,
        size: 10,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: true,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        name: 'Pierre Edouard',
        type: file.FILE_TYPE.BIN,
        size: 256,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: false,
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        name: 'Edmond',
        type: file.FILE_TYPE.BIN,
        size: 256,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: true,
      },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        name: 'Michael',
        type: file.FILE_TYPE.BIN,
        size: 0,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: true,
      },
    ]
    const result: any = chat.conversationMessageIsNotice({
      id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
      conversationId: 'https://croplands.org/app/a/confirm?t=',
      from: 'C:\\\\path\\to\\file.ext',
      type: 'object',
      at: 100,
      body: undefined,
      glyph: undefined,
      attachments: object,
      reactions: {
        key0: ['George', 'Anas', 'George', 'Edmond'],
        key2: ['foo bar', 'Hello, world!'],
        key1: ['Hello, world!', 'Hello, world!', 'This is a Text'],
      },
      replyToId: undefined,
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })

  test('test case 3', () => {
    const object: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        name: 'Edmond',
        type: file.FILE_TYPE.JPG,
        size: 256,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: true,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        name: 'Anas',
        type: file.FILE_TYPE.JPG,
        size: 10,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: true,
      },
    ]
    const result: any = chat.conversationMessageIsNotice({
      id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
      conversationId: 'http://base.com',
      from: './path/to/file',
      type: 'string',
      at: -100,
      body: 'wasGeneratedBy',
      glyph: undefined,
      attachments: object,
      reactions: {
        key0: ['Anas', 'Pierre Edouard', 'Pierre Edouard', 'Edmond', 'Edmond'],
      },
      replyToId: 'https://api.telegram.org/bot',
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })

  test('test case 4', () => {
    const object: any = [
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        name: 'Pierre Edouard',
        type: file.FILE_TYPE.JAR,
        size: 16,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: false,
      },
    ]
    const result: any = chat.conversationMessageIsNotice({
      id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
      conversationId: 'https://api.telegram.org/',
      from: 'C:\\\\path\\to\\folder\\',
      type: 'string',
      at: 0,
      body: 'tag',
      glyph: undefined,
      attachments: object,
      reactions: {
        key0: ['Edmond', 'George'],
        key2: [
          'This is a Text',
          'Hello, world!',
          'This is a Text',
          'This is a Text',
        ],
        key1: ['foo bar', 'This is a Text'],
      },
      replyToId: undefined,
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })

  test('test case 5', () => {
    const object: any = [
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        name: 'Edmond',
        type: file.FILE_TYPE.JPG,
        size: 64,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: false,
      },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        name: 'George',
        type: file.FILE_TYPE.JPG,
        size: 32,
        thumbnail: 'http://placeimg.com/640/480',
        nsfw: false,
      },
    ]
    const result: any = chat.conversationMessageIsNotice({
      id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
      conversationId:
        'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
      from: 'path/to/file.ext',
      type: 'string',
      at: 1,
      body: 'parameter',
      glyph: undefined,
      attachments: object,
      reactions: {
        key0: ['George', 'Jean-Philippe', 'Michael', 'Anas', 'Edmond'],
      },
      replyToId: 'https://croplands.org/app/a/confirm?t=',
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })

  test('test case 6', () => {
    const result: any = chat.conversationMessageIsNotice({
      id: '',
      conversationId: '',
      from: '',
      type: 'number',
      at: NaN,
      body: undefined,
      glyph: undefined,
      attachments: [],
      reactions: { key0: [], key2: [], key1: [] },
      replyToId: undefined,
      members: undefined,
    })
    expect(result).toMatchSnapshot()
  })
})
