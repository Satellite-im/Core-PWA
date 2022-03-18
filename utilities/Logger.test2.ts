import * as Logger from "~/utilities/Logger"

// @ponicode
describe("Logger.default._log", () => {
    let inst10: any
    let inst9: any
    let inst8: any
    let inst7: any
    let inst6: any
    let inst5: any
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst10 = new Logger.default(false)
        inst9 = new Logger.default(true)
        inst8 = new Logger.default(true)
        inst7 = new Logger.default(false)
        inst6 = new Logger.default(true)
        inst5 = new Logger.default(false)
        inst4 = new Logger.default(true)
        inst3 = new Logger.default(true)
        inst = new Logger.default(true)
        inst2 = new Logger.default(true)
    })

    test("0", () => {
        let result: any = inst2._log("Alabama", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality", {}, Logger.LogLevel.PROD)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst._log("Alabama", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst3._log("Alabama", "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", {}, Logger.LogLevel.PROD)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst4._log("Florida", "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", {}, Logger.LogLevel.PROD)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst5._log("Alabama", "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst9._log("", "", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("Logger.default.log", () => {
    let inst10: any
    let inst9: any
    let inst8: any
    let inst7: any
    let inst6: any
    let inst5: any
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst10 = new Logger.default(false)
        inst9 = new Logger.default(true)
        inst8 = new Logger.default(true)
        inst7 = new Logger.default(false)
        inst6 = new Logger.default(false)
        inst5 = new Logger.default(false)
        inst4 = new Logger.default(false)
        inst3 = new Logger.default(false)
        inst = new Logger.default(false)
        inst2 = new Logger.default(false)
    })

    test("0", () => {
        let result: any = inst2.log("Île-de-France", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst.log("Abruzzo", "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", {}, Logger.LogLevel.PROD)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst3.log("Île-de-France", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst4.log("Abruzzo", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst5.log("Alabama", "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst10.log("", "", {}, Logger.LogLevel.DEV)
        expect(result).toMatchSnapshot()
    })
})
