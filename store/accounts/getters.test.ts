import { AccountsState, RegistrationStatus } from './types'
import * as getters from '~/store/accounts/getters'

describe('init', () => {
  let inst: any
  const state: AccountsState = {
    storePin: true,
    loading: true,
    locked: true,
    pin: 'pin',
    pinHash: 'pinHash',
    active: 'active',
    gasPrice: 'gasPrice',
    phrase: 'phrase',
    error: 'error',
    encryptedPhrase: 'encryptedPhrase',
    registered: true,
    registrationStatus: RegistrationStatus.UNKNOWN,
    lastVisited: 'lastVisited',
  }

  beforeEach(() => {
    inst = getters.default
  })

  it('should retrieve pin hash', () => {
    const result: any = inst.getPinHash(state)
    expect(result).toEqual(state.pinHash)
  })

  it('should retrieve encrypted phrase', () => {
    const result: any = inst.getEncryptedPhrase(state)
    expect(result).toEqual(state.encryptedPhrase)
  })

  it('should retrieve phrase', () => {
    const result: any = inst.getPhrase(state)
    expect(result).toEqual(state.phrase)
  })

  it('should retrieve registration status', () => {
    const result: any = inst.getRegistrationStatus(state)
    expect(result).toEqual(state.registrationStatus)
  })

  it('should check if account is active', () => {
    const result: any = inst.getActiveAccount(state)
    expect(result).toEqual(state.active)
  })
})
