export type Users = {
  version: '0.1.0'
  name: 'users'
  instructions: [
    {
      name: 'create'
      accounts: [
        {
          name: 'user'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
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
          name: 'name'
          type: 'string'
        },
        {
          name: 'photoHash'
          type: 'string'
        },
        {
          name: 'status'
          type: 'string'
        },
      ]
    },
    {
      name: 'setName'
      accounts: [
        {
          name: 'user'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
      ]
    },
    {
      name: 'setPhotoHash'
      accounts: [
        {
          name: 'user'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
      ]
      args: [
        {
          name: 'photoHash'
          type: 'string'
        },
      ]
    },
    {
      name: 'setStatus'
      accounts: [
        {
          name: 'user'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
      ]
      args: [
        {
          name: 'status'
          type: 'string'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'user'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'photoHash'
            type: 'string'
          },
          {
            name: 'status'
            type: 'string'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'WrongPrivileges'
      msg: 'User cannot perform this action'
    },
    {
      code: 6001
      name: 'PayerMismatch'
      msg: 'Account was not created by provided user'
    },
  ]
}

export const IDL: Users = {
  version: '0.1.0',
  name: 'users',
  instructions: [
    {
      name: 'create',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
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
          name: 'name',
          type: 'string',
        },
        {
          name: 'photoHash',
          type: 'string',
        },
        {
          name: 'status',
          type: 'string',
        },
      ],
    },
    {
      name: 'setName',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    },
    {
      name: 'setPhotoHash',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'photoHash',
          type: 'string',
        },
      ],
    },
    {
      name: 'setStatus',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'status',
          type: 'string',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'user',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'photoHash',
            type: 'string',
          },
          {
            name: 'status',
            type: 'string',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'WrongPrivileges',
      msg: 'User cannot perform this action',
    },
    {
      code: 6001,
      name: 'PayerMismatch',
      msg: 'Account was not created by provided user',
    },
  ],
}
