export enum PropCommonEnum {
    UPDATE = "Update",
    NORMAL = "Normal",
    DEFAULT = "default",
    WAIT = "wait",
    FULFILLED = "fulfilled",
    CREATED_AT = "created_at",
}

export type PropCommon  = keyof typeof PropCommonEnum
