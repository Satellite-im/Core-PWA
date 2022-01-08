import * as Crypto from "~/libraries/Crypto/Crypto"
import * as web3 from "@solana/web3.js"
import { expect } from '@jest/globals'

describe.skip("init", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.init(web3.Keypair.generate())
        expect(result).toMatchSnapshot()
    })
})

describe.skip("hash", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", async () => {
        await inst.hash("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("1", async () => {
        await inst.hash("")
    })
})

describe.skip("computeSharedSecret", () => { // AP-332
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let param1: any = new web3.PublicKey(1000)
        let result: any = inst.computeSharedSecret(param1)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let param1: any = new web3.PublicKey("Becky Bednar")
        let result: any = inst.computeSharedSecret(param1)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let param1: any = new web3.PublicKey(10)
        let result: any = inst.computeSharedSecret(param1)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let param1: any = new web3.PublicKey("")
        let result: any = inst.computeSharedSecret(param1)
        expect(result).toMatchSnapshot()
    })
})

describe.skip("aesKeyFromSharedSecret", () => { // AP-333
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.aesKeyFromSharedSecret("NoWiFi4you")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.aesKeyFromSharedSecret("$p3onyycat")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst.aesKeyFromSharedSecret("YouarenotAllowed2Use")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst.aesKeyFromSharedSecret("accessdenied4u")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst.aesKeyFromSharedSecret("!Lov3MyPianoPony")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst.aesKeyFromSharedSecret("")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("initializeRecipient", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", async () => {
        let param1: any = new web3.PublicKey(1)
        await inst.initializeRecipient(param1)
    })

    test("1", async () => {
        let param1: any = new web3.PublicKey("Maurice Purdy")
        await inst.initializeRecipient(param1)
    })

    test("2", async () => {
        let param1: any = new web3.PublicKey(1000)
        await inst.initializeRecipient(param1)
    })

    test("3", async () => {
        let param1: any = new web3.PublicKey(10)
        await inst.initializeRecipient(param1)
    })

    test("4", async () => {
        let param1: any = new web3.PublicKey("Gail Hoppe")
        await inst.initializeRecipient(param1)
    })

    test("5", async () => {
        let param1: any = new web3.PublicKey("")
        await inst.initializeRecipient(param1)
    })
})

describe.skip("encrypt", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", async () => {
        await inst.encrypt("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", { algorithm: { name: "Michael" }, extractable: true, type: "private", usages: ["encrypt", "encrypt", "encrypt"] })
    })

    test("1", async () => {
        await inst.encrypt("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", { algorithm: { name: "George" }, extractable: false, type: "public", usages: ["decrypt"] })
    })

    test("2", async () => {
        await inst.encrypt("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", { algorithm: { name: "Jean-Philippe" }, extractable: true, type: "private", usages: ["encrypt", "encrypt", "encrypt"] })
    })

    test("3", async () => {
        await inst.encrypt("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", { algorithm: { name: "George" }, extractable: false, type: "private", usages: ["encrypt", "encrypt", "encrypt"] })
    })

    test("4", async () => {
        await inst.encrypt("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", { algorithm: { name: "Michael" }, extractable: true, type: "private", usages: ["unwrapKey", "unwrapKey"] })
    })

    test("5", async () => {
        await inst.encrypt("", { algorithm: { name: "" }, extractable: false, type: "private", usages: [] })
    })
})

describe.skip("separateIvFromData", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let param1: any = new Uint8Array([-1, -1, -1, -100, 1])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let param1: any = new Uint8Array([1, 0, 100, 100, 0])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let param1: any = new Uint8Array([100, 0, -1, 1, 0])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let param1: any = new Uint8Array([1, 100, -100, 1, 100])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let param1: any = new Uint8Array([-100, 1, -100, -1, -100])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let param1: any = new Uint8Array([])
        let result: any = inst.separateIvFromData(param1)
        expect(result).toMatchSnapshot()
    })
})

describe.skip("isInitialized", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.isInitialized()
        expect(result).toMatchSnapshot()
    })
})

describe.skip("decryptFrom", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.decryptFrom("192.168.1.5", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.decryptFrom("0.0.0.0", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst.decryptFrom("", "")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("getSecret", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.getSecret("0.0.0.0")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.getSecret("192.168.1.5")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst.getSecret("")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("decryptWithPassword", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", async () => {
        await inst.decryptWithPassword("Hello, world!", "accessdenied4u")
    })

    test("1", async () => {
        await inst.decryptWithPassword("This is a Text", "accessdenied4u")
    })

    test("2", async () => {
        await inst.decryptWithPassword("Hello, world!", "!Lov3MyPianoPony")
    })

    test("3", async () => {
        await inst.decryptWithPassword("Hello, world!", "$p3onyycat")
    })

    test("4", async () => {
        await inst.decryptWithPassword("foo bar", "NoWiFi4you")
    })

    test("5", async () => {
        await inst.decryptWithPassword("", "")
    })
})

describe.skip("encryptWithPassword", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", async () => {
        await inst.encryptWithPassword("!Lov3MyPianoPony", "accessdenied4u")
    })

    test("1", async () => {
        await inst.encryptWithPassword("$p3onyycat", "!Lov3MyPianoPony")
    })

    test("2", async () => {
        await inst.encryptWithPassword("!Lov3MyPianoPony", "!Lov3MyPianoPony")
    })

    test("3", async () => {
        await inst.encryptWithPassword("NoWiFi4you", "$p3onyycat")
    })

    test("4", async () => {
        await inst.encryptWithPassword("NoWiFi4you", "NoWiFi4you")
    })

    test("5", async () => {
        await inst.encryptWithPassword("", "")
    })
})

describe.skip("signMessageWithKey", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let param1: any = new Uint8Array([0, 0, -1, -1, -1])
        let result: any = inst.signMessageWithKey(param1, "Sorry, The video you are looking for does not exist.")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let param1: any = new Uint8Array([100, 1, 0, 0, 0])
        let result: any = inst.signMessageWithKey(param1, "Invalid [%s] value. %s")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let param1: any = new Uint8Array([1, 1, -100, 1, -1])
        let result: any = inst.signMessageWithKey(param1, "TypeError exception should be raised")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let param1: any = new Uint8Array([-100, 0, -1, 100, 100])
        let result: any = inst.signMessageWithKey(param1, "Invalid data: No data found in any of the field(s)!!!")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let param1: any = new Uint8Array([-1, 0, 1, 0, 1])
        let result: any = inst.signMessageWithKey(param1, "Counterparty sent error: %s")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let param1: any = new Uint8Array([])
        let result: any = inst.signMessageWithKey(param1, "")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("signMessage", () => {
    let inst: any

    beforeEach(() => {
        inst = new Crypto.default()
    })

    test("0", () => {
        let result: any = inst.signMessage("Ran out of iterations")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.signMessage("Connection is closed")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst.signMessage("No updates are to be performed.")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst.signMessage("Uploaded file was not added to the resource. ")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst.signMessage("Could not find an existing submission in location.  rubric is original.")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst.signMessage("")
        expect(result).toMatchSnapshot()
    })
})
