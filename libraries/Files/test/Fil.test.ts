import { Fil } from '../Fil'
import { FILE_TYPE } from '../types/file'
import { FileSystemErrors } from '../errors/Errors'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

describe('Test FileSystem File', () => {
  const mockFileData = {
    name: 'TestFile.png',
    id: '0x0aef',
    size: 455,
    description: 'Test file description',
  }

  const file = new Fil(mockFileData)

  it(`Correctly returns a file name (${mockFileData.name})`, () =>
    expect(file.name).toEqual(mockFileData.name))
  it(`Correctly returns a file description (${mockFileData.description})`, () =>
    expect(file.description).toEqual(mockFileData.description))
  it(`Correctly returns a file type (${FILE_TYPE.GENERIC})`, () =>
    expect(file.type).toEqual(FILE_TYPE.GENERIC))
  it(`Correctly returns a file id (${mockFileData.id})`, () =>
    expect(file.id).toEqual(mockFileData.id))
  it(`Correctly returns a file size (${mockFileData.size})`, () =>
    expect(file.size).toEqual(mockFileData.size))
  it(`Correctly returns a file path`, () =>
    expect(file.path).toEqual(mockFileData.name))
  it('Correctly clones a file', () => {
    const clonedFile: Fil = file.copy
    expect(clonedFile.size).toEqual(file.size)
    expect(clonedFile.id).not.toEqual(file.id)
  })
  it(`Correctly returns a file object`, () => {
    const clonedFile: Fil = file.copy
    expect(clonedFile.file).toEqual(file.file)
  })
  it(`Correctly returns a file url`, () => {
    const clonedFile: Fil = file.copy
    expect(clonedFile.url).toEqual(file.url)
  })
  it('Correctly sets a file description', () => {
    file.description = 'setter'
    expect(file.description).toEqual('setter')
  })
  it("Correctly sets a file's file", () => {
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    file.file = testFile
    expect(file.file).toEqual(testFile)
  })
  it('Correctly toggle like', () => {
    const mockFileData = {
      name: 'filename.png',
      id: '0x0cef',
      size: 455,
      description: 'Test file description',
    }

    const file = new Fil(mockFileData)
    expect(file.liked).toBeFalsy()
    file.toggleLiked()
    expect(file.liked).toBeTruthy()
  })
  it('Correctly share item', () => {
    const mockFileData = {
      name: 'filename.png',
      id: '0x0cef',
      size: 455,
      description: 'Test file description',
    }

    const file = new Fil(mockFileData)
    expect(file.shared).toBeFalsy()
    file.shareItem()
    expect(file.shared).toBeTruthy()
  })
  it('Returns error for LEADING_DOT file name', () => {
    const mockFileData = {
      name: '.',
      id: '0x0bef',
      size: 455,
      description: 'Test file description',
    }

    try {
      const file = new Fil(mockFileData)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.LEADING_DOT)
    }
  })
  it('Returns error for INVALID file name', () => {
    const mockFileData = {
      name: ':',
      id: '0x0bef',
      size: 455,
      description: 'Test file description',
    }

    try {
      const file = new Fil(mockFileData)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.INVALID)
    }
  })
  it('Returns error for NO_EMPTY_STRING file name', () => {
    const mockFileData = {
      name: ' ',
      id: '0x0bef',
      size: 455,
      description: 'Test file description',
    }

    try {
      const file = new Fil(mockFileData)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.NO_EMPTY_STRING)
    }
  })
  it('Returns error for ITEM_ABSTRACT_ONLY constructor', () => {
    const mockFileData = {
      name: ' ',
      id: '0x0bef',
      size: 455,
      description: 'Test file description',
    }

    try {
      const file = new Item(mockFileData)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        FileSystemErrors.ITEM_ABSTRACT_ONLY,
      )
    }
  })
})
