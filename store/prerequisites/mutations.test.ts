import * as mutations from '~/store/prerequisites/mutations'
import { expect } from '@jest/globals'

describe("mutations.default.setTextileReady", () => {
    test("0", () => {
        let result: any = mutations.default.setTextileReady({ accountsReady: true, textileReady: true, p2pReady: true }, true)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.setTextileReady({ accountsReady: true, textileReady: false, p2pReady: false }, false)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.setTextileReady({ accountsReady: true, textileReady: true, p2pReady: false }, true)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.setTextileReady({ accountsReady: true, textileReady: false, p2pReady: false }, true)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = mutations.default.setTextileReady({ accountsReady: true, textileReady: false, p2pReady: true }, false)
        expect(result).toMatchSnapshot()
    })
})

describe("mutations.default.setP2PReady", () => {
    test("0", () => {
        let result: any = mutations.default.setP2PReady({ accountsReady: true, textileReady: false, p2pReady: false }, false)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.setP2PReady({ accountsReady: true, textileReady: true, p2pReady: false }, true)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.setP2PReady({ accountsReady: true, textileReady: false, p2pReady: true }, true)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.setP2PReady({ accountsReady: false, textileReady: false, p2pReady: true }, true)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = mutations.default.setP2PReady({ accountsReady: false, textileReady: false, p2pReady: false }, true)
        expect(result).toMatchSnapshot()
    })
})

describe("mutations.default.setAccountsReady", () => {
    test("0", () => {
        let result: any = mutations.default.setAccountsReady({ accountsReady: true, textileReady: true, p2pReady: true }, true)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.setAccountsReady({ accountsReady: false, textileReady: true, p2pReady: false }, true)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.setAccountsReady({ accountsReady: false, textileReady: false, p2pReady: true }, false)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.setAccountsReady({ accountsReady: false, textileReady: false, p2pReady: false }, false)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = mutations.default.setAccountsReady({ accountsReady: true, textileReady: false, p2pReady: true }, false)
        expect(result).toMatchSnapshot()
    })
})

describe("mutations.default.resetState", () => {
    test("0", () => {
        let result: any = mutations.default.resetState({ accountsReady: false, textileReady: true, p2pReady: true })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.resetState({ accountsReady: true, textileReady: false, p2pReady: true })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.resetState({ accountsReady: false, textileReady: true, p2pReady: false })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.resetState({ accountsReady: true, textileReady: true, p2pReady: true })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = mutations.default.resetState({ accountsReady: true, textileReady: false, p2pReady: false })
        expect(result).toMatchSnapshot()
    })
})
