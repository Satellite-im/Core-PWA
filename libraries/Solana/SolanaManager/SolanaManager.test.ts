import * as web3 from '@solana/web3.js'
import * as SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
const SolanaManagerDefault = SolanaManager.default

describe('SolanaManager.default.getPath', () => {
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst6 = new SolanaManagerDefault()
    inst5 = new SolanaManagerDefault()
    inst4 = new SolanaManagerDefault()
    inst3 = new SolanaManagerDefault()
    inst = new SolanaManagerDefault()
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getPath(100)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.getPath(-1)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.getPath(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.getPath(0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.getPath(-Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.generateUserKeypair', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', async () => {
    await inst2.generateUserKeypair()
  })
})

describe('SolanaManager.default.restoreKeypairFromMnemonic', () => {
  let inst10: any
  let inst9: any
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst10 = new SolanaManagerDefault()
    inst9 = new SolanaManagerDefault()
    inst8 = new SolanaManagerDefault()
    inst7 = new SolanaManagerDefault()
    inst6 = new SolanaManagerDefault()
    inst5 = new SolanaManagerDefault()
    inst4 = new SolanaManagerDefault()
    inst3 = new SolanaManagerDefault()
    inst = new SolanaManagerDefault()
    inst2 = new SolanaManagerDefault()
  })

  test('0', async () => {
    await inst2.restoreKeypairFromMnemonic('Edmond', 0)
  })

  test('1', async () => {
    await inst.restoreKeypairFromMnemonic('Michael', -1)
  })

  test('2', async () => {
    await inst3.restoreKeypairFromMnemonic('Pierre Edouard', 100)
  })

  test('3', async () => {
    await inst4.restoreKeypairFromMnemonic('George', 0)
  })

  test('4', async () => {
    await inst5.restoreKeypairFromMnemonic('Michael', 1)
  })

  test('5', async () => {
    await inst9.restoreKeypairFromMnemonic('', -Infinity)
  })
})

describe('SolanaManager.default.getDerivedPublicKey', () => {
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst5 = new SolanaManagerDefault()
    inst4 = new SolanaManagerDefault()
    inst3 = new SolanaManagerDefault()
    inst = new SolanaManagerDefault()
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getDerivedPublicKey('Pierre Edouard')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.getDerivedPublicKey('Edmond')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.getDerivedPublicKey('George')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.getDerivedPublicKey('Michael')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.getDerivedPublicKey('')
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.initializeFromKeypair', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', async () => {
    await inst2.initializeFromKeypair(web3.Keypair.generate())
  })
})

describe('SolanaManager.default.initializeFromMnemonic', () => {
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst6 = new SolanaManagerDefault()
    inst5 = new SolanaManagerDefault()
    inst4 = new SolanaManagerDefault()
    inst3 = new SolanaManagerDefault()
    inst = new SolanaManagerDefault()
    inst2 = new SolanaManagerDefault()
  })

  test('0', async () => {
    await inst2.initializeFromMnemonic('logistical')
  })

  test('1', async () => {
    await inst.initializeFromMnemonic('4th generation')
  })

  test('2', async () => {
    await inst3.initializeFromMnemonic('methodical')
  })

  test('3', async () => {
    await inst4.initializeFromMnemonic('dedicated')
  })

  test('4', async () => {
    await inst5.initializeFromMnemonic('value-added')
  })

  test('5', async () => {
    await inst6.initializeFromMnemonic('')
  })
})

describe('SolanaManager.default.isInitialized', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.isInitialized()
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.getAllAccounts', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getAllAccounts()
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.getAccount', () => {
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst3 = new SolanaManagerDefault()
    inst = new SolanaManagerDefault()
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getAccount('0.0.0.0')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.getAccount('192.168.1.5')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.getAccount('')
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.getActiveAccount', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getActiveAccount()
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.getCurrentAccountBalance', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getCurrentAccountBalance()
    expect(result).toMatchSnapshot()
  })
})

describe('SolanaManager.default.requestAirdrop', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new SolanaManagerDefault()
  })

  test('0', async () => {
    await inst2.requestAirdrop()
  })
})

describe('SolanaManager.default.generateDerivedPublicKey', () => {
  let inst10: any
  let inst9: any
  let inst8: any
  let inst7: any
  let inst6: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst10 = new SolanaManager.default()
    inst9 = new SolanaManager.default()
    inst8 = new SolanaManager.default()
    inst7 = new SolanaManager.default()
    inst6 = new SolanaManager.default()
    inst4 = new SolanaManager.default()
    inst3 = new SolanaManager.default()
    inst = new SolanaManager.default()
    inst2 = new SolanaManager.default()
  })

  test('0', async () => {
    const param2: any = new web3.PublicKey(1000)
    const param4: any = new web3.PublicKey(1)
    await inst3.generateDerivedPublicKey(
      'Jean-Philippe',
      param2,
      'foo bar',
      param4,
    )
  })

  test('1', async () => {
    const param2: any = new web3.PublicKey(1000)
    const param4: any = new web3.PublicKey(1000)
    await inst4.generateDerivedPublicKey(
      'Pierre Edouard',
      param2,
      'Foo bar',
      param4,
    )
  })

  describe('SolanaManager.default.generateNewAccount', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new SolanaManager.default()
    })

    test('0', async () => {
      await inst2.generateNewAccount()
    })
  })

  describe('SolanaManager.default.initializeFromKeypair', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new SolanaManager.default()
    })

    test('0', async () => {
      await inst2.initializeFromKeypair(web3.Keypair.generate())
    })
  })

  describe('SolanaManager.default.isInitialized', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new SolanaManager.default()
    })

    test('0', () => {
      const result: any = inst2.isInitialized()
      expect(result).toMatchSnapshot()
    })
  })

  describe('SolanaManager.default.initializeFromSolanaWallet', () => {
    let inst9: any
    let inst8: any
    let inst7: any
    let inst6: any
    let inst5: any
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
      inst9 = new SolanaManager.default()
      inst8 = new SolanaManager.default()
      inst7 = new SolanaManager.default()
      inst6 = new SolanaManager.default()
      inst5 = new SolanaManager.default()
      inst4 = new SolanaManager.default()
      inst3 = new SolanaManager.default()
      inst = new SolanaManager.default()
      inst2 = new SolanaManager.default()
    })

    test('0', async () => {
      await inst9.initializeFromSolanaWallet({
        mnemonic: undefined,
        keypair: web3.Keypair.generate(),
        path: undefined,
        address: '',
      })
    })
  })

  describe('SolanaManager.default.getAllAccounts', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new SolanaManager.default()
    })

    test('0', () => {
      const result: any = inst2.getAllAccounts()
      expect(result).toMatchSnapshot()
    })
  })

  describe('SolanaManager.default.getAccount', () => {
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
      inst3 = new SolanaManager.default()
      inst = new SolanaManager.default()
      inst2 = new SolanaManager.default()
    })

    test('0', () => {
      const result: any = inst2.getAccount('0.0.0.0')
      expect(result).toMatchSnapshot()
    })

    test('1', () => {
      const result: any = inst.getAccount('192.168.1.5')
      expect(result).toMatchSnapshot()
    })

    test('2', () => {
      const result: any = inst3.getAccount('')
      expect(result).toMatchSnapshot()
    })
  })
})
