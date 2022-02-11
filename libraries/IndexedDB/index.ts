import { db } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions } from '~/types/ui/query'
import { AccountsState } from '~/store/accounts/types'

export const searchMessage = async (
  accounts: AccountsState,
  queryOptions: QueryOptions,
  page: number = 1,
) => {
  console.log('queryOptions: ', queryOptions)
  const { friends, queryString, dateRange, orderBy } = queryOptions
  const addresses = friends.map((fItem: User) => fItem.address)
  const dbMessages = await db.conversations.bulkGet(addresses)

  const newResult: any[] = []

  console.log('dateRange: ', dateRange)
  dbMessages?.forEach((mItem) => {
    mItem?.conversation.forEach((cItem) => {
      /* get user info with textilePubkey instead of address */
      const user =
        accounts?.details?.textilePubkey === cItem?.from
          ? accounts.details
          : friends.find((fItem: User) => fItem.textilePubkey === cItem?.from)
      newResult.push({
        ...cItem,
        user: {
          name: user?.name,
          address: user?.address,
        },
      })
    })
  })

  const result = newResult
    .sort((item1, item2) =>
      orderBy === 'new'
        ? item2.at - item1.at
        : orderBy === 'old'
        ? item1.at - item2.at
        : item1.at,
    )
    .filter((item) => {
      if (item.payload?.toLowerCase()?.includes(queryString.toLowerCase())) {
        if (dateRange) {
          const startDate = new Date(dateRange.start).setHours(0, 0, 0, 0)
          const endDate =
            dateRange.start < dateRange.end
              ? new Date(dateRange.end).setHours(0, 0, 0, 0)
              : new Date(dateRange.end).setHours(23, 59, 59, 999)
          const iDate = new Date(item.at)
          if (startDate <= iDate.getTime() && iDate.getTime() <= endDate) {
            return item
          }
        } else {
          return item
        }
      }
      return false
    })

  const skip = (page - 1) * 10

  return {
    data: {
      totalRows: result.length,
      list: result.splice(skip, 10),
      perPage: 10,
      page,
    },
  }
}
