import { User } from './user'

export type QueryOptions = {
  queryString: string
  friends: User[]
  dateRange: string
}
