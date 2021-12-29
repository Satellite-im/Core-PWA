import * as state from '~/store/chat/state'

describe("state.default", () => {
    test("0", () => {
        let result: any = state.default()
        expect(result).toMatchSnapshot()
    })
})
