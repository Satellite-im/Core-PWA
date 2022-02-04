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
    const fsToImport = new Bucket(new FileSystem())

    fsToImport.fileSystem.addChild(file)
    fsToImport.fileSystem.createDirectory('dir')
    fsToImport.fileSystem.openDirectory('dir')
    fsToImport.fileSystem.addChild(file2)

    // need to place in variable or it returns empty after the first time
    const ex: FileSystemExport = fsToImport.index

    bucket.updateIndex(ex)
    expect(bucket.index).toEqual(ex)
  })
})
