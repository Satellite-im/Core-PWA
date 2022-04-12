import * as FilSystem from '~/libraries/Files/FilSystem'
import * as Directory from '~/libraries/Files/Directory'

describe('FilSystem.FilSystem.hasChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.getChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.removeChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.openDirectory', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.copyChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.renameChild', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.goBack', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.goBackToDirectory', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
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

describe('FilSystem.FilSystem.findItem', () => {
  let inst: any

  beforeEach(() => {
    inst = new FilSystem.FilSystem()
  })

  test('0', () => {
    const param2: any = new Directory.Directory({
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
    const param2: any = new Directory.Directory({
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
    const param2: any = new Directory.Directory({
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
    const param2: any = new Directory.Directory({
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
    const param2: any = new Directory.Directory({
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

  describe('FilSystem.FilSystem.findAllItems', () => {
    let inst: any

    beforeEach(() => {
      inst = new FilSystem.FilSystem()
    })

    test('0', () => {
      const param2: any = new Directory.Directory({
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
      const param2: any = new Directory.Directory({
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
      const param2: any = new Directory.Directory({
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
      const param2: any = new Directory.Directory({
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
      const param2: any = new Directory.Directory({
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

    describe('FilSystem.FilSystem.fuzzySearch', () => {
      let inst: any

      beforeEach(() => {
        inst = new FilSystem.FilSystem()
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

    describe('FilSystem.FilSystem.setupAndFind', () => {
      let inst: any

      beforeEach(() => {
        inst = new FilSystem.FilSystem()
      })

      test('0', () => {
        const param2: any = new Directory.Directory({
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
        const param2: any = new Directory.Directory({
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
        const param2: any = new Directory.Directory({
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
        const param2: any = new Directory.Directory({
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
        const param2: any = new Directory.Directory({
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

      describe('FilSystem.FilSystem._findItem', () => {
        let inst: any

        beforeEach(() => {
          inst = new FilSystem.FilSystem()
        })

        test('0', () => {
          const param2: any = new Directory.Directory({
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
          const param2: any = new Directory.Directory({
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
          const param2: any = new Directory.Directory({
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
          const param2: any = new Directory.Directory({
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
          const param2: any = new Directory.Directory({
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
