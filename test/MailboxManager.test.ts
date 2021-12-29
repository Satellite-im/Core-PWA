describe.skip("userMessageToThread", () => { //add-ticket function not implemented.
    test("0", () => {
        let inst2: any = new Uint8Array([100, 100])
        let inst: any = new Uint8Array([100, 0])
        let result: any = userMessageToThread({ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", to: "C:\\\\path\\to\\folder\\", from: ".", body: inst, signature: inst2, createdAt: -5.48, readAt: -5.48 })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let inst2: any = new Uint8Array([100, 0])
        let inst: any = new Uint8Array([-1, 0])
        let result: any = userMessageToThread({ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", to: ".", from: "path/to/file.ext", body: inst, signature: inst2, createdAt: -100, readAt: 1 })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let inst2: any = new Uint8Array([0, 1])
        let inst: any = new Uint8Array([0, 1])
        let result: any = userMessageToThread({ id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", to: "./path/to/file", from: "path/to/folder/", body: inst, signature: inst2, createdAt: -5.48, readAt: -100 })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let inst2: any = new Uint8Array([0, 100])
        let inst: any = new Uint8Array([-100, -1])
        let result: any = userMessageToThread({ id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", to: "path/to/folder/", from: "path/to/folder/", body: inst, signature: inst2, createdAt: -100, readAt: -100 })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let inst2: any = new Uint8Array([-100, -100])
        let inst: any = new Uint8Array([100, 0])
        let result: any = userMessageToThread({ id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", to: "C:\\\\path\\to\\file.ext", from: "C:\\\\path\\to\\file.ext", body: inst, signature: inst2, createdAt: -5.48, readAt: -100 })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let inst2: any = new Uint8Array([])
        let inst: any = new Uint8Array([])
        let result: any = userMessageToThread({ id: "", to: "", from: "", body: inst, signature: inst2, createdAt: NaN, readAt: NaN })
        expect(result).toMatchSnapshot()
    })
})

describe.skip("userMessageToThread", () => { //add-ticket function not implemented.
    test("0", () => {
        let inst2: any = new Uint8Array([-100, -100])
        let inst: any = new Uint8Array([-100, -1])
        let result: any = userMessageToThread({ id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", to: "path/to/folder/", from: "C:\\\\path\\to\\file.ext", body: inst, signature: inst2, createdAt: -5.48, readAt: undefined })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let inst2: any = new Uint8Array([0, -100])
        let inst: any = new Uint8Array([0, 0])
        let result: any = userMessageToThread({ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", to: "C:\\\\path\\to\\folder\\", from: "path/to/folder/", body: inst, signature: inst2, createdAt: -5.48, readAt: undefined })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let inst2: any = new Uint8Array([1, 0])
        let inst: any = new Uint8Array([-100, 1])
        let result: any = userMessageToThread({ id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", to: "C:\\\\path\\to\\file.ext", from: "path/to/file.ext", body: inst, signature: inst2, createdAt: 1, readAt: 0 })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let inst2: any = new Uint8Array([100, -100])
        let inst: any = new Uint8Array([-1, -1])
        let result: any = userMessageToThread({ id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", to: "path/to/file.ext", from: ".", body: inst, signature: inst2, createdAt: -5.48, readAt: 1 })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let inst2: any = new Uint8Array([-1, 0])
        let inst: any = new Uint8Array([-100, 0])
        let result: any = userMessageToThread({ id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", to: "path/to/file.ext", from: ".", body: inst, signature: inst2, createdAt: 0, readAt: undefined })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let inst2: any = new Uint8Array([])
        let inst: any = new Uint8Array([])
        let result: any = userMessageToThread({ id: "", to: "", from: "", body: inst, signature: inst2, createdAt: Infinity, readAt: Infinity })
        expect(result).toMatchSnapshot()
    })
})
function userMessageToThread(arg0: { id: string; to: string; from: string; body: any; signature: any; createdAt: number; readAt: number }): any {
    throw new Error('Function not implemented.')
}

