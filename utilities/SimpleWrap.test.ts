import * as SimpleWrap from "~/utilities/SimpleWrap"
import { expect } from '@jest/globals'

describe("SimpleWrap.SimpleWrap", () => {
    test("0", () => {
        let result: any = SimpleWrap.SimpleWrap("This is a Text", { replace: "path/to/file.ext\\\\$1\\\\$1C:\\\\path\\to\\file.ext", tag: "Michael" })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SimpleWrap.SimpleWrap("foo bar", { replace: "\\\\$1path/to/file.ext", tag: "Jean-Philippe" })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SimpleWrap.SimpleWrap("Hello, world!", { replace: "path/to/file.ext\\\\$1\\\\$1C:\\\\path\\to\\file.ext", tag: "Pierre Edouard" })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SimpleWrap.SimpleWrap("foo bar", { replace: "\\\\$1", tag: "Jean-Philippe" })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = SimpleWrap.SimpleWrap("Hello, world!", { replace: "C:\\\\path\\to\\file.ext\\\\$1", tag: "Pierre Edouard" })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = SimpleWrap.SimpleWrap("", { replace: "", tag: "" })
        expect(result).toMatchSnapshot()
    })
})
