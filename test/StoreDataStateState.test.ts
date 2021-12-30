import * as state from '~/store/dataState/state'

describe("state.default", () => {
    test("0", () => {
        let result: any = state.default()
        expect(result).toMatchSnapshot()
    })
})
