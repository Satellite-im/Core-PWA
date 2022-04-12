import * as mutations from '~/store/friends/mutations'

describe('mutations.default.updateIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => 'George' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => 'Michael' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => 'George' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => 'Pierre Edouard' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.updateIncomingRequest(
      { incomingRequests: { map: () => '' } },
      { requestId: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.addIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => 16 } },
      'https://',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => 0 } },
      'https://croplands.org/app/a/reset?token=',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => 10 } },
      'https://twitter.com/path?abc',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => 256 } },
      'https://croplands.org/app/a/confirm?t=',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => 32 } },
      'http://www.croplands.org/account/confirm?t=',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.addIncomingRequest(
      { incomingRequests: { push: () => -Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.removeIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => true } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => true } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.updateOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Anas' } },
      { requestId: 'da7588892' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'George' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Michael' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.updateOutgoingRequest(
      { outgoingRequests: { map: () => '' } },
      { requestId: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.addOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => 256 } },
      400,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => 64 } },
      400,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => 0 } },
      500,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => 256 } },
      404,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => 32 } },
      404,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.addOutgoingRequest(
      { outgoingRequests: { push: () => Infinity } },
      Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.removeOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => false } },
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => false } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.addFriend', () => {
  test('0', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => 32 } },
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => 256 } },
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => 32 } },
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => 32 } },
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => 64 } },
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.addFriend(
      { all: { push: () => -Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setActive', () => {
  test('0', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => 'Pierre Edouard' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => 'George' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => 'Pierre Edouard' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => 'Edmond' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => 'Anas' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setActive(
      { all: { map: () => '' } },
      { address: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setStored', () => {
  test('0', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => 'Edmond' } },
      { address: '0.0.0.0' },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => 'Michael' } },
      { address: '192.168.1.5' },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '0.0.0.0' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => 'Edmond' } },
      { address: '192.168.1.5' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => 'Anas' } },
      { address: '192.168.1.5' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setStored(
      { all: { map: () => '' } },
      { address: '' },
      true,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setNote', () => {
  test('0', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => 'Michael' } },
      {
        address: '0.0.0.0',
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '192.168.1.5',
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        note: 'v4.0.0-rc.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '0.0.0.0',
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '192.168.1.5',
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => 'George' } },
      {
        address: '192.168.1.5',
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        note: '1.0.0',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setNote(
      { all: { map: () => '' } },
      { address: '', id: '', note: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.updateFriend', () => {
  test('0', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => 'Anas' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => 'Michael' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => 'Anas' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.updateFriend(
      { all: { map: () => '' } },
      { address: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.removeFriend', () => {
  test('0', () => {
    const result: any = mutations.default.removeFriend(
      { all: { filter: () => false } },
      '192.168.1.5',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.removeFriend(
      { all: { filter: () => false } },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.removeFriend(
      { all: { filter: () => true } },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.removeFriend(
      { all: { filter: () => true } },
      '192.168.1.5',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.removeFriend(
      { all: { filter: () => false } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.sortFriends', () => {
  test('0', () => {
    const object: any = [
      [true, false, true, false],
      [true, true, true, false],
      [true, true, true, false],
      [true, false, true, false],
    ]
    const result: any = mutations.default.sortFriends({ all: object }, [
      'https://api.telegram.org/',
      'https://api.telegram.org/',
      'www.google.com',
      'https://croplands.org/app/a/reset?token=',
    ])
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      [false, false, false, false],
      [true, false, true, false],
      [true, false, false, false],
      [false, false, false, true],
    ]
    const result: any = mutations.default.sortFriends({ all: object }, [
      'Www.GooGle.com',
      'https://',
      'www.google.com',
      '.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      [false, false, false, false],
      [true, true, false, false],
      [true, false, true, false],
      [true, false, false, true],
    ]
    const result: any = mutations.default.sortFriends({ all: object }, [
      'https://accounts.google.com/o/oauth2/revoke?token=%s',
      'www.google.com',
      'Www.GooGle.com',
      'Www.GooGle.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      [true, false, true, false],
      [false, false, true, true],
      [false, true, false, false],
      [true, true, true, false],
    ]
    const result: any = mutations.default.sortFriends({ all: object }, [
      'https://croplands.org/app/a/reset?token=',
      'http://base.com',
      'http://www.croplands.org/account/confirm?t=',
      'http://base.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      [false, false, false, true],
      [true, false, true, true],
      [false, true, true, false],
      [true, true, false, false],
    ]
    const result: any = mutations.default.sortFriends({ all: object }, [
      'https://',
      'https://api.telegram.org/bot',
      'https://croplands.org/app/a/confirm?t=',
      'www.google.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.sortFriends({ all: [] }, [])
    expect(result).toMatchSnapshot()
  })
})
