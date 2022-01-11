import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { DIRECTORY_TYPE } from '../types/directory'

const mockFileData = {
  name: 'TestFile.png',
  descrption: 'Test file description',
  hash: '0x0aef',
}
const mockDirectoryData = {
  name: 'Test Directory',
  type: DIRECTORY_TYPE.DEFAULT
}
const mockFileSystemData = {
  name: 'root',
}

describe('Test FileSystem', () => {
  const filesystem = new FileSystem()
  const file = new Fil(...Object.values(mockFileData))
  const directory = new Directory(...Object.values(mockDirectoryData))
  directory.addChild(file)
  filesystem.addChild(directory)

  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
  const newDirectory = filesystem.copyChild('Test Directory')
  if (newDirectory) {
    it(`Correctly rejects duplicate entries`, () =>
      expect(filesystem.addChild(newDirectory)).toBe(false))
  }

  it(`Correctly creates a new directory`, () =>
      expect(filesystem.createDirectory('test_dir_3')).not.toBe(null))
  it(`Correctly creates a new file`, () =>
    expect(filesystem.createFile('test_fil')).not.toBe(null))
  it(`Correctly deletes a directory`, () =>
    expect(filesystem.removeChild('test_dir_3')).toBe(true))
  it(`Correctly deletes a file`, () =>
    expect(filesystem.removeChild('test_fil')).toBe(true))

  it(`Correctly renames a child`, () => {
    filesystem.createFile('test_fil')
    filesystem.renameChild('test_fil', 'test_fil_rename')
    expect(filesystem.hasChild('test_fil')).toBe(false)
    expect(filesystem.hasChild('test_fil_rename')).toBe(true)
  })
})
