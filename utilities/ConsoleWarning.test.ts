import * as ConsoleWarning from "~/utilities/ConsoleWarning"
import { expect } from '@jest/globals'

describe("ConsoleWarning.ConsoleWarning", () => {
    test("0", () => {
        let result: any = ConsoleWarning.ConsoleWarning("1.0.0", {})
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = ConsoleWarning.ConsoleWarning("v1.2.4", {})
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = ConsoleWarning.ConsoleWarning("v4.0.0-rc.4", {})
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = ConsoleWarning.ConsoleWarning("4.0.0-beta1\t", {})
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = ConsoleWarning.ConsoleWarning("^5.0.0", {})
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = ConsoleWarning.ConsoleWarning("", {})
        expect(result).toMatchSnapshot()
    })
})
