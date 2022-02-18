import { db } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions } from '~/types/ui/query'
import { AccountsState } from '~/store/accounts/types'

export const searchMessage = async (
  accounts: AccountsState,
  queryOptions: QueryOptions,
  page: number = 1,
) => {
  const { friends, queryString, dateRange } = queryOptions
  const addresses = friends.map((fItem: User) => fItem.address)

  let list: any[] = []

  let totalRows: number = 0

  const skip = (page - 1) * 10

  await db.conversations1
    .where('address')
    .anyOf(addresses)
    .and((message) => {
      return message.payload?.toLowerCase()?.includes(queryString.toLowerCase())
    })
    .count((count: number) => {
      totalRows = count
    })

  await db.conversations1
    .where('address')
    .anyOf(addresses)
    .and((message) => {
      return message.payload?.toLowerCase()?.includes(queryString.toLowerCase())
    })
    .offset(skip)
    .limit(10)
    .toArray()
    .then((messageArray) => {
      messageArray = messageArray.map((cItem) => {
        const user =
          accounts?.details?.textilePubkey === cItem?.from
            ? accounts.details
            : friends.find((fItem: User) => fItem.textilePubkey === cItem?.from)

        return {
          ...cItem,
          user: {
            name: user?.name,
            address: user?.address,
          },
        }
      })

      list = messageArray
    })

  return {
    data: {
      totalRows,
      list,
      perPage: 10,
      page,
    },
  }
}
