import getUnixTime from 'date-fns/getUnixTime'
import SearchIndex from '~/libraries/SearchIndex'
import { db } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions } from '~/types/ui/query'
import { AccountsState } from '~/store/accounts/types'

export const searchIndex = new SearchIndex({
  ref: 'id',
  fields: ['payload'],
})

export const filterMessages = async (
  accounts: AccountsState,
  queryOptions: QueryOptions,
  page: number = 1,
  perPage: number = 10,
) => {
  const { friends, queryString, dateRange } = queryOptions
  const addresses = friends.map((fItem: User) => fItem.address)
  const startDate =
    dateRange && getUnixTime(new Date(dateRange.start).setHours(0, 0, 0, 0))
  const endDate =
    dateRange && getUnixTime(new Date(dateRange.end).setHours(23, 59, 59, 999))
  const convos = (await db.conversations.bulkGet(addresses)) || []
  const messages = convos.reduce((acc: any[], item: any) => {
    const user =
      accounts?.details?.textilePubkey === item?.from
        ? accounts.details
        : friends.find((fItem: User) => fItem.textilePubkey === item?.from)
    item?.conversation
      .filter((message: any) => {
        if (startDate && endDate) {
          const time = getUnixTime(new Date(message?.date))
          return time >= startDate && time <= endDate
        }
        return true
      })
      .forEach((message: any) => {
        acc.push({
          ...message,
          user: {
            name: user?.name,
            address: user?.address,
          },
        })
      })
    return acc
  }, [])
  searchIndex.update(messages)

  const results = searchIndex.search(queryString)
  const result = results?.reduce((acc: any[], item: any) => {
    return [...acc, messages.find((m: any) => m.id === item.ref)]
  }, [])
  const skip = (page - 1) * perPage

  return {
    data: {
      totalRows: result?.length,
      list: result?.splice(skip, perPage),
      perPage,
      page,
    },
  }
}
