import { Fil } from '../Fil'
import { FILE_TYPE } from '../types/file'

describe('Test FileSystem File', () => {
  const mockFileData = {
    name: 'TestFile.png',
    description: 'Test file description',
    hash: '0x0aef',
  }

  const file = new Fil(...Object.values(mockFileData))

  it(`Correctly returns a file name (${mockFileData.name})`, () =>
    expect(file.name).toEqual(mockFileData.name))
  it(`Correctly returns a file description (${mockFileData.description})`, () =>
    expect(file.description).toEqual(mockFileData.description))
  it(`Correctly returns a file type (${FILE_TYPE.GENERIC})`, () =>
    expect(file.type).toEqual(FILE_TYPE.GENERIC))
  it(`Correctly returns a file hash (${mockFileData.hash})`, () =>
    expect(file.hash).toEqual(mockFileData.hash))
  it('Correctly clones a file', () => {
    const clonedFile: Fil = file.copy
    expect(clonedFile.hash).toEqual(file.hash)
    expect(clonedFile.id).not.toEqual(file.id)
  })
  it('Correctly sets a file description', () => {
    file.description = 'setter'
    expect(file.description).toEqual('setter')
  })
})
