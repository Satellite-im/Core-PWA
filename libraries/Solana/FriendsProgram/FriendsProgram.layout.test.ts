import * as FriendsProgram_layout from '~/libraries/Solana/FriendsProgram/FriendsProgram.layout'
import { expect } from '@jest/globals'

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
