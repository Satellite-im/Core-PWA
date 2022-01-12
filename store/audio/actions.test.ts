import * as actions from '~/store/audio/actions'
import { expect } from '@jest/globals'

describe.skip("actions.default.toggleDeafen", () => { //AP-375
    test("0", () => {
        let result: any = actions.default.toggleDeafen("http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = actions.default.toggleDeafen("http://base.com")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = actions.default.toggleDeafen("www.google.com")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = actions.default.toggleDeafen("http://www.example.com/route/123?foo=bar")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = actions.default.toggleDeafen("https://api.telegram.org/")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = actions.default.toggleDeafen("")
        expect(result).toMatchSnapshot()
    })
})

describe.skip("actions.default.toggleMute", () => { //AP-376
    test("0", () => {
        let result: any = actions.default.toggleMute("https://croplands.org/app/a/confirm?t=")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = actions.default.toggleMute("http://www.croplands.org/account/confirm?t=")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = actions.default.toggleMute("https://croplands.org/app/a/reset?token=")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = actions.default.toggleMute("google.com")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = actions.default.toggleMute("Www.GooGle.com")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = actions.default.toggleMute("")
        expect(result).toMatchSnapshot()
    })
})
