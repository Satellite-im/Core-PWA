type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null
type DeepOmitHelper<T, K extends keyof T> = {
  [P in K]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
    ? TP extends Primitive
      ? TP // leave primitives and functions alone
      : TP extends any[]
      ? DeepOmitArray<TP, K> // Array special handling
      : DeepOmit<TP, K>
    : never
}
export type DeepOmit<T, K> = T extends Primitive
  ? T
  : DeepOmitHelper<T, Exclude<keyof T, K>>

type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>
}
