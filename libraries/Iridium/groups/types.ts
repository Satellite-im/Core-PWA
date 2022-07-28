import { IridiumDocument } from '@satellite-im/iridium'
import Group from './Group'

export type GroupMemberDetails = {
  id: string
  name: string
  photoHash: string
}

export type GroupConfig = {
  name: string
  origin: string
  avatar?: string
  members: { [did: string]: GroupMemberDetails }
  metadata?: IridiumDocument
}

export type GroupData = GroupConfig & {
  id: string
}

export type GroupMap = { [key: string]: Group }

export type GroupManagerEvent =
  | 'group-created'
  | 'group-updated'
  | 'group-deleted'
  | 'group-member-added'
  | 'group-member-removed'
  | 'group-member-updated'
  | 'group-member-joined'
  | 'group-member-left'

export enum GroupsError {
  NETWORK_ERROR = 'errors.groups.network',
  NOT_A_MEMBER = 'errors.groups.not_a_member',
  GROUP_ALREADY_EXISTS = 'error.groups.group_already_exists',
  GROUP_NOT_FOUND = 'error.groups.group_not_found',
  GROUP_NOT_INITIALIZED = 'errors.groups.group_not_initialized',
  INVITE_ALREADY_SENT = 'errors.groups.request_already_sent',
  RECIPIENT_NOT_FOUND = 'errors.groups.recipient_not_found',
  USER_NOT_INITIALIZED = 'errors.groups.user_not_initialized',
}
