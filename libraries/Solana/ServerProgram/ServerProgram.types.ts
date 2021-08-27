export interface CreateDerivedAccountParams {
  createDerivedAccount: {
    [addressTypeValue: string]: number
  }
}
export interface InitializeDwellerParams {
  initializeDweller: {
    name: Buffer
    hash: Buffer
    status: Buffer
  }
}

export type ServerInstructionType =
  | CreateDerivedAccountParams
  | InitializeDwellerParams
