import * as t from 'io-ts'
import { WireMessageTypes } from './types'

const wireBaseMessage = t.type({
  type: t.string,
  payload: t.unknown,
  sentAt: t.number,
})

export const wireIdentificationMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal(WireMessageTypes.IDENTIFICATION),
    payload: t.type({
      peerId: t.string,
    }),
  }),
])

export const wireDataMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal(WireMessageTypes.DATA),
  }),
])

export const wireStartCallMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal(WireMessageTypes.START_CALL),
  }),
])

export const wireAnswerCallMessage = t.intersection([
  wireBaseMessage,
  t.type({
    type: t.literal(WireMessageTypes.ANSWER_CALL),
  }),
])
