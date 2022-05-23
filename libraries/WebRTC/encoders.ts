import * as t from 'io-ts'

export const wireBaseMessage = t.type({
  type: t.string,
  payload: t.unknown,
  sentAt: t.number,
})

export const wireIdentificationMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal('IDENTIFICATION'),
    payload: t.type({
      peerId: t.string,
    }),
  }),
])

export const wireDataMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal('DATA'),
  }),
])

export const wireSignalMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal('SIGNAL'),
    payload: t.type({
      peerId: t.string,
      data: t.type({
        type: t.string,
        transceiverRequest: t.type({
          kind: t.string,
          init: t.type({
            sdp: t.string,
          }),
        }),
        renegotiate: t.boolean,
        candidate: t.unknown,
      }),
    }),
  }),
])

export const wireRefuseConnectionMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal('REFUSE'),
    payload: t.type({
      peerId: t.string,
    }),
  }),
])

export const KeyboardStates = t.union([
  t.literal('TYPING'),
  t.literal('NOT_TYPING'),
])

export const wireKeyboardState = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal('TYPING_STATE'),
    payload: t.type({
      state: KeyboardStates,
    }),
  }),
])
