/* import * as IdentityManager from "~/libraries/Textile/IdentityManager"
import * as web3 from "@solana/web3.js"

describe.skip("createRandom", () => { // AP-335
    let inst: any

    beforeEach(() => {
        inst = new IdentityManager.default()
    })

    test("0", async () => {
        await inst.createRandom()
    })
})

describe.skip("generateMessageForEntropy", () => {
    let inst: any

    beforeEach(() => {
        inst = new IdentityManager.default()
    })

    test("0", () => {
        let result: any = inst.generateMessageForEntropy("192.168.1.5", "$p3onyycat")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.generateMessageForEntropy("192.168.1.5", "accessdenied4u")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst.generateMessageForEntropy("192.168.1.5", "!Lov3MyPianoPony")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst.generateMessageForEntropy("0.0.0.0", "$p3onyycat")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst.generateMessageForEntropy("192.168.1.5", "NoWiFi4you")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst.generateMessageForEntropy("", "")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("initFromWallet", () => {
    let inst: any

    beforeEach(() => {
        inst = new IdentityManager.default()
    })

    test("0", async () => {
        await inst.initFromWallet({ mnemonic: "YouarenotAllowed2Use", keypair: web3.Keypair.generate(), path: "C:\\\\path\\to\\folder\\", address: "192.168.1.5" })
    })

    test("1", async () => {
        await inst.initFromWallet({ mnemonic: "accessdenied4u", keypair: web3.Keypair.generate(), path: undefined, address: "192.168.1.5" })
    })

    test("2", async () => {
        await inst.initFromWallet({ mnemonic: undefined, keypair: web3.Keypair.generate(), path: undefined, address: "0.0.0.0" })
    })

    test("3", async () => {
        await inst.initFromWallet({ mnemonic: "NoWiFi4you", keypair: web3.Keypair.generate(), path: "path/to/folder/", address: "0.0.0.0" })
    })

    test("4", async () => {
        await inst.initFromWallet({ mnemonic: "$p3onyycat", keypair: web3.Keypair.generate(), path: "C:\\\\path\\to\\folder\\", address: "192.168.1.5" })
    })

    test("5", async () => {
        await inst.initFromWallet({ mnemonic: undefined, keypair: web3.Keypair.generate(), path: undefined, address: "" })
    })
}) */
