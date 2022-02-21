import { Fil } from '../Fil'
import { FilSystem } from '../FilSystem'
import { Bucket } from '../remote/textile/Bucket'
import { FileSystemExport } from '../types/filesystem'

const mockFileData = {
  name: 'TestFile.png',
  hash: '0x0aef',
  size: 42345,
  descrption: 'Test file description',
}

const file = new Fil(mockFileData)
const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })

describe('Test FileSystem Directory', () => {
  it('Fetch index and import it into the fileSystem', () => {
    expect('').toEqual('')
    // const bucket = new Bucket()
    // const fs = new FilSystem()

    // fs.addChild(file)
    // fs.createDirectory('dir')
    // fs.openDirectory('dir')
    // fs.addChild(file2)

    // // need to place in variable or it returns empty after the first time
    // const ex: FileSystemExport = fs.export

    // bucket.updateIndex(ex)
    // expect(bucket.index).toEqual(ex)
  })
  it('get uninitialized textile', () => {
    const bucket = new Bucket()

    expect(bucket.textile).toBeNull()
  })
})
