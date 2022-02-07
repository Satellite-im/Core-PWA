export const groupChatSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Message',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    created_at: { type: 'number' },
    from: { type: 'string' },
    body: { type: 'string' },
    signature: { type: 'string' },
    to: { type: 'string' },
    _mod: { type: 'number' },
    read_at: { type: 'number' },
  },
}
