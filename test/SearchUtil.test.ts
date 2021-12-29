import * as SearchUtil from '~/components/interactables/Search/SearchUtil'

describe("SearchUtil.default.getTextCommandMap", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getTextCommandMap()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getCommandTypeParams", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandTypeParams()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getCommandMetaList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandMetaList()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getSearchResultGroupList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getSearchResultGroupList()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getSearchOrderTypeList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getSearchOrderTypeList()
        expect(result).toMatchSnapshot()
    })
})
/*
describe("SearchUtil.default.getCommandMeta", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.In)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.From)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.Before)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.Empty)
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getCommandTypeParam", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.Mentions)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.Before)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.In)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.After)
        expect(result).toMatchSnapshot()
    })
})*/

describe("SearchUtil.default.filterSearchRecommendResult", () => {
    /*test("0", () => {
        let object: any = [{ name: undefined, address: undefined, avatar: undefined, key: "elio@example.com", value: "Elio" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key3: [], key0: [], key2: [] }, { command: search.SearchCommand.Mentions, value: "elio@example.com", index: 100, cursorStart: 2, cursorEnd: 1 })
        expect(result).toMatchSnapshot()
    })*/

    test("1", () => {
        let object: any = [{ name: undefined, address: undefined, avatar: undefined, key: "elio@example.com", value: "elio@example.com" }, { name: undefined, address: undefined, avatar: undefined, key: "elio@example.com", value: "Elio" }, { name: undefined, address: undefined, avatar: undefined, key: "Dillenberg", value: "elio@example.com" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key3: [], key0: [], key2: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let object: any = [{ name: undefined, address: undefined, avatar: undefined, key: "Elio", value: "Dillenberg" }, { name: undefined, address: undefined, avatar: undefined, key: "Dillenberg", value: "Elio" }, { name: undefined, address: undefined, avatar: undefined, key: "Dillenberg", value: "Elio" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key3: [], key0: [], key2: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let object: any = [{ name: undefined, address: undefined, avatar: undefined, key: "elio@example.com", value: "elio@example.com" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key3: [], key0: [], key2: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let object: any = [{ name: "Jean-Philippe", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/joannefournier_128.jpg", key: "Elio", value: "Elio" }, { name: "Edmond", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg", key: "Dillenberg", value: "Elio" }, { name: "Edmond", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg", key: "Elio", value: "Elio" }, { name: "Edmond", address: "0.0.0.0", avatar: "https://cdn.fakercloud.com/avatars/weavermedia_128.jpg", key: "Dillenberg", value: "elio@example.com" }, { name: "Edmond", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/joannefournier_128.jpg", key: "Dillenberg", value: "Elio" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key0: object, key2: [], key4: [], key3: [], key1: [] }, null)
        expect(result).toMatchSnapshot()
    })

    /*test("5", () => {
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: [], key3: [], key0: [], key2: [] }, { command: search.SearchCommand.From, value: "", index: NaN, cursorStart: NaN, cursorEnd: NaN })
        expect(result).toMatchSnapshot()
    })*/
})

describe("SearchUtil.default.getCommandMetaList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandMetaList()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getTextCommandMap", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getTextCommandMap()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getSearchResultGroupList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getSearchResultGroupList()
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getSearchOrderTypeList", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getSearchOrderTypeList()
        expect(result).toMatchSnapshot()
    })
})
/*
describe("SearchUtil.default.getCommandMeta", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.In)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.During)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.From)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = SearchUtil.default.getCommandMeta(search.SearchCommand.Mentions)
        expect(result).toMatchSnapshot()
    })
})

describe("SearchUtil.default.getCommandTypeParam", () => {
    test("0", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.Before)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.During)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = SearchUtil.default.getCommandTypeParam(search.SearchCommand.Mentions)
        expect(result).toMatchSnapshot()
    })
})*/


describe("SearchUtil.default.filterSearchRecommendResult", () => {
    test("0", () => {
        let object: any = [{ name: "Michael", address: "192.168.1.5", avatar: undefined, key: "Elio", value: "Dillenberg" }, { name: "Jean-Philippe", address: "0.0.0.0", avatar: undefined, key: "elio@example.com", value: "elio@example.com" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key0: object, key2: [], key4: [], key3: [], key1: [] }, null)
        expect(result).toMatchSnapshot()
    })

    /*test("1", () => {
        let object: any = [{ name: "Pierre Edouard", address: "0.0.0.0", avatar: "https://cdn.fakercloud.com/avatars/zvchkelly_128.jpg", key: "Dillenberg", value: "Elio" }, { name: "Pierre Edouard", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/weavermedia_128.jpg", key: "Dillenberg", value: "elio@example.com" }, { name: "Anas", address: "0.0.0.0", avatar: "https://cdn.fakercloud.com/avatars/joannefournier_128.jpg", key: "Elio", value: "Dillenberg" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key0: [] }, { command: search.SearchCommand.After, value: "elio@example.com", index: 0, cursorStart: 0, cursorEnd: 100 })
        expect(result).toMatchSnapshot()
    })*/

    test("2", () => {
        let object: any = [{ name: "Edmond", address: "0.0.0.0", avatar: undefined, key: "Elio", value: "elio@example.com" }, { name: "Michael", address: "0.0.0.0", avatar: undefined, key: "elio@example.com", value: "Elio" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key0: object, key2: [], key4: [], key3: [], key1: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let object: any = [{ name: "George", address: "192.168.1.5", avatar: undefined, key: "Elio", value: "elio@example.com" }, { name: "Anas", address: "192.168.1.5", avatar: undefined, key: "Dillenberg", value: "Dillenberg" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key0: object, key2: [], key4: [], key3: [], key1: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let object: any = [{ name: "Edmond", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/akmalfikri_128.jpg", key: "elio@example.com", value: "Elio" }, { name: "George", address: "0.0.0.0", avatar: "https://cdn.fakercloud.com/avatars/zvchkelly_128.jpg", key: "elio@example.com", value: "Dillenberg" }, { name: "Pierre Edouard", address: "192.168.1.5", avatar: "https://cdn.fakercloud.com/avatars/zvchkelly_128.jpg", key: "Elio", value: "elio@example.com" }]
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key1: object, key0: [] }, null)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = SearchUtil.default.filterSearchRecommendResult({ key0: [], key2: [], key4: [], key3: [], key1: [] }, null)
        expect(result).toMatchSnapshot()
    })
})
