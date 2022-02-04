import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { Bucket } from '../remote/textile/Bucket'

const mockFileData = {
  _name: 'TestFile.png',
  _descrption: 'Test file description',
  hash: '0x0aef',
}

const file = new Fil(...Object.values(mockFileData))
const file2 = new Fil(
  ...Object.values({ name: 'testPng2.png', ...mockFileData }),
)

describe('Test FileSystem Directory', () => {
  it('Fetch fileSystem export and update Bucket index', () => {
    const bucket = new Bucket(new FileSystem())

    bucket.updateIndex(bucket.fileSystem.export)
    expect(bucket.index).toEqual(bucket.fileSystem.export)
  })

  it('Fetch index and import it into the fileSystem', () => {
    const bucket = new Bucket(new FileSystem())
    const fsImport = new FileSystem()

    console.log('og fs. expect empty\n', bucket.fileSystem.export)

    fsImport.addChild(file)
    fsImport.addChild(file2)
    fsImport.createDirectory('dir')
    fsImport.createDirectory('testChildDir')
    bucket.fileSystem.import(fsImport.copy.export)
    expect(bucket.fileSystem.export).toEqual(fsImport.export)
  })
})
