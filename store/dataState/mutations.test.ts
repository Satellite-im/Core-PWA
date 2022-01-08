import { types } from 'util'
import * as mutations from '~/store/dataState/mutations'
import { expect } from '@jest/globals'

describe.skip("mutations.default.setDataState", () => {
    test("0", () => {
        let result: any = mutations.default.setDataState({ files: types.DataStateType.Empty, friends: null, search: null }, { key: "search", value: types.DataStateType.Updating })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = mutations.default.setDataState({ files: types.DataStateType.Empty, friends: null, search: null }, { key: "friends", value: types.DataStateType.Ready })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = mutations.default.setDataState({ files: types.DataStateType.Loading, friends: null, search: null }, { key: "files", value: types.DataStateType.Loading })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = mutations.default.setDataState({ files: types.DataStateType.Updating, friends: null, search: null }, { key: "files", value: types.DataStateType.Loading })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = mutations.default.setDataState({ files: types.DataStateType.Updating, friends: null, search: null }, { key: "friends", value: types.DataStateType.Ready })
        expect(result).toMatchSnapshot()
    })
})
