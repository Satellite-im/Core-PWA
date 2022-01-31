import * as mutations from '~/store/chat/mutations'
import { expect } from '@jest/globals'

describe("mutations.default.setChatReply", () => {
    test("0", () => {
        let object2: any = [{ userId: "c466a48309794261b64a4f02cfcc3d64", value: "elio@example.com" }, { userId: "9876", value: "Elio" }, { userId: "12345", value: "Dillenberg" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Dillenberg" }, { userId: "9876", value: "Elio" }]
        let object: any = [{ replyId: "da7588892", value: false }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "12345", value: true }, { replyId: "da7588892", value: true }, { replyId: "da7588892", value: true }]
        let result: any = mutations.default.setChatReply({ replies: object, chatTexts: object2 }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: true })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let object2: any = [{ userId: "da7588892", value: "Elio" }, { userId: "da7588892", value: "elio@example.com" }, { userId: "da7588892", value: "Dillenberg" }]
        let object: any = [{ replyId: "da7588892", value: true }]
        let result: any = mutations.default.setChatReply({ replies: object, chatTexts: object2 }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: false })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let object2: any = [{ userId: "12345", value: "Elio" }, { userId: "9876", value: "elio@example.com" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Elio" }]
        let object: any = [{ replyId: "da7588892", value: false }, { replyId: "12345", value: false }, { replyId: "da7588892", value: true }]
        let result: any = mutations.default.setChatReply({ replies: object, chatTexts: object2 }, { replyId: "12345", value: false })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let object2: any = [{ userId: "12345", value: "elio@example.com" }, { userId: "9876", value: "Dillenberg" }]
        let object: any = [{ replyId: "12345", value: false }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: true }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: false }]
        let result: any = mutations.default.setChatReply({ replies: object, chatTexts: object2 }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: true })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let object2: any = [{ userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Dillenberg" }, { userId: "9876", value: "Dillenberg" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Elio" }, { userId: "da7588892", value: "elio@example.com" }, { userId: "da7588892", value: "Elio" }]
        let object: any = [{ replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: false }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: true }, { replyId: "12345", value: true }]
        let result: any = mutations.default.setChatReply({ replies: object, chatTexts: object2 }, { replyId: "da7588892", value: false })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = mutations.default.setChatReply({ replies: [], chatTexts: [] }, { replyId: "", value: false })
        expect(result).toMatchSnapshot()
    })
})

describe("mutations.default.setChatText", () => {
    test("0", () => {
        let object2: any = [{ userId: "12345", value: "elio@example.com" }, { userId: "9876", value: "Elio" }]
        let object: any = [{ replyId: "9876", value: false }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: false }]
        let result: any = mutations.default.setChatText({ replies: object, chatTexts: object2 }, { userId: "12345", value: "Elio" })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let object2: any = [{ userId: "12345", value: "Dillenberg" }, { userId: "12345", value: "elio@example.com" }, { userId: "12345", value: "Elio" }]
        let object: any = [{ replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "12345", value: false }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "da7588892", value: true }, { replyId: "12345", value: false }]
        let result: any = mutations.default.setChatText({ replies: object, chatTexts: object2 }, { userId: "9876", value: "elio@example.com" })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let object2: any = [{ userId: "12345", value: "Elio" }, { userId: "c466a48309794261b64a4f02cfcc3d64", value: "elio@example.com" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "elio@example.com" }]
        let object: any = [{ replyId: "bc23a9d531064583ace8f67dad60f6bb", value: false }]
        let result: any = mutations.default.setChatText({ replies: object, chatTexts: object2 }, { userId: "12345", value: "elio@example.com" })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let object2: any = [{ userId: "c466a48309794261b64a4f02cfcc3d64", value: "elio@example.com" }, { userId: "12345", value: "Elio" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Elio" }]
        let object: any = [{ replyId: "bc23a9d531064583ace8f67dad60f6bb", value: false }, { replyId: "c466a48309794261b64a4f02cfcc3d64", value: false }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }, { replyId: "9876", value: true }, { replyId: "bc23a9d531064583ace8f67dad60f6bb", value: true }]
        let result: any = mutations.default.setChatText({ replies: object, chatTexts: object2 }, { userId: "c466a48309794261b64a4f02cfcc3d64", value: "Dillenberg" })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let object2: any = [{ userId: "12345", value: "Dillenberg" }, { userId: "bc23a9d531064583ace8f67dad60f6bb", value: "Dillenberg" }, { userId: "12345", value: "elio@example.com" }, { userId: "9876", value: "elio@example.com" }]
        let object: any = [{ replyId: "c466a48309794261b64a4f02cfcc3d64", value: false }, { replyId: "12345", value: false }]
        let result: any = mutations.default.setChatText({ replies: object, chatTexts: object2 }, { userId: "c466a48309794261b64a4f02cfcc3d64", value: "Dillenberg" })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = mutations.default.setChatText({ replies: [], chatTexts: [] }, { userId: "", value: "" })
        expect(result).toMatchSnapshot()
    })
})
