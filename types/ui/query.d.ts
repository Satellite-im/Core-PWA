import { User } from './user'

export type QueryOptions = {
  queryString: string
  friends: User[]
  dateRange: DateOptions | null
}

export type DateOptions = {
  start: string
  end: string
}
