import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { DIRECTORY_TYPE } from '../types/directory'
import { FILESYSTEM_TYPE } from '../types/filesystem'

const mockFileData = {
  _name: 'TestFile.png',
  _descrption: 'Test file description',
  hash: '0x0aef',
}

const mockDirectoryData = {
  _name: 'Test Directory',
  _type: DIRECTORY_TYPE.DEFAULT,
}

const mockFileSystemData = {
  name: 'root',
}

describe('Test FileSystem', () => {
  const filesystem = new FileSystem()
  const file = new Fil(...Object.values(mockFileData))
  const file2 = new Fil(
    ...Object.values({ ...mockFileData, name: 'testPng2.png' }),
  )
  const file3 = new Fil(...Object.values({ ...mockFileData, name: 'abc.png' }))
  const file4 = new Fil(
    ...Object.values({ ...mockFileData, name: 'cc123.png' }),
  )
  const directory = new Directory(...Object.values(mockDirectoryData))
  directory.addChild(file)
  directory.addChild(file)
  filesystem.addChild(file)
  filesystem.addChild(directory)

  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
  const newDirectory = filesystem.copyChild('Test Directory')
  const newDirectory2 = filesystem.createDirectory('second dir')
  if (newDirectory && newDirectory2) {
    newDirectory2.addChild(file)
    newDirectory2.addChild(file2)
    console.log(newDirectory2.content)
    filesystem.openDirectory('second dir')
    filesystem.addChild(file3)
    filesystem.addChild(file4)
    filesystem.goBack()
    it(`Correctly rejects duplicate entries`, () =>
      expect(filesystem.addChild(newDirectory)).toBe(false))
  }
  it(`Correctly returns filesystem parent`, () =>
    expect(filesystem.parent).toBe(null))
  it(`Correctly exports filesystem`, () =>
    expect(filesystem.export).toMatchObject({
      version: 1,
      type: FILESYSTEM_TYPE.DEFAULT,
    }))
  it(`Correctly copies entire filesystem`, () =>
    expect(filesystem.copy).toMatchObject(mockFileSystemData))
  it(`Correctly creates a new directory`, () =>
    expect(filesystem.createDirectory('test_dir_3')).not.toBe(null))
  it(`Correctly creates a new file`, () =>
    expect(filesystem.createFile('test_fil')).not.toBe(null))
  it(`Correctly deletes a directory`, () =>
    expect(filesystem.removeChild('test_dir_3')).toBe(true))
  it(`Correctly deletes a file`, () =>
    expect(filesystem.removeChild('test_fil')).toBe(true))

  it(`Correctly renames a child`, () => {
    filesystem.createFile('test_fil', 'Blah blah blah', '0xef123')
    filesystem.renameChild('test_fil', 'test_fil_rename')
    expect(filesystem.hasChild('test_fil')).toBe(false)
    expect(filesystem.hasChild('test_fil_rename')).toBe(true)
    console.log(newDirectory2?.content)
    filesystem.fuzzySearch('generic')
  })
  it(`Correctly fails to rename a non-existent child`, () => {
    filesystem.createFile('test_fil0000', 'Blah blah blah', '0xef123')
    expect(filesystem.renameChild('abc', 'test_fil_rename')).toBe(null)
  })
  it(`Correctly fails to copy a non-existent child`, () => {
    filesystem.createFile('test_fil111copy', 'Blah blah blah', '0xef123')
    expect(filesystem.copyChild('abc')).toBe(null)
  })
})
