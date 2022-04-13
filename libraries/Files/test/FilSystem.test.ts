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

describe('FilSystem.hasChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.hasChild('Pierre Edouard')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.hasChild('Anas')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.hasChild('Michael')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.hasChild('Jean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.hasChild('Edmond')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.hasChild('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.getChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.getChild('George')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.getChild('Jean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.getChild('Anas')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.getChild('Edmond')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.getChild('Michael')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.getChild('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.removeChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.removeChild('Anas')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.removeChild('Jean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.removeChild('George')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.removeChild('Pierre Edouard')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.removeChild('Edmond')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.removeChild('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.openDirectory', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.openDirectory('C:\\\\path\\to\\file.ext')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.openDirectory('path/to/folder/')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.openDirectory('/path/to/file')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.openDirectory('path/to/file.ext')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.openDirectory('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.copyChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.copyChild('Anas')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.copyChild('Michael')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.copyChild('George')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.copyChild('Edmond')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.copyChild('Jean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.copyChild('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.renameChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.renameChild('Becky Bednar', '/usr/share')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.renameChild('Janet Homenick', '/usr/sbin')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.renameChild('Gail Hoppe', '/usr/ports')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.renameChild('Gail Hoppe', '/selinux')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.renameChild('Ronald Keeling', '/usr/share')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.renameChild('', '')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.goBack', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.goBack(0.0)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.goBack(0)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.goBack(-1)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.goBack(-1.0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.goBack(20)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.goBack(-Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.goBackToDirectory', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const result: any = inst.goBackToDirectory('C:\\\\path\\to\\folder\\')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.goBackToDirectory('.')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst.goBackToDirectory('/path/to/file')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst.goBackToDirectory('path/to/file.ext')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst.goBackToDirectory('path/to/folder/')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst.goBackToDirectory('')
    expect(result).toMatchSnapshot()
  })
})

describe('FilSystem.findItem', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem()
  })

  test('0', () => {
    const param2: any = new Directory({
      id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
      name: 'Edmond',
      liked: true,
      shared: undefined,
      modified: undefined,
      type: undefined,
    })
    const result: any = inst.findItem(() => 'UNLOCK TABLES;', param2)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const param2: any = new Directory({
      id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
      name: 'Michael',
      liked: false,
      shared: undefined,
      modified: undefined,
      type: undefined,
    })
    const result: any = inst.findItem(
      () => 'DELETE FROM Projects WHERE pid = %s',
      param2,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const param2: any = new Directory({
      id: undefined,
      name: 'Michael',
      liked: undefined,
      shared: false,
      modified: 200,
      type: undefined,
    })
    const result: any = inst.findItem(() => 'DROP TABLE tmp;', param2)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const param2: any = new Directory({
      id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
      name: 'Michael',
      liked: false,
      shared: undefined,
      modified: undefined,
      type: undefined,
    })
    const result: any = inst.findItem(() => 'UNLOCK TABLES;', param2)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const param2: any = new Directory({
      id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
      name: 'George',
      liked: false,
      shared: undefined,
      modified: 400,
      type: undefined,
    })
    const result: any = inst.findItem(
      () =>
        "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
      param2,
    )
    expect(result).toMatchSnapshot()
  })

  describe('FilSystem.findAllItems', () => {
    let inst: any

    beforeEach(() => {
      inst = new FilSystem()
    })

    test('0', () => {
      const param2: any = new Directory({
        id: undefined,
        name: 'Edmond',
        liked: true,
        shared: false,
        modified: 429,
        type: undefined,
      })
      const result: any = inst.findAllItems(
        () => 'DELETE FROM Projects WHERE pid = %s',
        param2,
      )
      expect(result).toMatchSnapshot()
    })

    test('1', () => {
      const param2: any = new Directory({
        id: undefined,
        name: 'Jean-Philippe',
        liked: true,
        shared: true,
        modified: 500,
        type: undefined,
      })
      const result: any = inst.findAllItems(
        () => 'UPDATE Projects SET pname = %s WHERE pid = %s',
        param2,
      )
      expect(result).toMatchSnapshot()
    })

    test('2', () => {
      const param2: any = new Directory({
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        name: 'Edmond',
        liked: undefined,
        shared: true,
        modified: undefined,
        type: undefined,
      })
      const result: any = inst.findAllItems(
        () =>
          "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
        param2,
      )
      expect(result).toMatchSnapshot()
    })

    test('3', () => {
      const param2: any = new Directory({
        id: undefined,
        name: 'Michael',
        liked: false,
        shared: true,
        modified: 200,
        type: undefined,
      })
      const result: any = inst.findAllItems(
        () => 'UPDATE Projects SET pname = %s WHERE pid = %s',
        param2,
      )
      expect(result).toMatchSnapshot()
    })

    test('4', () => {
      const param2: any = new Directory({
        id: undefined,
        name: 'Jean-Philippe',
        liked: true,
        shared: true,
        modified: 429,
        type: undefined,
      })
      const result: any = inst.findAllItems(() => 'DROP TABLE tmp;', param2)
      expect(result).toMatchSnapshot()
    })

    describe('FilSystem.fuzzySearch', () => {
      let inst: any

      beforeEach(() => {
        inst = new FilSystem()
      })

      test('0', () => {
        const result: any = inst.fuzzySearch('George')
        expect(result).toMatchSnapshot()
      })

      test('1', () => {
        const result: any = inst.fuzzySearch('Pierre Edouard')
        expect(result).toMatchSnapshot()
      })

      test('2', () => {
        const result: any = inst.fuzzySearch('Michael')
        expect(result).toMatchSnapshot()
      })

      test('3', () => {
        const result: any = inst.fuzzySearch('Jean-Philippe')
        expect(result).toMatchSnapshot()
      })

      test('4', () => {
        const result: any = inst.fuzzySearch('Anas')
        expect(result).toMatchSnapshot()
      })

      test('5', () => {
        const result: any = inst.fuzzySearch('')
        expect(result).toMatchSnapshot()
      })
    })

    describe('FilSystem.setupAndFind', () => {
      let inst: any

      beforeEach(() => {
        inst = new FilSystem()
      })

      test('0', () => {
        const param2: any = new Directory({
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
          name: 'Anas',
          liked: undefined,
          shared: undefined,
          modified: undefined,
          type: undefined,
        })
        const result: any = inst.setupAndFind(
          "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
          param2,
          undefined,
        )
        expect(result).toMatchSnapshot()
      })

      test('1', () => {
        const param2: any = new Directory({
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
          name: 'Pierre Edouard',
          liked: undefined,
          shared: undefined,
          modified: undefined,
          type: undefined,
        })
        const result: any = inst.setupAndFind(
          'UPDATE Projects SET pname = %s WHERE pid = %s',
          param2,
          false,
        )
        expect(result).toMatchSnapshot()
      })

      test('2', () => {
        const param2: any = new Directory({
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
          name: 'Anas',
          liked: true,
          shared: false,
          modified: 400,
          type: undefined,
        })
        const result: any = inst.setupAndFind('UNLOCK TABLES;', param2, true)
        expect(result).toMatchSnapshot()
      })

      test('3', () => {
        const param2: any = new Directory({
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
          name: 'Michael',
          liked: true,
          shared: false,
          modified: 429,
          type: undefined,
        })
        const result: any = inst.setupAndFind(
          'UPDATE Projects SET pname = %s WHERE pid = %s',
          param2,
          undefined,
        )
        expect(result).toMatchSnapshot()
      })

      test('4', () => {
        const param2: any = new Directory({
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
          name: 'Pierre Edouard',
          liked: false,
          shared: true,
          modified: 429,
          type: undefined,
        })
        const result: any = inst.setupAndFind(
          "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
          param2,
          undefined,
        )
        expect(result).toMatchSnapshot()
      })

      describe('FilSystem._findItem', () => {
        let inst: any

        beforeEach(() => {
          inst = new FilSystem()
        })

        test('0', () => {
          const param2: any = new Directory({
            id: undefined,
            name: 'Michael',
            liked: true,
            shared: undefined,
            modified: undefined,
            type: undefined,
          })
          const result: any = inst._findItem(() => false, param2, true)
          expect(result).toMatchSnapshot()
        })

        test('1', () => {
          const param2: any = new Directory({
            id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
            name: 'Jean-Philippe',
            liked: false,
            shared: undefined,
            modified: undefined,
            type: undefined,
          })
          const result: any = inst._findItem(() => true, param2, false)
          expect(result).toMatchSnapshot()
        })

        test('2', () => {
          const param2: any = new Directory({
            id: undefined,
            name: 'Pierre Edouard',
            liked: false,
            shared: undefined,
            modified: undefined,
            type: undefined,
          })
          const result: any = inst._findItem(() => false, param2, false)
          expect(result).toMatchSnapshot()
        })

        test('3', () => {
          const param2: any = new Directory({
            id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
            name: 'Anas',
            liked: false,
            shared: undefined,
            modified: undefined,
            type: undefined,
          })
          const result: any = inst._findItem(() => false, param2, true)
          expect(result).toMatchSnapshot()
        })

        test('4', () => {
          const param2: any = new Directory({
            id: undefined,
            name: 'Pierre Edouard',
            liked: false,
            shared: undefined,
            modified: undefined,
            type: undefined,
          })
          const result: any = inst._findItem(() => true, param2, true)
          expect(result).toMatchSnapshot()
        })
      })
    })
  })
})
