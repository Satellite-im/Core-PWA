export type Friends = {
  version: '0.1.0'
  name: 'friends'
  instructions: [
    {
      name: 'makeRequest'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'user1'
          type: 'publicKey'
        },
        {
          name: 'user2'
          type: 'publicKey'
        },
        {
          name: 'k'
          type: 'string'
        },
      ]
    },
    {
      name: 'acceptRequest'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
      ]
      args: [
        {
          name: 'k'
          type: 'string'
        },
      ]
    },
    {
      name: 'denyRequest'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
      ]
      args: []
    },
    {
      name: 'removeRequest'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
      ]
      args: []
    },
    {
      name: 'closeRequest'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
        {
          name: 'payer'
          isMut: true
          isSigner: false
        },
      ]
      args: []
    },
    {
      name: 'removeFriend'
      accounts: [
        {
          name: 'request'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'friendRequest'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'from'
            type: 'publicKey'
          },
          {
            name: 'status'
            type: {
              defined: 'Status'
            }
          },
          {
            name: 'to'
            type: 'publicKey'
          },
          {
            name: 'payer'
            type: 'publicKey'
          },
          {
            name: 'fromEncryptedKey'
            type: 'string'
          },
          {
            name: 'toEncryptedKey'
            type: 'string'
          },
        ]
      }
    },
  ]
  types: [
    {
      name: 'Status'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Uninitilized'
          },
          {
            name: 'Pending'
          },
          {
            name: 'Accepted'
          },
          {
            name: 'Denied'
          },
          {
            name: 'RemovedFriend'
          },
          {
            name: 'RequestRemoved'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'WrongRequestData'
      msg: "Addresses in request don't match user address"
    },
    {
      code: 6001
      name: 'NotPendingRequest'
      msg: 'Request is not pending'
    },
    {
      code: 6002
      name: 'NotFriends'
      msg: 'Accounts are not friends yet'
    },
    {
      code: 6003
      name: 'WrongPrivileges'
      msg: "User can't perform this action"
    },
    {
      code: 6004
      name: 'OrderMismatch'
      msg: 'User1 and user2 needs to be passed in order'
    },
    {
      code: 6005
      name: 'AlreadyFriends'
      msg: 'Users are already friends'
    },
    {
      code: 6006
      name: 'ExistentRequest'
      msg: 'Request already existent'
    },
    {
      code: 6007
      name: 'PayerMismatch'
      msg: 'Account was not created by provided user'
    },
    {
      code: 6008
      name: 'NotRemoved'
      msg: 'Request is not removed yet'
    },
    {
      code: 6009
      name: 'AlreadyRemoved'
      msg: 'Request is already removed'
    },
  ]
}

export const IDL: Friends = {
  version: '0.1.0',
  name: 'friends',
  instructions: [
    {
      name: 'makeRequest',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'user1',
          type: 'publicKey',
        },
        {
          name: 'user2',
          type: 'publicKey',
        },
        {
          name: 'k',
          type: 'string',
        },
      ],
    },
    {
      name: 'acceptRequest',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'k',
          type: 'string',
        },
      ],
    },
    {
      name: 'denyRequest',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'removeRequest',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'closeRequest',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'removeFriend',
      accounts: [
        {
          name: 'request',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'friendRequest',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'from',
            type: 'publicKey',
          },
          {
            name: 'status',
            type: {
              defined: 'Status',
            },
          },
          {
            name: 'to',
            type: 'publicKey',
          },
          {
            name: 'payer',
            type: 'publicKey',
          },
          {
            name: 'fromEncryptedKey',
            type: 'string',
          },
          {
            name: 'toEncryptedKey',
            type: 'string',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'Status',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitilized',
          },
          {
            name: 'Pending',
          },
          {
            name: 'Accepted',
          },
          {
            name: 'Denied',
          },
          {
            name: 'RemovedFriend',
          },
          {
            name: 'RequestRemoved',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'WrongRequestData',
      msg: "Addresses in request don't match user address",
    },
    {
      code: 6001,
      name: 'NotPendingRequest',
      msg: 'Request is not pending',
    },
    {
      code: 6002,
      name: 'NotFriends',
      msg: 'Accounts are not friends yet',
    },
    {
      code: 6003,
      name: 'WrongPrivileges',
      msg: "User can't perform this action",
    },
    {
      code: 6004,
      name: 'OrderMismatch',
      msg: 'User1 and user2 needs to be passed in order',
    },
    {
      code: 6005,
      name: 'AlreadyFriends',
      msg: 'Users are already friends',
    },
    {
      code: 6006,
      name: 'ExistentRequest',
      msg: 'Request already existent',
    },
    {
      code: 6007,
      name: 'PayerMismatch',
      msg: 'Account was not created by provided user',
    },
    {
      code: 6008,
      name: 'NotRemoved',
      msg: 'Request is not removed yet',
    },
    {
      code: 6009,
      name: 'AlreadyRemoved',
      msg: 'Request is already removed',
    },
  ],
}
