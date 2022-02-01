import * as io_ts from "~/utilities/io-ts"
import { expect } from '@jest/globals'

describe("io_ts.fromEnum", () => {
    test("0", () => {
        let result: any = io_ts.fromEnum("Anas", false)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = io_ts.fromEnum("George", false)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = io_ts.fromEnum("Anas", true)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = io_ts.fromEnum("Michael", true)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = io_ts.fromEnum("Edmond", false)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = io_ts.fromEnum("", true)
        expect(result).toMatchSnapshot()
    })
})
