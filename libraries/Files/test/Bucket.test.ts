import { Fil } from '../Fil'
import { FilSystem } from '../FilSystem'
import { DIRECTORY_TYPE } from '../types/directory'
import { FileSystemExport } from '../types/filesystem'

const mockFileData = {
  name: 'TestFile.png',
  hash: '0x0aef',
  size: 42345,
  descrption: 'Test file description',
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

    const ex: FileSystemExport = fs.export

    expect(ex.version + 1).toEqual(fs.export.version)
  })
  // TODO: add test for Bucket
})
