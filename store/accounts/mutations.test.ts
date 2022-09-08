import { AccountsState, RegistrationStatus } from './types'
import InitialAccountsState from './state'
import mutations from './mutations'
import { User } from 'libraries/Iridium/users/types'

describe('init', () => {
  let inst: any
  const state: AccountsState = {
    initialized: false,
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
    registry: true,
    details: {
      name: '',
      address: '',
      peerId: '',
      status: '',
      state: 'idle',
      unreadCount: 123,
      profilePicture: '',
      badge: 'community',
      userAccount: '',
      mailboxId: '',
      textilePubkey: '',
      lastUpdate: 1643889423133,
    },
    registrationStatus: RegistrationStatus.UNKNOWN,
    lastVisited: 'lastVisited',
  }

  beforeEach(() => {
    inst = mutations
  })

  it('should setPin', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setPin(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pin: '123456',
    })
  })

  it('should setStorePin', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setStorePin(localStateForUnitTest, false)

    expect(localStateForUnitTest).toMatchObject({
      storePin: false,
    })
  })

  it('should setRegistry', () => {
    const localStateForUnitTest = InitialAccountsState()
    localStateForUnitTest.registry = true
    inst.setRegistry(localStateForUnitTest, false)

    expect(localStateForUnitTest).toMatchObject({
      registry: false,
    })
  })

  it('should setPinHash', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setPinHash(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pinHash: '123456',
    })
  })

  it('should lock', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.lock(localStateForUnitTest)

    expect(localStateForUnitTest).toMatchObject({
      locked: true,
    })
  })

  it('should unlock', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.unlock(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      locked: false,
      pin: '123456',
    })
  })

  it('should setEncryptedPhrase', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setEncryptedPhrase(localStateForUnitTest, 'baa baa black sheep')

    expect(localStateForUnitTest).toMatchObject({
      encryptedPhrase: 'baa baa black sheep',
    })
  })

  it('should setPhrase', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setPhrase(localStateForUnitTest, 'moo moo white cow')

    expect(localStateForUnitTest).toMatchObject({
      phrase: 'moo moo white cow',
    })
  })

  it('should setActiveAccount', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setActiveAccount(localStateForUnitTest, 'aktif')

    expect(localStateForUnitTest).toMatchObject({
      active: 'aktif',
    })
  })

  it.skip('should setProfilePicture', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setProfilePicture(
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
    const localStateForUnitTest = InitialAccountsState()
    localStateForUnitTest.details = undefined
    inst.setProfilePicture(
      localStateForUnitTest,
      'https://satellite.im/images/logo.webp',
    )

    expect(localStateForUnitTest).toMatchObject({
      details: undefined,
    })
  })

  it.skip('should setUserDetails', () => {
    const localStateForUnitTest = InitialAccountsState()
    const newDetails = {
      username: 'username',
      status: 'status',
      photoHash: 'link',
      address: localStateForUnitTest.active,
    }
    inst.setUserDetails(localStateForUnitTest, newDetails)

    expect(localStateForUnitTest).toMatchObject({
      details: {
        name: newDetails.username,
        status: newDetails.status,
        profilePicture: newDetails.photoHash,
        address: localStateForUnitTest.active,
      },
    })
  })

  it('should setUserPeerId', () => {
    const localStateForUnitTest = { ...state }
    inst.setUserPeerId(localStateForUnitTest, 'peerId')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        peerId: 'peerId',
      },
    })
  })

  it('should setUserPeerId without state.details', () => {
    const localStateForUnitTest = InitialAccountsState()
    localStateForUnitTest.details = undefined
    inst.setUserPeerId(localStateForUnitTest, 'peerId')

    expect(localStateForUnitTest).toMatchObject({
      details: undefined,
    })
  })

  it.skip('should updateMailboxId', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.updateMailboxId(localStateForUnitTest, 'mailbox')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        mailboxId: 'mailbox',
      },
    })
  })

  it('should setRegistrationStatus', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setRegistrationStatus(
      localStateForUnitTest,
      RegistrationStatus.IN_PROGRESS,
    )

    expect(localStateForUnitTest).toMatchObject({
      registrationStatus: RegistrationStatus.IN_PROGRESS,
    })
  })

  it('should setLastVisited', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })

  it('should setLastVisited', () => {
    const localStateForUnitTest = InitialAccountsState()
    inst.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })

  it('should setAdapter', () => {
    const localStateForUnitTest = InitialAccountsState()
    const argument = 'adapter'
    inst.setAdapter(localStateForUnitTest, argument)

    expect(localStateForUnitTest).toMatchObject({
      adapter: argument,
    })
  })

  it('should setEntropy', () => {
    const localStateForUnitTest = InitialAccountsState()
    const argument = 'message'
    inst.setEntropy(localStateForUnitTest, argument)

    expect(localStateForUnitTest).toMatchObject({
      entropyMessage: argument,
    })
  })

  it('should setUserDetails', () => {
    const localStateForUnitTest = InitialAccountsState()
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
    inst.setUserDetails(localStateForUnitTest, argument)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: argument.photoHash,
    })
  })

  it('should setProfilePicture', () => {
    const localStateForUnitTest = InitialAccountsState()
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
    inst.setUserDetails(localStateForUnitTest, argument)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: argument.photoHash,
    })

    const newPhotoHash = 'hash'

    inst.setProfilePicture(localStateForUnitTest, newPhotoHash)

    expect(localStateForUnitTest.details).toMatchObject({
      did: argument.did,
      name: argument.name,
      status: argument.status,
      photoHash: newPhotoHash,
    })
  })

  it('should setProfilePicture without user details', () => {
    const localStateForUnitTest = { ...state }

    const newPhotoHash = 'hash'

    inst.setProfilePicture(localStateForUnitTest, newPhotoHash)

    expect(localStateForUnitTest.details).toMatchObject({
      photoHash: newPhotoHash,
    })
  })
})
