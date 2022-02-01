import * as Chatbar from '~/libraries/ui/Chatbar'
import { expect } from '@jest/globals'

describe("Chatbar.htmlToMarkdown", () => {
    test("0", () => {
        let result: any = Chatbar.htmlToMarkdown("This is a Text")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = Chatbar.htmlToMarkdown("foo bar")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = Chatbar.htmlToMarkdown("Hello, world!")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = Chatbar.htmlToMarkdown("Foo bar")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = Chatbar.htmlToMarkdown("")
        expect(result).toMatchSnapshot()
    })
})

describe("Chatbar.markDownToHtml", () => {
    test("0", () => {
        let result: any = Chatbar.markDownToHtml("pdf")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = Chatbar.markDownToHtml("mpe")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = Chatbar.markDownToHtml("jpeg")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = Chatbar.markDownToHtml("m2v")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = Chatbar.markDownToHtml("")
        expect(result).toMatchSnapshot()
    })
})
