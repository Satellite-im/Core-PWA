import { Fil } from '../Fil'
import { FILE_TYPE } from '../types/file'

describe('Test FileSystem File', () => {
  const mockFileData = {
    name: 'TestFile.png',
    path: '0x0aef',
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
  it(`Correctly returns a file hash (${mockFileData.path})`, () =>
    expect(file.path).toEqual(mockFileData.path))
  it(`Correctly returns a file size (${mockFileData.size})`, () =>
    expect(file.size).toEqual(mockFileData.size))
  it('Correctly clones a file', () => {
    const clonedFile: Fil = file.copy
    expect(clonedFile.path).toEqual(file.path)
    expect(clonedFile.size).toEqual(file.size)
    expect(clonedFile.id).not.toEqual(file.id)
  })
  it('Correctly sets a file description', () => {
    file.description = 'setter'
    expect(file.description).toEqual('setter')
  })
})
