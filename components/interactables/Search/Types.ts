export enum SearchCommandType {
  User = 'user',
  Has = 'has',
  Date = 'date',
  Channel = 'channel',
}

export enum SearchCommand {
  Empty = '',
  From = 'from',
  Mentions = 'mentions',
  Has = 'has',
  Before = 'before',
  During = 'during',
  After = 'after',
  In = 'in',
}

export enum SearchValueHas {
  Link = 'link',
  Embeded = 'embeded',
  File = 'file',
  Video = 'video',
  Image = 'image',
  Sound = 'sound',
}

export type SearchQueryItem = {
  command: SearchCommand
  value: string
  index: number
  cursorStart: number
  cursorEnd: number
}

export type SearchResultItem = {
  command: SearchCommand
  value: string
}

export type CalendarDateType = {
  id: string
}

export const SearchCommandTypeParams = {
  [SearchCommandType.User]: {},
  [SearchCommandType.Has]: {
    values: [
      SearchValueHas.Link,
      SearchValueHas.Embeded,
      SearchValueHas.File,
      SearchValueHas.Video,
      SearchValueHas.Image,
      SearchValueHas.Sound,
    ],
    options: [
      { key: SearchValueHas.Link, value: 'link' },
      { key: SearchValueHas.Embeded, value: 'embeded' },
      { key: SearchValueHas.File, value: 'file' },
      { key: SearchValueHas.Video, value: 'video' },
      { key: SearchValueHas.Image, value: 'image' },
      { key: SearchValueHas.Sound, value: 'sound' },
    ],
  },
  [SearchCommandType.Date]: {},
  [SearchCommandType.Channel]: {},
}

export const TextCommandMap = {
  from: SearchCommand.From,
  mentions: SearchCommand.Mentions,
  has: SearchCommand.Has,
  before: SearchCommand.Before,
  during: SearchCommand.During,
  after: SearchCommand.After,
  in: SearchCommand.In,
} as { [key: string]: SearchCommand }

export const SearchCommandList = [
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
    description: 'link,embed or file',
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
]

export const SearchItemList = [
  {
    command: SearchCommand.From,
    value: 'Aling',
  },
  {
    command: SearchCommand.From,
    value: 'Alo',
  },
  {
    command: SearchCommand.From,
    value: 'Gram',
  },
  {
    command: SearchCommand.From,
    value: 'Tillow',
  },
  {
    command: SearchCommand.From,
    value: 'xow',
  },
  {
    command: SearchCommand.From,
    value: 'pqw',
  },
  {
    command: SearchCommand.Mentions,
    value: 'Zpw',
  },
  {
    command: SearchCommand.Mentions,
    value: 'Txs',
  },
  {
    command: SearchCommand.Mentions,
    value: 'abc',
  },
  {
    command: SearchCommand.Mentions,
    value: 'Prow',
  },
  {
    command: SearchCommand.In,
    value: 'Access',
  },
  {
    command: SearchCommand.In,
    value: 'Bright',
  },
  {
    command: SearchCommand.In,
    value: 'Wowa',
  },
]
