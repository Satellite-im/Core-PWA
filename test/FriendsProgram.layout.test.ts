import * as FriendsProgram_layout from '~/libraries/Solana/FriendsProgram/FriendsProgram.layout'

describe.skip("removeLeadingZerosFromString", () => { //add-ticket function not implemented.
    test("0", () => {
        let result: any = removeLeadingZerosFromString("Jean-PhilippeGeorge")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = removeLeadingZerosFromString("George")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = removeLeadingZerosFromString("Jean-Philippe")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = removeLeadingZerosFromString("Michael")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = removeLeadingZerosFromString("Pierre Edouard")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = removeLeadingZerosFromString("")
        expect(result).toMatchSnapshot()
    })
})

describe("FriendsProgram_layout.encodeInstructionData", () => {
    test("0", () => {
        let inst: any = new Uint8Array([1, 1])
        let inst2: any = new Uint8Array([-100, 0])
        let inst3: any = new Uint8Array([-100, 1])
        let inst4: any = new Uint8Array([0, 0])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ acceptRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = FriendsProgram_layout.encodeInstructionData({ removeRequest: {} })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = FriendsProgram_layout.encodeInstructionData({ removeFriend: {} })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let inst: any = new Uint8Array([-1, 1])
        let inst2: any = new Uint8Array([0, -1])
        let inst3: any = new Uint8Array([-1, -100])
        let inst4: any = new Uint8Array([0, -100])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ makeRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let inst: any = new Uint8Array([0, -1])
        let inst2: any = new Uint8Array([100, -1])
        let inst3: any = new Uint8Array([0, -100])
        let inst4: any = new Uint8Array([0, -1])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ makeRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })
})

describe.skip("parseMailboxId", () => { //add-ticket function not implemented.
    test("0", () => {
        let param1: any = new Uint8Array([-1, -100])
        let param2: any = new Uint8Array([100, -100])
        let param3: any = new Uint8Array([100, -1])
        let param4: any = new Uint8Array([-100, 0])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let param1: any = new Uint8Array([1, -100])
        let param2: any = new Uint8Array([100, 100])
        let param3: any = new Uint8Array([-100, 0])
        let param4: any = new Uint8Array([1, -1])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let param1: any = new Uint8Array([1, 100])
        let param2: any = new Uint8Array([-1, 1])
        let param3: any = new Uint8Array([0, -100])
        let param4: any = new Uint8Array([-1, 1])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let param1: any = new Uint8Array([-1, 1])
        let param2: any = new Uint8Array([-100, -100])
        let param3: any = new Uint8Array([-100, 100])
        let param4: any = new Uint8Array([0, 0])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let param1: any = new Uint8Array([-100, 0])
        let param2: any = new Uint8Array([-1, 100])
        let param3: any = new Uint8Array([1, 1])
        let param4: any = new Uint8Array([100, -1])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let param1: any = new Uint8Array([])
        let param2: any = new Uint8Array([])
        let param3: any = new Uint8Array([])
        let param4: any = new Uint8Array([])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })
})

describe("FriendsProgram_layout.encodeInstructionData", () => {
    test("0", () => {
        let result: any = FriendsProgram_layout.encodeInstructionData({ removeFriend: {} })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let inst: any = new Uint8Array([0, 100])
        let inst2: any = new Uint8Array([100, 1])
        let inst3: any = new Uint8Array([1, 100])
        let inst4: any = new Uint8Array([1, -1])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ makeRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = FriendsProgram_layout.encodeInstructionData({ denyRequest: {} })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let inst: any = new Uint8Array([0, -100])
        let inst2: any = new Uint8Array([-100, -1])
        let inst3: any = new Uint8Array([-100, 1])
        let inst4: any = new Uint8Array([100, 1])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ makeRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let inst: any = new Uint8Array([-1, 100])
        let inst2: any = new Uint8Array([1, -1])
        let inst3: any = new Uint8Array([100, 0])
        let inst4: any = new Uint8Array([-1, -1])
        let object: any = [inst, inst2, inst3, inst4]
        let result: any = FriendsProgram_layout.encodeInstructionData({ makeRequest: { tex: object } })
        expect(result).toMatchSnapshot()
    })
})

describe.skip("parseMailboxId", () => { //add-ticket function not implemented.
    test("0", () => {
        let param1: any = new Uint8Array([100, -100])
        let param2: any = new Uint8Array([-1, -1])
        let param3: any = new Uint8Array([100, 0])
        let param4: any = new Uint8Array([100, -1])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let param1: any = new Uint8Array([-1, -100])
        let param2: any = new Uint8Array([100, 1])
        let param3: any = new Uint8Array([-1, 1])
        let param4: any = new Uint8Array([100, -100])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let param1: any = new Uint8Array([0, -100])
        let param2: any = new Uint8Array([1, -100])
        let param3: any = new Uint8Array([100, 100])
        let param4: any = new Uint8Array([100, 100])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let param1: any = new Uint8Array([-1, 0])
        let param2: any = new Uint8Array([-1, -1])
        let param3: any = new Uint8Array([0, 1])
        let param4: any = new Uint8Array([-100, -100])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let param1: any = new Uint8Array([100, 1])
        let param2: any = new Uint8Array([0, -1])
        let param3: any = new Uint8Array([0, -100])
        let param4: any = new Uint8Array([100, -1])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let param1: any = new Uint8Array([])
        let param2: any = new Uint8Array([])
        let param3: any = new Uint8Array([])
        let param4: any = new Uint8Array([])
        let result: any = parseMailboxId(param1, param2, param3, param4)
        expect(result).toMatchSnapshot()
    })
})

describe.skip("removeLeadingZerosFromString", () => { //add-ticket function not implemented.
    test("0", () => {
        let result: any = removeLeadingZerosFromString("Jean-Philippe")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = removeLeadingZerosFromString("George")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = removeLeadingZerosFromString("Edmond")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = removeLeadingZerosFromString("Anas")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = removeLeadingZerosFromString("Pierre Edouard")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = removeLeadingZerosFromString("")
        expect(result).toMatchSnapshot()
    })
})
function removeLeadingZerosFromString(arg0: string): any {
    throw new Error('Function not implemented.')
}

function parseMailboxId(param1: any, param2: any, param3: any, param4: any): any {
    throw new Error('Function not implemented.')
}

