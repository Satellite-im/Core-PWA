import * as actions from '~/store/textile/actions'

describe.skip("actions.default.subscribeToSentbox", () => { //add-ticket     TypeError: Cannot read properties of undefined (reading 'mailboxManager')
    test("0", async () => {
        await actions.default.subscribeToSentbox()
    })
})
