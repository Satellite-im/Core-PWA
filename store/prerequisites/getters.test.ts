import * as getters from '~/store/prerequisites/getters'
import { expect } from '@jest/globals'

describe("getters.default.allPrerequisitesReady", () => {
    test("0", () => {
        let result: any = getters.default.allPrerequisitesReady({ accountsReady: true, textileReady: false, p2pReady: false })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = getters.default.allPrerequisitesReady({ accountsReady: true, textileReady: true, p2pReady: false })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = getters.default.allPrerequisitesReady({ accountsReady: true, textileReady: true, p2pReady: true })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = getters.default.allPrerequisitesReady({ accountsReady: true, textileReady: false, p2pReady: true })
        expect(result).toMatchSnapshot()
    })
})
