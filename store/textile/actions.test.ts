import * as actions from '~/store/textile/actions'

describe.skip("actions.default.subscribeToSentbox", () => { //AP-377
    test("0", async () => {
        await actions.default.subscribeToSentbox()
    })
})
