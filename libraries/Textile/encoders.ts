import * as t from 'io-ts'

const isBase64 = (s: string) =>
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm.test(s)

interface Base64Brand {
  readonly Base64: unique symbol
}

const base64 = t.brand(
  t.string,
  (s: string): s is t.Branded<string, Base64Brand> => isBase64(s),
  'Base64',
)

export type Base64 = t.TypeOf<typeof base64>

export const rawMessage = t.intersection([
  t.type({
    id: t.string,
    body: base64,
    from: t.string,
    sent: t.number,
  }),
  t.partial({ readAt: t.number }),
])

export type RawMessage = t.TypeOf<typeof rawMessage>

export const decryptedMessage = t.intersection([
  t.type({
    id: t.string,
    body: t.string,
    from: t.string,
    sent: t.number,
  }),
  t.partial({ readAt: t.number }),
])

export const messageFromThread = t.intersection([
  t.type({
    _id: t.string,
    created_at: t.number,
    from: t.string,
    body: t.string,
    signature: t.string,
    to: t.string,
  }),
  t.partial({ _mod: t.number }),
  t.partial({ read_at: t.number }),
])

const baseMessage = t.intersection([
  t.type({
    id: t.string,
    at: t.number,
    from: t.string,
    to: t.string,
  }),
  t.partial({ readAt: t.number }),
  t.partial({ editedAt: t.number }),
  t.partial({ editingAt: t.number }),
])

export const reactionMessage = t.intersection([
  baseMessage,
  t.type({
    payload: t.string,
    reactedTo: t.string,
    type: t.literal('reaction'),
  }),
])

const fileMessagePayload = t.type({
  payload: t.type({
    url: t.string,
    name: t.string,
    size: t.number,
    type: t.string,
    id: t.string,
    nsfw: t.boolean,
  }),
})

export const fileMessage = t.intersection([
  baseMessage,
  fileMessagePayload,
  t.type({
    type: t.literal('file'),
  }),
])

const textMessagePayload = t.type({
  payload: t.string,
})

export const textMessage = t.intersection([
  baseMessage,
  textMessagePayload,
  t.type({
    type: t.literal('text'),
  }),
])

const mediaMessagePayload = t.type({
  payload: t.string,
})

export const mediaMessage = t.intersection([
  baseMessage,
  mediaMessagePayload,
  t.type({
    type: t.literal('media'),
  }),
])

const glyphMessagePayload = t.type({
  payload: t.string,
  pack: t.string,
})

export const glyphMessage = t.intersection([
  baseMessage,
  glyphMessagePayload,
  t.type({
    type: t.literal('glyph'),
  }),
])

export const replyMessage = t.union([
  t.intersection([
    baseMessage,
    textMessagePayload,
    t.type({
      repliedTo: t.string,
      replyType: t.literal('text'),
      type: t.literal('reply'),
    }),
  ]),
  t.intersection([
    baseMessage,
    fileMessagePayload,
    t.type({
      repliedTo: t.string,
      replyType: t.literal('file'),
      type: t.literal('reply'),
    }),
  ]),
  t.intersection([
    baseMessage,
    mediaMessagePayload,
    t.type({
      repliedTo: t.string,
      replyType: t.literal('media'),
      type: t.literal('reply'),
    }),
  ]),
])

export const messageEncoder = t.union([
  replyMessage,
  reactionMessage,
  fileMessage,
  textMessage,
  mediaMessage,
  glyphMessage,
])

export const exportedForTesting = {
  isBase64,
  base64,
}
