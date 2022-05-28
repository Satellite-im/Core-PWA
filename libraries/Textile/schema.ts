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

export const metadataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Metadata',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    created_at: { type: 'number' },
    key: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    body: { type: 'string' },
    _mod: { type: 'number' },
  },
}

export const userinfoSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Userinfo',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userAddress: { type: 'string' },
    consentToScan: { type: 'boolean' },
    consentDate: { type: 'number' },
    blockNsfw: { type: 'boolean' },
    filesVersion: { type: 'number' },
  },
}

export const notificationSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Notification',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    created_at: { type: 'number' },
    key: { type: 'string' },
    userId: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    body: { type: 'string' },
    _mod: { type: 'number' },
    read_at: { type: 'number' },
  },
}
