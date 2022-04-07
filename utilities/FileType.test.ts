import fs from 'fs'
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

describe('FileType.isHeic', () => {
  test('heic function check heic imag', async () => {
    const buffer = fs.readFileSync('utilities/assets/heic-image.heic', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'image/heic',
    })
    const result: any = await FileType.isHeic(file)

    expect(result).toBeTruthy()
  })
  test('heic function check non heic image', async () => {
    const buffer = fs.readFileSync('utilities/assets/non-heic-image.png', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'image/heic', // Wrong type and the isHeic function still works
    })
    const result: any = await FileType.isHeic(file)

    expect(result).toBeFalsy()
  })

  test('heic function check a non buffer response', async () => {
    const buffer = Buffer.from('Hello, World', 'utf8') // buffer.length is 12
    const file = new Blob([buffer], {
      type: 'image/heic', // Wrong type and the isHeic function still works
    })
    const result: any = await FileType.isHeic(file)

    expect(result).toBeFalsy()
  })
})

describe('FileType.isEmbeddableImage', () => {
  test('isEmbeddableImage check svg image', async () => {
    const buffer = fs.readFileSync('utilities/assets/svg-image.svg', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'image/heic',
    })
    const result: any = await FileType.isEmbeddableImage(file)

    expect(result).toBeTruthy()
  })
  test('isEmbeddableImage check non svg image', async () => {
    const buffer = fs.readFileSync('utilities/assets/fontawesome-webfont.otf', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'font/otf',
    })
    const result: any = await FileType.isEmbeddableImage(file)

    expect(result).toBeFalsy()
  })

  test('isEmbeddableImage check a non buffer response', async () => {
    const buffer = Buffer.from('Hello, World', 'utf8') // buffer.length is 12
    const file = new Blob([buffer], {
      type: 'image/heic',
    })
    const result: any = await FileType.isEmbeddableImage(file)

    expect(result).toBeFalsy()
  })
})

describe('FileType.mimeType', () => {
  test('mimeType check svg image', async () => {
    const buffer = fs.readFileSync('utilities/assets/svg-image.svg', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'image/heic',
    })
    const result: any = await FileType.mimeType(file)

    expect(result).toBeTruthy()
  })
  test('mimeType check non svg image', async () => {
    const buffer = fs.readFileSync('utilities/assets/fontawesome-webfont.otf', {
      flag: 'r',
    })
    const file = new Blob([buffer], {
      type: 'font/otf',
    })
    const result: any = await FileType.mimeType(file)

    expect(result).toBeFalsy()
  })

  test('mimeType check a non buffer response', async () => {
    const buffer = Buffer.from('Hello, World', 'utf8') // buffer.length is 12
    const file = new Blob([buffer], {
      type: 'image/heic',
    })
    const result: any = await FileType.mimeType(file)

    expect(result).toBeFalsy()
  })
})
