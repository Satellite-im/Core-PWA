import * as Peer from './Peer'

describe('test alert methods', () => {
  const AlertsConstructor = new Peer.Peer('originator', 'identifier', 'channel')
  const inst = AlertsConstructor

  test('get identifier', () => {
    const result: any = inst.identifier
    expect(result).toEqual('identifier')
  })
  test('send', async () => {
    await inst.send('SIGNAL', 'a')
    inst.send = jest.fn()
    await inst.send('SIGNAL', 'b')
    expect(inst.send).toBeCalledTimes(1)
    expect(inst.send).toBeCalledWith('SIGNAL', 'b')
  })
})
