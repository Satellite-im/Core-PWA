import mutations from './mutations'
import InitialAccountsState from './state'
import { AccountsState, RegistrationStatus } from './types'
import { User } from 'libraries/Iridium/users/types'

describe('Test accounts/mutations', () => {
  let instance: any
  let localStateForUnitTest: AccountsState

  beforeEach(() => {
    instance = mutations
    localStateForUnitTest = InitialAccountsState()
  })

  it('should setPin', () => {
    instance.setPin(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pin: '123456',
    })
  })

  it('should setStorePin', () => {
    instance.setStorePin(localStateForUnitTest, false)

    expect(localStateForUnitTest).toMatchObject({
      storePin: false,
    })
  })

  it('should setRegistry', () => {
    localStateForUnitTest.registry = true
    instance.setRegistry(localStateForUnitTest, false)

    expect(localStateForUnitTest).toMatchObject({
      registry: false,
    })
  })

  it('should setPinHash', () => {
    instance.setPinHash(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pinHash: '123456',
    })
  })

  it('should lock', () => {
    instance.lock(localStateForUnitTest)

    expect(localStateForUnitTest).toMatchObject({
      locked: true,
    })
  })

  it('should unlock', () => {
    instance.unlock(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      locked: false,
      pin: '123456',
    })
  })

  it('should setEncryptedPhrase', () => {
    instance.setEncryptedPhrase(localStateForUnitTest, 'baa baa black sheep')

    expect(localStateForUnitTest).toMatchObject({
      encryptedPhrase: 'baa baa black sheep',
    })
  })

  it('should setPhrase', () => {
    instance.setPhrase(localStateForUnitTest, 'moo moo white cow')

    expect(localStateForUnitTest).toMatchObject({
      phrase: 'moo moo white cow',
    })
  })

  it('should setActiveAccount', () => {
    instance.setActiveAccount(localStateForUnitTest, 'aktif')

    expect(localStateForUnitTest).toMatchObject({
      active: 'aktif',
    })
  })

  it('should setProfilePicture', () => {
    instance.setProfilePicture(
      localStateForUnitTest,
      'https://satellite.im/images/logo.webp',
    )

    expect(localStateForUnitTest).toMatchSnapshot()
  })
})
