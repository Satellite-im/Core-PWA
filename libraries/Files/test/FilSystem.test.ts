import { v4 as uuidv4 } from 'uuid'
import { Directory } from '../Directory'
import { FileSystemErrors } from '../errors/Errors'
import { Fil } from '../Fil'
import { FilSystem } from '../FilSystem'
import { DIRECTORY_TYPE } from '../types/directory'
import { FILESYSTEM_TYPE } from '../types/filesystem'

Date.now = jest.fn(() => 1645617999076)
jest.mock('uuid')
uuidv4.mockImplementation(() => 'testid')

const mockFileData = {
  name: 'TestFile.png',
  hash: '0x0aef',
  size: 4337487,
  description: 'Test file description',
}

const mockDirectoryData = {
  name: 'Test Directory',
  type: DIRECTORY_TYPE.DEFAULT,
}

const mockFileSystemData = {
  name: 'root',
}

describe('Test FilSystem', () => {
  const filesystem = new FilSystem()
  const file = new Fil(mockFileData)
  const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
  const file3 = new Fil({ ...mockFileData, name: 'abc.png' })
  const file4 = new Fil({ ...mockFileData, name: 'cc123.png' })
  const directory = new Directory(mockDirectoryData)
  directory.addChild(file)
  filesystem.addChild(file)
  filesystem.addChild(directory)

  const testFile = new File(['hello'], 'test_fil.txt', {
    type: 'text/plain',
  })
  const testFileTwo = new File(['hello'], 'test_fil_two.txt', {
    type: 'text/plain',
  })
  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
  const newDirectory = filesystem.copyChild('Test Directory')
  const newDirectory2 = filesystem.createDirectory({ name: 'second dir' })
  if (newDirectory && newDirectory2) {
    newDirectory2.addChild(file)
    newDirectory2.addChild(file2)
    filesystem.openDirectory('second dir')
    filesystem.addChild(file3)
    filesystem.addChild(file4)
    filesystem.goBack()
    it(`Correctly rejects duplicate entries`, () => {
      try {
        filesystem.addChild(newDirectory)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', FileSystemErrors.DUPLICATE_NAME)
      }
    })
  }
  it(`Navigate to a directory`, () => {
    filesystem.createDirectory({ name: 'third dir' })
    const result = filesystem.goBackToDirectory('third dir')
    expect(result).toMatchSnapshot()
  })
  it(`Move item to a directory`, () => {
    filesystem.moveItemTo('test_fil_two.txt', 'third dir')
    expect(filesystem).toMatchSnapshot()
  })
  it(`Correctly returns filesystem parent`, () =>
    expect(filesystem.parent).toBe(null))
  it(`Correctly returns filesystem content`, () =>
    expect(filesystem.content).toMatchSnapshot())
  it(`Correctly returns filesystem totalSize`, () =>
    expect(filesystem.totalSize).toBe(17349948))
  it(`Correctly returns filesystem percentStorageUsed`, () =>
    expect(filesystem.percentStorageUsed).toBe(0.4337487))
  it(`Correctly exports filesystem`, () =>
    expect(filesystem.export).toMatchObject({
      version: 3,
      type: FILESYSTEM_TYPE.DEFAULT,
    }))
  it(`Correctly copies entire filesystem`, () =>
    expect(filesystem.copy).toMatchObject(mockFileSystemData))
  it(`Correctly creates a new directory`, () =>
    expect(filesystem.createDirectory({ name: 'test_dir_3' })).not.toBe(null))
  it(`Correctly creates a new file`, () =>
    expect(
      filesystem.createFile({
        name: testFile.name,
        size: testFile.size,
      }),
    ).not.toBe(null))
  it(`Correctly deletes a directory`, () =>
    expect(filesystem.removeChild('test_dir_3')).toBe(true))
  it(`Correctly deletes a file`, () =>
    expect(filesystem.removeChild('test_fil.txt')).toBe(true))
  it(`Correctly renames a child`, () => {
    filesystem.createFile({
      name: testFileTwo.name,
      size: testFileTwo.size,
    })
    filesystem.renameChild('test_fil_two.txt', 'test_fil_rename.txt')
    expect(filesystem.hasChild('test_fil_two.txt')).toBe(false)
    expect(filesystem.hasChild('test_fil_rename.txt')).toBe(true)
    filesystem.fuzzySearch('GENERIC')
  })
  it(`Correctly fails to rename a non-existent child`, () => {
    expect(filesystem.renameChild('abc', 'test_fil_rename')).toBe(null)
  })
  it(`Correctly fails to copy a non-existent child`, () => {
    expect(filesystem.copyChild('abc')).toBe(null)
  })
})
