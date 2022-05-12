import * as mutations from '~/store/conversation/mutations'

describe('mutations.default.setConversation', () => {
  test('0', () => {
    const result: any = mutations.default.setConversation(
      { calling: 'error\n', participants: 'DELETE FROM ' },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        type: 'array',
        calling: 'ValueError',
        participants: 'SELECT * FROM %s LIMIT 1',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setConversation(
      { calling: 'Message box: foo; bar\n', participants: 'DELETE FROM ' },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        type: 'object',
        calling: 'too many arguments',
        participants: 'SELECT DISTINCT IDENTITY_VAL_LOCAL() FROM %s;',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setConversation(
      { calling: 'too many arguments', participants: 'SELECT * FROM %s;' },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        type: 'object',
        calling: 'Message box: foo; bar\n',
        participants: 'INSERT INTO ',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setConversation(
      { calling: 'error\n', participants: 'SELECT COUNT(*) FROM %s' },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        type: 'number',
        calling: 'ValueError',
        participants: 'SELECT * FROM %s;',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setConversation(
      {
        calling: 'Message box: foo; bar\n',
        participants: 'DELETE FROM %s WHERE expires < %%s',
      },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        type: 'array',
        calling: 'multiple errors occurred',
        participants: 'SELECT COUNT(*) FROM %s',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setConversation(
      { calling: '', participants: '' },
      { id: '', type: '', calling: '', participants: '' },
    )
    expect(result).toMatchSnapshot()
  })
})
