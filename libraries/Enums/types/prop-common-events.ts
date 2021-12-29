export enum PropCommonEnum {
  UPDATE = 'Update',
  NORMAL = 'Normal',
  DEFAULT = 'default',
  WAIT = 'wait',
  FULFILLED = 'fulfilled',
  CREATED_AT = 'created_at',
  TYPING = 'TYPING',
  NOT_TYPING = 'NOT_TYPING',
  MOD = '_mod',
}

export type PropCommon = keyof typeof PropCommonEnum
