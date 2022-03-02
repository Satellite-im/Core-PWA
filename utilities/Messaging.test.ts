import * as Messaging from '~/utilities/Messaging'
// dummy comment

describe('Messaging.refreshTimestampInterval', () => {
  test('0', () => {
    const result: any = Messaging.refreshTimestampInterval(
      -5.48,
      () => '{\n  "type": "RECEIVE_MESSAGE"\n}',
      100000,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Messaging.refreshTimestampInterval(
      -100,
      () => '{\n  "type": "ADD_TODO"\n}',
      1000,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Messaging.refreshTimestampInterval(
      -5.48,
      () => '{\n  "type": "RECEIVE_MESSAGE"\n}',
      3,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Messaging.refreshTimestampInterval(
      100,
      () => '{\n  "type": "RECEIVE_MESSAGE"\n}',
      2,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = Messaging.refreshTimestampInterval(
      -5.48,
      () => '{\n  "type": "RECEIVE_MESSAGE"\n}',
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = Messaging.refreshTimestampInterval(
      -Infinity,
      () => '',
      -Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})
