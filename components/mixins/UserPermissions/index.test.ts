import * as index from '~/components/mixins/UserPermissions/index'

describe('index.UserPermissions.created', () => {
  test('0', () => {
    const localSpy = jest.spyOn(index.UserPermissions, 'created')
    const result: any = index.UserPermissions.created()

    expect(localSpy).toHaveBeenCalled()
    expect(result).toBe(undefined)
  })
})
describe('index.UserPermissions.methods.getUserPermissions', () => {
  test('0', async () => {
    await index.UserPermissions.methods.getUserPermissions()
  })
})
describe('index.UserPermissions.methods.requestUserPermissions', () => {
  test('0', async () => {
    const mockObj = { a: 'b' }
    window.navigator = jest.fn()
    window.navigator.mediaDevices = jest.fn()
    window.navigator.mediaDevices.getUserMedia = jest
      .fn()
      .mockReturnValueOnce(mockObj)

    const result = await index.UserPermissions.methods.requestUserPermissions({
      audio: true,
      peerIdentity: 'identity',
      preferCurrentTab: true,
      video: false,
    })

    expect(result).toMatchObject(mockObj)
  })
})
describe('index.exportForTesting.formatDevices', () => {
  test('0', async () => {
    const devices = [
      {
        label: 'videoinput: FaceTime HD Camera (Built-in) ',
        deviceId: 'id=csO9c0YpAf274OuCPUA53CNE0YHlIr2yXCi+SqfBZZ8=',
      },
      {
        label: 'audioinput: default (Built-in Microphone) ',
        deviceId: 'id=RKxXByjnabbADGQNNZqLVLdmXlS0YkETYCIbg+XxnvM=',
      },
      {
        label: 'audioinput: Built-in Microphone ',
        deviceId: 'id=r2/xw1xUPIyZunfV1lGrKOma5wTOvCkWfZ368XCndm0=',
      },
    ]

    const result = await index.exportForTesting.formatDevices(devices)

    expect(result).toMatchSnapshot()
  })
})

describe('index.UserPermissions.created', () => {
  test('0', () => {
    const localSpy = jest.spyOn(index.UserPermissions, 'created')
    const result: any = index.UserPermissions.created()

    expect(localSpy).toHaveBeenCalled()
    expect(result).toBe(undefined)
  })
})

describe('index.UserPermissions.methods.requestUserPermissions', () => {
  test('0', async () => {
    await index.UserPermissions.methods.requestUserPermissions('user_name')
  })

  test('1', async () => {
    await index.UserPermissions.methods.requestUserPermissions('user name')
  })

  test('2', async () => {
    await index.UserPermissions.methods.requestUserPermissions('123')
  })

  test('3', async () => {
    await index.UserPermissions.methods.requestUserPermissions('username')
  })

  test('4', async () => {
    await index.UserPermissions.methods.requestUserPermissions('user-name')
  })

  test('5', async () => {
    await index.UserPermissions.methods.requestUserPermissions('')
  })
})

describe('index.UserPermissions.methods.getUserPermissions', () => {
  test('0', async () => {
    await index.UserPermissions.methods.getUserPermissions()
  })
})
