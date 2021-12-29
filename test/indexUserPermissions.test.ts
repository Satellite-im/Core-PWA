import * as index from '~/components/mixins/UserPermissions/index'

describe.skip("formatDevices", () => { //add-ticket - function not implemented.
    test("0", () => {
        let result: any = formatDevices(["Quality", "Identity", "Implementation", "Configuration", "Quality"])
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = formatDevices(["Identity", "Configuration", "Configuration", "Implementation", "Implementation"])
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = formatDevices(["Configuration"])
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = formatDevices(["Quality", "Configuration"])
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = formatDevices(["Interactions", "Quality", "Quality", "Quality", "Interactions"])
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = formatDevices([])
        expect(result).toMatchSnapshot()
    })
})

function formatDevices(arg0: string[]): any {
    throw new Error("Function not implemented.")
}

describe.skip("formatDevices", () => {
    test("0", () => {
        let result: any = formatDevices(["Interactions", "Interactions", "Identity", "Configuration"])
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = formatDevices(["Implementation"])
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = formatDevices(["Quality"])
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = formatDevices(["Implementation", "Configuration", "Implementation"])
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = formatDevices(["Identity"])
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = formatDevices([])
        expect(result).toMatchSnapshot()
    })
})

describe.skip("getRTC", () => { //add-ticket function not implemented
    test("0", async () => {
        await getRTC()
    })
})

describe("index.UserPermissions.methods.getUserPermissions", () => {
    test("0", async () => {
        await index.UserPermissions.methods.getUserPermissions()
    })
})

// @ponicode
describe.skip("index.UserPermissions.methods.requestUserPermissions", () => { //add-ticket     TypeError: Cannot read properties of undefined (reading 'getUserMedia')
    test("0", async () => {
        await index.UserPermissions.methods.requestUserPermissions(undefined)
    })
})
function getRTC() {
    throw new Error("Function not implemented.")
}

