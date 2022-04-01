import * as FileType from '~/utilities/FileType'

describe('FileType.isMimeArchive', () => {
  test('0', () => {
    const result: any = FileType.isMimeArchive('number')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = FileType.isMimeArchive('object')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = FileType.isMimeArchive('string')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = FileType.isMimeArchive('')
    expect(result).toMatchSnapshot()
  })
})

describe('FileType.isMimeEmbeddableImage', () => {
  test('0', () => {
    const result: any = FileType.isMimeEmbeddableImage('number')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = FileType.isMimeEmbeddableImage('object')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = FileType.isMimeEmbeddableImage('string')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = FileType.isMimeEmbeddableImage('array')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = FileType.isMimeEmbeddableImage('')
    expect(result).toMatchSnapshot()
  })
})
