import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { DIRECTORY_TYPE } from '../types/directory'

describe('Test FileSystem Directory', () => {
  const mockFileData = {
    name: 'TestFile.png',
    descrption: 'Test file description',
    hash: '0x0aef',
  }

  const mockDirectoryData = {
    name: 'Test Directory',
    type: DIRECTORY_TYPE.DEFAULT
  }

  const file = new Fil(...Object.values(mockFileData))
  const directory = new Directory(...Object.values(mockDirectoryData))

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
