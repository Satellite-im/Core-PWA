import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { Bucket } from '../remote/textile/Bucket'
import { FileSystemExport } from '../types/filesystem'

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

    fsImport.addChild(file)
    fsImport.createDirectory('dir')
    fsImport.openDirectory('dir')
    fsImport.addChild(file2)
    fsImport.goBack()
    const x: FileSystemExport = fsImport.export

    bucket.fileSystem.import(x)
    expect(bucket.fileSystem.export).toEqual(x)
  })
})
