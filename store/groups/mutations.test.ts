import { cloneDeep } from 'lodash'
import * as mutations from '~/store/groups/mutations'
import initialState from '~/store/groups/state'

describe('mutations.default.updateGroup', () => {
  test('0', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => 'Pierre Edouard' } },
      { id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => 'George' } },
      { id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => 'Jean-Philippe' } },
      { id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => 'Michael' } },
      { id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => 'Edmond' } },
      { id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.updateGroup(
      { all: { map: () => '' } },
      { id: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.addGroup', () => {
  test('0', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => 0 } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => 64 } },
      'bc23a9d531064583ace8f67dad60f6bb',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => 0 } },
      'bc23a9d531064583ace8f67dad60f6bb',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => 32 } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => 64 } },
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.addGroup(
      { all: { push: () => Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setGroupMembers', () => {
  const groupSample = {
    id: '',
    name: '',
    admin: '',
    creator: '',
    address: '',
    encryptionKey: '',
    openInvites: true,
    members: [],
    lastUpdate: 0,
    addresses: [],
  }
  const m1 = {
    groupId: 'groupId_0',
    members: [
      {
        address: 'address_0',
        name: 'name_0',
        photoHash: 'photoHash_0',
        status: '',
      },
    ],
  }
  const m2 = {
    groupId: 'groupId_1',
    members: [
      {
        address: 'address_1',
        name: 'name_1',
        photoHash: 'photoHash_1',
        status: '',
      },
    ],
  }
  const m3 = {
    groupId: 'groupId_0',
    members: [
      {
        address: 'address_2',
        name: 'name_2',
        photoHash: 'photoHash_2',
        status: '',
      },
    ],
  }

  const getState = () =>
    cloneDeep({
      ...initialState(),
      all: [
        {
          ...groupSample,
          id: 'groupId_0',
        },
        {
          ...groupSample,
          id: 'groupId_1',
        },
      ],
    })

  test('0', () => {
    const state = getState()
    mutations.default.setGroupMembers(state, m1)
    expect(state).toMatchSnapshot()
  })

  test('1', () => {
    const state = getState()
    mutations.default.setGroupMembers(state, m2)
    expect(state).toMatchSnapshot()
  })

  test('2', () => {
    const state = getState()
    mutations.default.setGroupMembers(state, m1)
    mutations.default.setGroupMembers(state, m3)
    expect(state).toMatchSnapshot()
  })

  test('3', () => {
    const state = getState()
    mutations.default.setGroupMembers(state, m1)
    mutations.default.setGroupMembers(state, m2)
    mutations.default.setGroupMembers(state, m3)
    expect(state).toMatchSnapshot()
  })
})
