import * as Messaging from "~/utilities/Messaging"

describe("Messaging.refreshTimestampInterval", () => {
    test("0", () => {
        let result: any = Messaging.refreshTimestampInterval(-5.48, () => "{\n  \"type\": \"RECEIVE_MESSAGE\"\n}", 100000)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = Messaging.refreshTimestampInterval(-100, () => "{\n  \"type\": \"ADD_TODO\"\n}", 1000)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = Messaging.refreshTimestampInterval(-5.48, () => "{\n  \"type\": \"RECEIVE_MESSAGE\"\n}", 3)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = Messaging.refreshTimestampInterval(100, () => "{\n  \"type\": \"RECEIVE_MESSAGE\"\n}", 2)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = Messaging.refreshTimestampInterval(-5.48, () => "{\n  \"type\": \"RECEIVE_MESSAGE\"\n}", 1)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = Messaging.refreshTimestampInterval(-Infinity, () => "", -Infinity)
        expect(result).toMatchSnapshot()
    })
})
