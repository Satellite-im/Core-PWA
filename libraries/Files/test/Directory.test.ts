import { v4 as uuidv4 } from 'uuid'
import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { DIRECTORY_TYPE } from '../types/directory'
import { FileSystemErrors } from '../errors/Errors'
import { FileSortEnum } from '~/libraries/Enums/enums'

Date.now = jest.fn(() => 1645617999076)
const dateNow = Date.now()
jest.mock('uuid')
uuidv4.mockImplementation(() => 'testid')

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
    expect(topLevelDirectory.size).toEqual(0)
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

  it('Correctly retrieves imported modified value', () => {
    const mockDirTwo = {
      name: 'Test Directory',
      liked: false,
      shared: false,
      type: DIRECTORY_TYPE.DEFAULT,
      modified: 1647250139467,
    }
    const directoryTwo = new Directory(mockDirTwo)
    expect(directoryTwo.modified).toEqual(1647250139467)
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
  it('Correctly sorts directory by size and ascending', () => {
    directory.addChild(
      new Fil({
        name: 'TestFile.png',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'TestFile2.png',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.SIZE,
      asc: true,
    })
    expect(result).toMatchSnapshot()
  })
  it('Correctly sorts directory by modified and ascending', () => {
    directory.addChild(
      new Fil({
        name: 'file1.jpg',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'file2.heic',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.MODIFIED,
      asc: true,
    })
    expect(result).toMatchSnapshot()
  })
  it('Correctly sorts directory by type and ascending', () => {
    directory.addChild(
      new Fil({
        name: 'file1.png',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'file2.png',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.TYPE,
      asc: true,
    })
    expect(result).toMatchSnapshot()
  })
  it('Correctly sorts directory by size and descending', () => {
    directory.addChild(
      new Fil({
        name: 'TestFile3.png',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'TestFile4.png',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.SIZE,
      asc: false,
    })
    expect(result).toMatchSnapshot()
  })
  it('Correctly sorts directory by modified and ascending', () => {
    directory.addChild(
      new Fil({
        name: 'file3.jpg',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'file4.heic',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.MODIFIED,
      asc: false,
    })
    expect(result).toMatchSnapshot()
  })
  it('Correctly sorts directory by type and ascending', () => {
    directory.addChild(
      new Fil({
        name: 'file3.png',
        hash: '0x0aef',
        size: 4234,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    directory.addChild(
      new Fil({
        name: 'file4.png',
        hash: '0x0aed',
        size: 4235,
        liked: false,
        shared: false,
        description: 'Test file description',
      }),
    )
    const result: any = directory.sortedContent({
      category: FileSortEnum.TYPE,
      asc: false,
    })
    expect(result).toMatchSnapshot()
  })
})
