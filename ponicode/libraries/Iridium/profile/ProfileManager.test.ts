import * as ProfileManager from "~/libraries/Iridium/profile/ProfileManager"
import * as IridiumManager from "~/libraries/Iridium/IridiumManager"

describe("ProfileManager.default.init", () => {
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst2 = new IridiumManager.IridiumManager()
        inst3 = new ProfileManager.default(inst2)
    })

    test("0", async () => {
        await inst3.init()
    })
})

describe("ProfileManager.default.fetch", () => {
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst2 = new IridiumManager.IridiumManager()
        inst3 = new ProfileManager.default(inst2)
    })

    test("0", async () => {
        await inst3.fetch()
    })
})

describe("ProfileManager.default.onStateChanged", () => {
    let inst19: any
    let inst20: any
    let inst17: any
    let inst18: any
    let inst15: any
    let inst16: any
    let inst13: any
    let inst14: any
    let inst11: any
    let inst12: any
    let inst9: any
    let inst10: any
    let inst7: any
    let inst8: any
    let inst5: any
    let inst6: any
    let inst: any
    let inst4: any
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst19 = new IridiumManager.IridiumManager()
        inst20 = new ProfileManager.default(inst19)
        inst17 = new IridiumManager.IridiumManager()
        inst18 = new ProfileManager.default(inst17)
        inst15 = new IridiumManager.IridiumManager()
        inst16 = new ProfileManager.default(inst15)
        inst13 = new IridiumManager.IridiumManager()
        inst14 = new ProfileManager.default(inst13)
        inst11 = new IridiumManager.IridiumManager()
        inst12 = new ProfileManager.default(inst11)
        inst9 = new IridiumManager.IridiumManager()
        inst10 = new ProfileManager.default(inst9)
        inst7 = new IridiumManager.IridiumManager()
        inst8 = new ProfileManager.default(inst7)
        inst5 = new IridiumManager.IridiumManager()
        inst6 = new ProfileManager.default(inst5)
        inst = new IridiumManager.IridiumManager()
        inst4 = new ProfileManager.default(inst)
        inst2 = new IridiumManager.IridiumManager()
        inst3 = new ProfileManager.default(inst2)
    })

    test("0", () => {
        let result: any = inst3.onStateChanged({ path: "/profile/profile", value: "elio@example.com" })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst4.onStateChanged({ path: "path/to/file.ext/profileC:\\\\path\\to\\file.ext", value: "Dillenberg" })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst6.onStateChanged({ path: "C:\\\\path\\to\\file.ext/profile", value: "Dillenberg" })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst8.onStateChanged({ path: "/profile", value: "Dillenberg" })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst10.onStateChanged({ path: "path/to/file.ext/profileC:\\\\path\\to\\file.ext", value: "Elio" })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst20.onStateChanged({ path: "", value: "" })
        expect(result).toMatchSnapshot()
    })
})

describe("ProfileManager.default.get", () => {
    let inst15: any
    let inst16: any
    let inst13: any
    let inst14: any
    let inst11: any
    let inst12: any
    let inst9: any
    let inst10: any
    let inst7: any
    let inst8: any
    let inst5: any
    let inst6: any
    let inst: any
    let inst4: any
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst15 = new IridiumManager.IridiumManager()
        inst16 = new ProfileManager.default(inst15)
        inst13 = new IridiumManager.IridiumManager()
        inst14 = new ProfileManager.default(inst13)
        inst11 = new IridiumManager.IridiumManager()
        inst12 = new ProfileManager.default(inst11)
        inst9 = new IridiumManager.IridiumManager()
        inst10 = new ProfileManager.default(inst9)
        inst7 = new IridiumManager.IridiumManager()
        inst8 = new ProfileManager.default(inst7)
        inst5 = new IridiumManager.IridiumManager()
        inst6 = new ProfileManager.default(inst5)
        inst = new IridiumManager.IridiumManager()
        inst4 = new ProfileManager.default(inst)
        inst2 = new IridiumManager.IridiumManager()
        inst3 = new ProfileManager.default(inst2)
    })

    test("0", () => {
        let result: any = inst3.get("./path/to/file", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst4.get("C:\\\\path\\to\\file.ext", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst6.get("C:\\\\path\\to\\folder\\", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst8.get("path/to/file.ext", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst10.get("/path/to/file", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst16.get("", "")
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("ProfileManager.default.set", () => {
    let inst11: any
    let inst12: any
    let inst9: any
    let inst10: any
    let inst7: any
    let inst8: any
    let inst5: any
    let inst6: any
    let inst: any
    let inst4: any
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst11 = new IridiumManager.IridiumManager()
        inst12 = new ProfileManager.default(inst11)
        inst9 = new IridiumManager.IridiumManager()
        inst10 = new ProfileManager.default(inst9)
        inst7 = new IridiumManager.IridiumManager()
        inst8 = new ProfileManager.default(inst7)
        inst5 = new IridiumManager.IridiumManager()
        inst6 = new ProfileManager.default(inst5)
        inst = new IridiumManager.IridiumManager()
        inst4 = new ProfileManager.default(inst)
        inst2 = new IridiumManager.IridiumManager()
        inst3 = new ProfileManager.default(inst2)
    })

    test("0", () => {
        let result: any = inst3.set(".", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst4.set("path/to/folder/", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst6.set("C:\\\\path\\to\\folder\\", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst8.set("path/to/file.ext", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst10.set("C:\\\\path\\to\\file.ext", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst12.set("", "", "")
        expect(result).toMatchSnapshot()
    })
})
