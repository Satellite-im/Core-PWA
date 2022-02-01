import { ContextMenu } from "~/components/mixins/UI/ContextMenu"

describe.skip("ContextMenu.ContextMenu.methods.contextMenu", () => { //AP-373
    test("0", () => {
        let object: any = [{ addEventListener: () => undefined, dispatchEvent: () => false, removeEventListener: () => undefined }, { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }, { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }]
        let result: any = ContextMenu.methods.contextMenu({ bubbles: false, cancelBubble: true, cancelable: true, composed: true, currentTarget: null, defaultPrevented: false, eventPhase: 10.23, isTrusted: false, returnValue: false, srcElement: null, target: null, timeStamp: 25, type: "number", composedPath: () => object, initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: 1.0, BUBBLING_PHASE: 0.0, CAPTURING_PHASE: 10.23, NONE: 16 })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = ContextMenu.methods.contextMenu({ bubbles: true, cancelBubble: false, cancelable: false, composed: false, currentTarget: { addEventListener: () => undefined, dispatchEvent: () => false, removeEventListener: () => undefined }, defaultPrevented: false, eventPhase: 10.0, isTrusted: false, returnValue: false, srcElement: null, target: null, timeStamp: 35, type: "object", composedPath: () => [], initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: 1.0, BUBBLING_PHASE: -0.5, CAPTURING_PHASE: -29.45, NONE: 4 })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = ContextMenu.methods.contextMenu({ bubbles: false, cancelBubble: true, cancelable: true, composed: true, currentTarget: { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }, defaultPrevented: true, eventPhase: 1.0, isTrusted: false, returnValue: true, srcElement: null, target: null, timeStamp: 18, type: "number", composedPath: () => [], initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: -29.45, BUBBLING_PHASE: 1.0, CAPTURING_PHASE: 0.0, NONE: 256 })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = ContextMenu.methods.contextMenu({ bubbles: true, cancelBubble: true, cancelable: true, composed: false, currentTarget: { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }, defaultPrevented: true, eventPhase: 10.0, isTrusted: false, returnValue: true, srcElement: null, target: null, timeStamp: 75, type: "object", composedPath: () => [], initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: 10.23, BUBBLING_PHASE: 10.23, CAPTURING_PHASE: -29.45, NONE: 10 })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = ContextMenu.methods.contextMenu({ bubbles: true, cancelBubble: true, cancelable: true, composed: false, currentTarget: null, defaultPrevented: false, eventPhase: 10.23, isTrusted: false, returnValue: true, srcElement: { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }, target: null, timeStamp: 18, type: "number", composedPath: () => [], initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: 10.23, BUBBLING_PHASE: 1.0, CAPTURING_PHASE: 10.23, NONE: 256 })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = ContextMenu.methods.contextMenu({ bubbles: true, cancelBubble: false, cancelable: false, composed: false, currentTarget: { addEventListener: () => undefined, dispatchEvent: () => true, removeEventListener: () => undefined }, defaultPrevented: false, eventPhase: NaN, isTrusted: false, returnValue: true, srcElement: null, target: null, timeStamp: NaN, type: "", composedPath: () => [], initEvent: () => undefined, preventDefault: () => undefined, stopImmediatePropagation: () => undefined, stopPropagation: () => undefined, AT_TARGET: NaN, BUBBLING_PHASE: NaN, CAPTURING_PHASE: NaN, NONE: NaN })
        expect(result).toMatchSnapshot()
    })
})
