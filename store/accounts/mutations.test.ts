import { AccountsState, RegistrationStatus } from './types'
import InitialAccountsState from './state'
import mutations from './mutations'
import { User } from 'libraries/Iridium/users/types'

describe('init', () => {
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

  it.skip('should setProfilePicture', () => {
    instance.setProfilePicture(
      localStateForUnitTest,
      'https://satellite.im/images/logo.webp',
    )

    expect(localStateForUnitTest).toMatchObject({
      details: {
        profilePicture: 'https://satellite.im/images/logo.webp',
      },
    })
  })

  it('should setProfilePicture without state.details', () => {
    localStateForUnitTest.details = undefined
    instance.setProfilePicture(
      localStateForUnitTest,
      'https://satellite.im/images/logo.webp',
    )

    expect(localStateForUnitTest).toMatchObject({
      details: undefined,
    })
  })

  it('should setUserPeerId without state.details', () => {
    localStateForUnitTest.details = undefined
    instance.setUserPeerId(localStateForUnitTest, 'peerId')

    expect(localStateForUnitTest).toMatchObject({
      details: undefined,
    })
  })

  it('should setUserPeerId', () => {
    localStateForUnitTest.details = { did: 'did', name: 'name' }
    instance.setUserPeerId(localStateForUnitTest, 'peerId')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        peerId: 'peerId',
      },
    })
  })

  it.skip('should updateMailboxId', () => {
    instance.updateMailboxId(localStateForUnitTest, 'mailbox')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        mailboxId: 'mailbox',
      },
    })
  })

  it('should setRegistrationStatus', () => {
    instance.setRegistrationStatus(
      localStateForUnitTest,
      RegistrationStatus.IN_PROGRESS,
    )

    expect(localStateForUnitTest).toMatchObject({
      registrationStatus: RegistrationStatus.IN_PROGRESS,
    })
  })

  it('should setLastVisited', () => {
    instance.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })

  it('should setLastVisited', () => {
    instance.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })

  it('should setAdapter', () => {
    const argument = 'adapter'
    instance.setAdapter(localStateForUnitTest, argument)

    expect(localStateForUnitTest).toMatchObject({
      adapter: argument,
    })
  })

  it('should setEntropy', () => {
    const argument = 'message'
    instance.setEntropy(localStateForUnitTest, argument)

    expect(localStateForUnitTest).toMatchObject({
      entropyMessage: argument,
    })
  })

  it('should setUserDetails', () => {
    const argument: User = {
      did: 'Sed libero possimus.',
      name: 'Nicole Brown',
      peerId:
        'Ut doloribus autem. Aut repellat maiores et perspiciatis illum dolorem ducimus quibusdam. Et omnis at excepturi. Vitae eum nulla. A in est nihil animi quae sint sit totam nostrum.\n \rHarum consequatur doloremque. Ullam molestiae voluptas. Odio qui ducimus consequatur nulla dolorem aspernatur nemo iusto. Saepe est veritatis ut ut pariatur numquam at placeat. Maxime quae odit corporis adipisci quas exercitationem.\n \rRem impedit voluptate culpa maxime. Ducimus dolore quasi ea vel beatae. Repellendus quod vel natus sint qui rerum qui reprehenderit. Quae omnis suscipit blanditiis minus dolorem architecto ex eius tempore. Sit quidem nemo quaerat.',
      seen: 90045,
      accountUrl:
        'Consequatur tempora doloremque consequatur cum corporis quia.\nAb velit sit aut adipisci.',
      about: 'At tenetur explicabo molestiae alias.',
    }
    instance.setUserDetails(localStateForUnitTest, argument)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: argument.photoHash,
    })
  })

  it('should setProfilePicture without user details', () => {
    localStateForUnitTest.details = undefined
    const newPhotoHash = 'hash'

    instance.setProfilePicture(localStateForUnitTest, newPhotoHash)

    expect(localStateForUnitTest.details).toBe(undefined) // Unchanged, as expected
  })

  it('should setProfilePicture', () => {
    const argument: User = {
      did: 'Sed libero possimus.',
      name: 'Nicole Brown',
      peerId:
        'Ut doloribus autem. Aut repellat maiores et perspiciatis illum dolorem ducimus quibusdam. Et omnis at excepturi. Vitae eum nulla. A in est nihil animi quae sint sit totam nostrum.\n \rHarum consequatur doloremque. Ullam molestiae voluptas. Odio qui ducimus consequatur nulla dolorem aspernatur nemo iusto. Saepe est veritatis ut ut pariatur numquam at placeat. Maxime quae odit corporis adipisci quas exercitationem.\n \rRem impedit voluptate culpa maxime. Ducimus dolore quasi ea vel beatae. Repellendus quod vel natus sint qui rerum qui reprehenderit. Quae omnis suscipit blanditiis minus dolorem architecto ex eius tempore. Sit quidem nemo quaerat.',
      seen: 90045,
      accountUrl:
        'Consequatur tempora doloremque consequatur cum corporis quia.\nAb velit sit aut adipisci.',
      about: 'At tenetur explicabo molestiae alias.',
    }

    // Set user details
    instance.setUserDetails(localStateForUnitTest, argument)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: argument.photoHash,
    })

    const newPhotoHash = 'hash'

    instance.setProfilePicture(localStateForUnitTest, newPhotoHash)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: newPhotoHash,
    })
  })
})
