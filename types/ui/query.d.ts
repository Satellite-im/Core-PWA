import { User } from './user'

export type QueryOptions = {
  queryString: string
  friends: User[]
  dateRange: DateOptions | null
  orderBy: string
}

export type DateOptions = {
  start: string
  end: string
}
