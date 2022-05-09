import { MatchInfo } from 'minisearch'
import { MessageTypes } from '../textile/mailbox'
import { Friend } from '../ui/friends'
import { User } from '../ui/user'

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
  Embed = 'embed',
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

export type SearchUser = {
  name: string
  value: string
  address: string
  avatar?: string
}

export type SearchChannel = {
  name: string
  value: string
  address: string
}

export type SearchOption = {
  name?: string
  address?: string
  avatar?: string
  key: string
  value: string
}

export type SearchRecommend = {
  [key: string]: SearchOption[]
}

export type SearchRecommendResultItem = {
  command: SearchCommand
  value: SearchUser | SearchChannel | SearchOption
}

export type CalendarDateType = {
  id: string
}

export type SearchCommandTypeParam = {
  key: string
  values?: any[]
  options?: any[]
}

export type SearchCommandMeta = {
  name: SearchCommand
  type: SearchCommandType
  description: string
  title: string
}

export type SearchPageInfo = {
  totalRows: number
  perPage: number
  pageIndex: number
}

export type SearchResultItem = {
  id: string
  at: number
  type: string
  user?: User
}

export type SearchData = {
  pageInfo: SearchPageInfo
  list: SearchResultItem[]
}

export enum SearchResultGroupType {
  Messages = 'messages',
  Files = 'files',
  Channels = 'channels',
  People = 'people',
}

export enum SearchFilterType {
  From = 'from',
  Date = 'date',
}

export type SearchFilter = {
  key: string
  value: string
}

export enum SearchOrderType {
  New = 'new',
  Old = 'old',
  Relevant = 'relevant',
}

export type SearchParam = {
  query: string
  groupby: SearchResultGroupType
  filters: SearchFilter[]
  orderby: SearchOrderType
}

export interface UISearchResultData {
  at: number
  conversation: string
  from: string
  id: string
  match: MatchInfo
  payload: 'ay'
  readAt: number
  score: number
  terms: string[]
  to: string
  type: MessageTypes
  user?: User
}

export interface UISearchResult {
  data: UISearchResultData[]
  totalRows: number
}

export type DateOptions = {
  start: string
  end: string
}

export type QueryOptions = {
  queryString: string
  accounts: Friend[]
  dateRange: DateOptions | null
  perPage: number
}

export enum MatchTypesEnum {
  ID = 'id',
  CONVERSATION = 'conversation',
  FROM = 'from',
  TO = 'to',
  AT = 'at',
  READ_AT = 'readAt',
  TYPE = 'type',
  PAYLOAD = 'payload',
}
