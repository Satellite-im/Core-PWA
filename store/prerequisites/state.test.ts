import * as state from '~/store/prerequisites/state'
import { expect } from '@jest/globals'

describe("state.default", () => {
    test("0", () => {
        let result: any = state.default()
        expect(result).toMatchSnapshot()
    })
})
