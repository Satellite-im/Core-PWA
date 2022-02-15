import { Fil } from '../Fil'
import { FilSystem } from '../FilSystem'
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
  it('Fetch index and import it into the fileSystem', () => {
    const bucket = new Bucket()
    const fs = new FilSystem()

    fs.addChild(file)
    fs.createDirectory('dir')
    fs.openDirectory('dir')
    fs.addChild(file2)

    // need to place in variable or it returns empty after the first time
    const ex: FileSystemExport = fs.export

    bucket.updateIndex(ex)
    expect(bucket.index).toEqual(ex)
  })
})
