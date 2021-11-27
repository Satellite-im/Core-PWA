import * as t from 'io-ts'

const isBase64 = (s: string) =>
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm.test(s)

interface Base64Brand {
  readonly Base64: unique symbol
}

const base64 = t.brand(
  t.string,
  (s: string): s is t.Branded<string, Base64Brand> => isBase64(s),
  'Base64'
)

export type Base64 = t.TypeOf<typeof base64>

export const rawMessage = t.intersection([
  t.type({
    id: t.string,
    body: base64,
    from: t.string,
    sent: t.number
  }),
  t.partial({ readAt: t.number })
])

export type RawMessage = t.TypeOf<typeof rawMessage>

export const decryptedMessage = t.intersection([
  t.type({
    id: t.string,
    body: t.string,
    from: t.string,
    sent: t.number
  }),
  t.partial({ readAt: t.number })
])

export const messageFromThread = t.intersection([
  t.type({
    _id: t.string,
    created_at: t.number,
    from: t.string,
    body: t.string,
    signature: t.string,
    to: t.string,
    _mod: t.number
  }),
  t.partial({ read_at: t.number })
])

const baseMessage = t.intersection([
  t.type({
    id: t.string,
    at: t.number,
    from: t.string,
    to: t.string
  }),
  t.partial({ readAt: t.number })
])

export const replyMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    repliedTo: t.string,
    type: t.literal('reply')
  })
])

export const reactionMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    reactedTo: t.string,
    type: t.literal('reaction')
  })
])

export const fileMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    type: t.literal('file')
  })
])

export const textMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    type: t.literal('text')
  })
])

export const mediaMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    type: t.literal('media')
  })
])

export const messageEncoder = t.union([
  replyMessage,
  reactionMessage,
  fileMessage,
  textMessage,
  mediaMessage
])
