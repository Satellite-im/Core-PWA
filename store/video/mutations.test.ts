import * as mutations from '~/store/video/mutations'
import { expect } from '@jest/globals'

describe("mutations.default.toggleCamera", () => {
    test("0", () => {
        let result: any = mutations.default.toggleCamera({ disabled: true })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.toggleCamera({ disabled: false })
        expect(result).toMatchSnapshot()
    })
})

describe("mutations.default.setDisabled", () => {
    test("0", () => {
        let result: any = mutations.default.setDisabled({ disabled: false }, true)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.setDisabled({ disabled: false }, false)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.setDisabled({ disabled: true }, true)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.setDisabled({ disabled: true }, false)
        expect(result).toMatchSnapshot()
    })
})
