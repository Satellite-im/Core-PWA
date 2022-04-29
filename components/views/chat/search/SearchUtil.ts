import {
  SearchCommand,
  SearchCommandMeta,
  SearchCommandType,
  SearchCommandTypeParam,
  SearchOption,
  SearchQueryItem,
  SearchRecommend,
  SearchRecommendResultItem,
  SearchResultGroupType,
  SearchValueHas,
} from '~/types/search/search'

const searchCommandTypeParams = {
  [SearchCommandType.User]: {
    key: 'users',
  } as SearchCommandTypeParam,
  [SearchCommandType.Has]: {
    key: 'has',
    values: [
      SearchValueHas.Link,
      SearchValueHas.Embed,
      SearchValueHas.File,
      SearchValueHas.Video,
      SearchValueHas.Image,
      SearchValueHas.Sound,
    ],
    options: [
      { key: SearchValueHas.Link, value: 'link' },
      { key: SearchValueHas.Embed, value: 'embed' },
      { key: SearchValueHas.File, value: 'file' },
      { key: SearchValueHas.Video, value: 'video' },
      { key: SearchValueHas.Image, value: 'image' },
      { key: SearchValueHas.Sound, value: 'sound' },
    ] as SearchOption[],
  } as SearchCommandTypeParam,
  [SearchCommandType.Date]: {
    key: 'date',
  } as SearchCommandTypeParam,
  [SearchCommandType.Channel]: {
    key: 'channels',
  } as SearchCommandTypeParam,
}

export const textCommandMap = {
  from: SearchCommand.From,
  mentions: SearchCommand.Mentions,
  has: SearchCommand.Has,
  before: SearchCommand.Before,
  during: SearchCommand.During,
  after: SearchCommand.After,
  in: SearchCommand.In,
} as { [key: string]: SearchCommand }

export const searchCommandMetaList = [
  {
    name: SearchCommand.From,
    type: SearchCommandType.User,
    description: 'user',
    title: 'From User',
  },
  {
    name: SearchCommand.Mentions,
    type: SearchCommandType.User,
    description: 'user',
    title: 'Mentions User',
  },
  {
    name: SearchCommand.Has,
    type: SearchCommandType.Has,
    description: 'link, embed or file',
    title: 'Message contains',
  },
  {
    name: SearchCommand.Before,
    type: SearchCommandType.Date,
    description: 'specific date',
    title: '',
  },
  {
    name: SearchCommand.After,
    type: SearchCommandType.Date,
    description: 'specific date',
    title: '',
  },
  {
    name: SearchCommand.During,
    type: SearchCommandType.Date,
    description: 'specific date',
    title: '',
  },
  {
    name: SearchCommand.In,
    type: SearchCommandType.Channel,
    description: 'channel',
    title: 'In Channel',
  },
] as SearchCommandMeta[]

const searchResultGroupList = [
  {
    type: SearchResultGroupType.Messages,
    title: 'Messages',
    count: 5,
  },
  {
    type: SearchResultGroupType.Files,
    title: 'Files',
    count: 3,
  },
  {
    type: SearchResultGroupType.Channels,
    title: 'Channels',
    count: 0,
  },
  {
    type: SearchResultGroupType.People,
    title: 'People',
    count: 0,
  },
]

const SearchUtil = {
  getTextCommandMap: () => textCommandMap,
  getCommandTypeParams: () => searchCommandTypeParams,
  getCommandMetaList: () => searchCommandMetaList,
  getSearchResultGroupList: () => searchResultGroupList,
  /**
   * @method getCommandMeta DocsTODO
   * @description
   * @param command
   * @returns
   */
  getCommandMeta: (command: SearchCommand) => {
    let commandMeta = null
    searchCommandMetaList.every((item) => {
      if (item.name === command) {
        commandMeta = item
        return false
      }
      return true
    })
    return commandMeta
  },
  /**
   * @method getCommandTypeParam DocsTODO
   * @description
   * @param command
   * @returns
   */
  getCommandTypeParam: (command: SearchCommand) => {
    const commandMeta = SearchUtil.getCommandMeta(command)
    if (!commandMeta) {
      return false
    }
    const commandType = (commandMeta as SearchCommandMeta).type
    return searchCommandTypeParams[commandType] as SearchCommandTypeParam
  },
  /**
   * @method filterSearchRecommendResult DocsTODO
   * @description
   * @param recommends
   * @param queryItem
   * @returns
   */
  filterSearchRecommendResult(
    recommends: SearchRecommend,
    queryItem: SearchQueryItem | null,
  ): SearchRecommendResultItem[] {
    if (queryItem == null) {
      return [] as SearchRecommendResultItem[]
    }
    let commandRecommends
    if (queryItem.command === SearchCommand.Empty) {
      commandRecommends = [
        SearchCommand.From,
        SearchCommand.Mentions,
        SearchCommand.Has,
        SearchCommand.In,
      ]
    } else {
      commandRecommends = [queryItem.command]
    }
    const result = [] as SearchRecommendResultItem[]
    commandRecommends.every((command) => {
      const searchCommandTypeParam = SearchUtil.getCommandTypeParam(command)
      if (searchCommandTypeParam !== false) {
        const recommendItem =
          recommends[(searchCommandTypeParam as SearchCommandTypeParam).key]
        console.log(1, recommends, searchCommandTypeParam)
        if (recommendItem) {
          recommendItem.every((value) => {
            if (
              value.value
                .toLowerCase()
                .indexOf(queryItem.value.toLowerCase()) === 0
            ) {
              result.push({
                command,
                value,
              })
            }
            return true
          })
        }
      }
      return true
    })
    return result
  },
}

export default SearchUtil
