export enum PropCommonEnum {
  UPDATE = 'Update',
  NORMAL = 'Normal',
  DEFAULT = 'default',
  WAIT = 'wait',
  FULFILLED = 'fulfilled',
  CREATED_AT = 'created_at',
  MOD = '_mod',
  TYPING = 'TYPING',
  NOT_TYPING = 'NOT_TYPING',
}

export type PropCommon = keyof typeof PropCommonEnum
