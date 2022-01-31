import * as SolanaManager from "~/libraries/Solana/SolanaManager/SolanaManager"
import { expect } from '@jest/globals'

describe.skip("SolanaManager.default.stringToBuffer", () => { // AP-329
    test("0", () => {
        let result: any = SolanaManager.default.stringToBuffer("Foo bar", 100)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SolanaManager.default.stringToBuffer("This is a Text", -5.48)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SolanaManager.default.stringToBuffer("foo bar", -100)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SolanaManager.default.stringToBuffer("Hello, world!", 100)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = SolanaManager.default.stringToBuffer("This is a Text", 1)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = SolanaManager.default.stringToBuffer("", -Infinity)
        expect(result).toMatchSnapshot()
    })
})

describe.skip("SolanaManager.default.waitForAccount", () => { // AP-329
    test("0", () => {
        let result: any = SolanaManager.default.waitForAccount("Foo bar", "Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SolanaManager.default.waitForAccount("Hello, world!", "foo bar")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SolanaManager.default.waitForAccount("Foo bar", "This is a Text")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SolanaManager.default.waitForAccount("foo bar", "foo bar")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = SolanaManager.default.waitForAccount("This is a Text", "Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = SolanaManager.default.waitForAccount("", "")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("SolanaManager.default.publicKeyFromSeeds", () => { // AP-329
    test("0", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("This is a Text", "foo bar", "foo bar")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("foo bar", "Foo bar", "Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("Foo bar", "foo bar", "Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("foo bar", "This is a Text", "foo bar")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("foo bar", "foo bar", "foo bar")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = SolanaManager.default.publicKeyFromSeeds("", "", "")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("SolanaManager.default.getClusterFromNetworkConfig", () => { // AP-329
    test("0", () => {
        let result: any = SolanaManager.default.getClusterFromNetworkConfig("foo bar")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SolanaManager.default.getClusterFromNetworkConfig("Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SolanaManager.default.getClusterFromNetworkConfig("Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SolanaManager.default.getClusterFromNetworkConfig("")
        expect(result).toMatchSnapshot()
    })
})
