import * as actions from '~/store/files/actions'
import { expect } from '@jest/globals'

describe("actions.default.handler", () => {
    test("0", () => {
        let result: any = actions.default.handler()
        expect(result).toMatchSnapshot()
    })
})
