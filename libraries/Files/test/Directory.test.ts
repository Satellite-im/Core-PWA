import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { DIRECTORY_TYPE } from '../types/directory'
import { FileSystemErrors } from '../errors/Errors'

Date.now = jest.fn(() => 1645617999076)
const dateNow = Date.now()

describe('Test FileSystem Directory', () => {
  const mockFileData = {
    name: 'TestFile.png',
    hash: '0x0aef',
    size: 4235,
    liked: false,
    shared: false,
    description: 'Test file description',
  }

  const mockDirectoryData = {
    name: 'Test Directory',
    liked: false,
    shared: false,
    type: DIRECTORY_TYPE.DEFAULT,
  }

  const file = new Fil(mockFileData)
  const directory = new Directory(mockDirectoryData)

  it('Correctly returns a directory name', () =>
    expect(directory.name).toEqual(mockDirectoryData.name))
  it('Correctly returns a directory type', () =>
    expect(directory.type).toEqual(mockDirectoryData.type))
  it('Correctly adds a child file or folder', () => {
    directory.addChild(file)
    expect(directory.hasChild(file.name)).toBe(true)
    const child = directory.getChild(file.name)
    expect(child.id).toEqual(file.id)
  })
  it('Correctly retrieves directory size after adding a child file/folder', () => {
    expect(directory.size).toEqual(4235)
  })
  it('Correctly retrieves directory last modified timestamp after adding a child file/folder', () => {
    expect(directory.modified).toEqual(dateNow)
  })
  it('Incorrectly adds duplicate file to directory', () => {
    try {
      directory.addChild(file)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.DUPLICATE_NAME)
    }
  })
  it('Incorrectly adds directory as a child of itself', () => {
    try {
      directory.addChild(directory)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.DIR_PARADOX)
    }
  })
  it("Incorrectly adds directory's ancestor as a child of itself", () => {
    const topLevelDirectory = new Directory({ name: 'level1' })
    const secondLevelDirectory = new Directory({ name: 'level2' })
    const thirdLevelDirectory = new Directory({ name: 'level3' })
    try {
      thirdLevelDirectory.addChild(topLevelDirectory)
      topLevelDirectory.addChild(secondLevelDirectory)
      secondLevelDirectory.addChild(thirdLevelDirectory)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        FileSystemErrors.DIR_PARENT_PARADOX,
      )
    }
  })
  it('Correctly displays content', () => {
    const content = directory.content
    expect(content).not.toEqual(null)
  })
  it('Correctly clones a folder', () => {
    const clone = directory.copy
    expect(clone.hasChild(file.name)).toBe(true)
  })
  it('Correctly removes a child file or folder', () => {
    directory.removeChild(file.name)
    expect(directory.hasChild(file.name)).toBe(false)

    const child = directory.getChild(file.name)
    expect(child).toBe(null)
  })
})
