import * as Commands from "~/libraries/ui/Commands"

describe("Commands.parseCommand", () => {
    test("0", () => {
        let result: any = Commands.parseCommand("foo bar")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = Commands.parseCommand("Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = Commands.parseCommand("Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = Commands.parseCommand("This is a Text")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = Commands.parseCommand("")
        expect(result).toMatchSnapshot()
    })
})


describe("Commands.containsCommand", () => {
    test("0", () => {
        let result: any = Commands.containsCommand(" Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = Commands.containsCommand("Hello, world!  Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = Commands.containsCommand("  ")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = Commands.containsCommand(" ")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = Commands.containsCommand("Hello, world! Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = Commands.containsCommand("")
        expect(result).toMatchSnapshot()
    })
})


describe("Commands.isArgsValid", () => {
    test("0", () => {
        let object: any = [{ name: "George", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }, { name: "Michael", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }]
        let result: any = Commands.isArgsValid({ name: "Edmond", description: "Print Base", args: object }, ["v4.0.0-rc.4", "^5.0.0", "4.0.0-beta1\t", "v4.0.0-rc.4", "4.0.0-beta1\t"])
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let object: any = [{ name: "George", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }, { name: "George", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }]
        let result: any = Commands.isArgsValid({ name: "Pierre Edouard", description: "(no description available)", args: object }, ["v4.0.0-rc.4", "v1.2.4"])
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let object: any = [{ name: "Jean-Philippe", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }, { name: "Jean-Philippe", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }]
        let result: any = Commands.isArgsValid({ name: "Michael", description: "No description.", args: object }, ["4.0.0-beta1\t", "1.0.0", "v4.0.0-rc.4", "^5.0.0"])
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let object: any = [{ name: "Pierre Edouard", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }, { name: "Edmond", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }]
        let result: any = Commands.isArgsValid({ name: "Michael", description: " description ", args: object }, ["1.0.0", "^5.0.0", "v4.0.0-rc.4", "1.0.0"])
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let object: any = [{ name: "Anas", options: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" }]
        let result: any = Commands.isArgsValid({ name: "Edmond", description: "Print Base", args: object }, ["1.0.0", "^5.0.0", "^5.0.0", "v4.0.0-rc.4", "4.0.0-beta1\t"])
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = Commands.isArgsValid({ name: "", description: "", args: [] }, [])
        expect(result).toMatchSnapshot()
    })
})
