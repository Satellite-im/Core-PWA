import { PublicKey } from '@solana/web3.js'

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
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'encryptionKey'
          type: 'string'
        },
        {
          name: 'dbType'
          type: 'u8'
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
        {
          name: 'encryptionKey'
          type: 'string'
        },
        {
          name: 'dbType'
          type: 'u8'
        },
      ]
    },
    {
      name: 'modifySuccessor'
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
      args: []
    },
    {
      name: 'modifyOpenIvites'
      accounts: [
        {
          name: 'group'
          isMut: true
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
      name: 'modifyName'
      accounts: [
        {
          name: 'group'
          isMut: true
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
          name: 'name'
          type: 'string'
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
          {
            name: 'name'
            type: 'string'
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
          {
            name: 'encryptionKey'
            type: 'string'
          },
          {
            name: 'dbType'
            type: 'u8'
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
    {
      code: 6004
      name: 'IncorrectField'
      msg: 'The field is too short or too long'
    },
    {
      code: 6005
      name: 'InputError'
      msg: 'Parameters order mismatch'
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
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'encryptionKey',
          type: 'string',
        },
        {
          name: 'dbType',
          type: 'u8',
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
        {
          name: 'encryptionKey',
          type: 'string',
        },
        {
          name: 'dbType',
          type: 'u8',
        },
      ],
    },
    {
      name: 'modifySuccessor',
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
      args: [],
    },
    {
      name: 'modifyOpenIvites',
      accounts: [
        {
          name: 'group',
          isMut: true,
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
      name: 'modifyName',
      accounts: [
        {
          name: 'group',
          isMut: true,
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
          name: 'name',
          type: 'string',
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
          {
            name: 'name',
            type: 'string',
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
          {
            name: 'encryptionKey',
            type: 'string',
          },
          {
            name: 'dbType',
            type: 'u8',
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
    {
      code: 6004,
      name: 'IncorrectField',
      msg: 'The field is too short or too long',
    },
    {
      code: 6005,
      name: 'InputError',
      msg: 'Parameters order mismatch',
    },
  ],
}

export interface Invitation {
  sender: PublicKey
  groupKey: PublicKey
  recipient: PublicKey
  groupId: string
  encryptionKey: string
}

export interface InvitationAccount {
  publicKey: PublicKey
  account: Invitation
}

export interface RawGroup {
  name?: string
  admin: PublicKey
  creator: PublicKey
  members: number
  openInvites: boolean
}

export interface Group {
  id: string
  name?: string
  admin: string
  creator: string
  members: number
  openInvites: boolean
  encryptionKey: string
}

export interface InvitationAccountsFilter {
  recipient?: string | PublicKey
  sender?: string | PublicKey
  groupId?: string
  groupKey?: string | PublicKey
}

export type GroupEventsFilter = InvitationAccountsFilter

export enum GroupEvents {
  NEW_INVITATION,
}
