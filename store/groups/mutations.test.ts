import * as mutations from '~/store/groups/mutations'

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

describe('mutations.default.setGroupMembersInfo', () => {
  test('0', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => 'Anas' } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => 'Anas' } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => 'Pierre Edouard' } },
      'bc23a9d531064583ace8f67dad60f6bb',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => 'Anas' } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => 'Pierre Edouard' } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setGroupMembersInfo(
      { all: { map: () => '' } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})
