export type Groupchats = {
  version: '0.1.0'
  name: 'groupchats'
  instructions: [
    {
      name: 'create'
      accounts: [
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
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
          name: 'groupHash'
          type: {
            array: ['u8', 32]
          }
        },
        {
          name: 'groupId'
          type: 'string'
        },
        {
          name: 'openInvites'
          type: 'bool'
        },
      ]
    },
    {
      name: 'invite'
      accounts: [
        {
          name: 'newInvitation'
          isMut: true
          isSigner: false
        },
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
          isMut: false
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
          name: 'groupId'
          type: 'string'
        },
        {
          name: 'recipient'
          type: 'publicKey'
        },
      ]
    },
    {
      name: 'modify'
      accounts: [
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'successor'
          isMut: false
          isSigner: false
        },
        {
          name: 'admin'
          isMut: false
          isSigner: true
        },
      ]
      args: [
        {
          name: 'openInvites'
          type: 'bool'
        },
      ]
    },
    {
      name: 'leave'
      accounts: [
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'invitationSender'
          isMut: true
          isSigner: false
        },
      ]
      args: []
    },
    {
      name: 'adminLeave'
      accounts: [
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
          isMut: true
          isSigner: false
        },
        {
          name: 'successor'
          isMut: false
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'invitationSender'
          isMut: true
          isSigner: false
        },
      ]
      args: []
    },
    {
      name: 'close'
      accounts: [
        {
          name: 'group'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: false
          isSigner: true
        },
        {
          name: 'creator'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitationSender'
          isMut: true
          isSigner: false
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'group'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'creator'
            type: 'publicKey'
          },
          {
            name: 'admin'
            type: 'publicKey'
          },
          {
            name: 'openInvites'
            type: 'bool'
          },
          {
            name: 'members'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'invitation'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'sender'
            type: 'publicKey'
          },
          {
            name: 'groupKey'
            type: 'publicKey'
          },
          {
            name: 'recipient'
            type: 'publicKey'
          },
          {
            name: 'groupId'
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
      name: 'InvitationMismatch'
      msg: 'Invite does not match Group ID'
    },
    {
      code: 6002
      name: 'PayerMismatch'
      msg: 'Account was not created by provided user'
    },
    {
      code: 6003
      name: 'NotEmpty'
      msg: 'Group not empty'
    },
  ]
}

export const IDL: Groupchats = {
  version: '0.1.0',
  name: 'groupchats',
  instructions: [
    {
      name: 'create',
      accounts: [
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
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
          name: 'groupHash',
          type: {
            array: ['u8', 32],
          },
        },
        {
          name: 'groupId',
          type: 'string',
        },
        {
          name: 'openInvites',
          type: 'bool',
        },
      ],
    },
    {
      name: 'invite',
      accounts: [
        {
          name: 'newInvitation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
          isMut: false,
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
          name: 'groupId',
          type: 'string',
        },
        {
          name: 'recipient',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'modify',
      accounts: [
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'successor',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'openInvites',
          type: 'bool',
        },
      ],
    },
    {
      name: 'leave',
      accounts: [
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'invitationSender',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'adminLeave',
      accounts: [
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'successor',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'invitationSender',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'close',
      accounts: [
        {
          name: 'group',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitationSender',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'group',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'creator',
            type: 'publicKey',
          },
          {
            name: 'admin',
            type: 'publicKey',
          },
          {
            name: 'openInvites',
            type: 'bool',
          },
          {
            name: 'members',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'invitation',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'sender',
            type: 'publicKey',
          },
          {
            name: 'groupKey',
            type: 'publicKey',
          },
          {
            name: 'recipient',
            type: 'publicKey',
          },
          {
            name: 'groupId',
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
      name: 'InvitationMismatch',
      msg: 'Invite does not match Group ID',
    },
    {
      code: 6002,
      name: 'PayerMismatch',
      msg: 'Account was not created by provided user',
    },
    {
      code: 6003,
      name: 'NotEmpty',
      msg: 'Group not empty',
    },
  ],
}
