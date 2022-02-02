export const groupChatSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Message',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    at: { type: 'number' },
    pinned: { type: 'boolean' },
    payload: { type: 'string' },
  },
}
