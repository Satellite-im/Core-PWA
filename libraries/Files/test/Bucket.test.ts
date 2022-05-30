import { Fil } from '../Fil'
import { FilSystem } from '../FilSystem'
import { PrivateBucket } from '../remote/textile/PrivateBucket'
import { DIRECTORY_TYPE } from '../types/directory'
import { FILESYSTEM_TYPE, PrivateBucketIndex } from '../types/filesystem'

const mockFileData = {
  name: 'TestFile.png',
  hash: '0x0aef',
  size: 42345,
  description: 'Test file description',
}

const mockDirectoryData = {
  name: 'dir',
  liked: false,
  shared: false,
  type: DIRECTORY_TYPE.DEFAULT,
}

const file = new Fil(mockFileData)
const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })

describe('Test FileSystem Directory', () => {
  it('export file system and update version number', () => {
    const fs = new FilSystem()

    fs.addChild(file)
    fs.createDirectory(mockDirectoryData)
    fs.openDirectory('dir')
    fs.addChild(file2)

    const ex: PrivateBucketIndex = fs.export

    expect(ex.version + 1).toEqual(fs.export.version)
  })
  it('get uninitialized index', () => {
    const initializationData = {
      identity: 'Identity',
      client: 'Client',
      users: 'Users',
      wallet: 'SolanaWallet',
    }
    const bucket = new PrivateBucket(initializationData)

    expect(bucket.index).toStrictEqual({
      type: FILESYSTEM_TYPE.DEFAULT,
      version: 1,
      content: [],
    })
  })
  it.skip('initialize bucket', async () => {
    const initializationData = {
      identity: {
        public: 'Identity',
      },
      client: 'Client',
      users: 'Users',
      wallet: 'SolanaWallet',
    }
    const bucket = new PrivateBucket(initializationData)
    try {
      await bucket.init('init')
    } catch (error) {
      // Currently throws error: Error: selected encoding not supported
      // eslint-disable-next-line no-console
      console.log(error)
    }
  })
})
