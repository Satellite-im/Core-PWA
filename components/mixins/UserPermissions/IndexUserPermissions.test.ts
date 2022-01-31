import * as index from '~/components/mixins/UserPermissions/index'

describe("index.UserPermissions.methods.getUserPermissions", () => {
    test("0", async () => {
        await index.UserPermissions.methods.getUserPermissions()
    })
})

describe.skip("index.UserPermissions.methods.requestUserPermissions", () => { //AP-374
    test("0", async () => {
        await index.UserPermissions.methods.requestUserPermissions(undefined)
    })
})
