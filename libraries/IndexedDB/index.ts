import { db } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions, DateOptions } from '~/types/ui/query'
import { AccountsState } from '~/store/accounts/types'

export const searchMessage = async (
  accounts: AccountsState,
  queryOptions: QueryOptions,
  page: number = 1,
) => {
  console.log('queryOptions: ', queryOptions)
  const { friends, queryString, dateRange } = queryOptions
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
    .sort((item1, item2) => item2.at - item1.at)
    .filter((item) => {
      return validateItem(item, queryString, dateRange)
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

const validateItem = (
  item: any,
  queryString: string,
  dateRange: DateOptions | null,
) => {
  const iDate = new Date(item.at)
  if (
    !queryString.includes(':') &&
    item.payload?.toLowerCase()?.includes(queryString.toLowerCase())
  ) {
    if (dateRange) {
      const startDate = new Date(dateRange.start).setUTCHours(0, 0, 0, 0)
      const endDate =
        dateRange.start < dateRange.end
          ? new Date(dateRange.end).setUTCHours(0, 0, 0, 0)
          : new Date(dateRange.end).setUTCHours(23, 59, 59, 999)

      if (startDate <= iDate.getTime() && iDate.getTime() <= endDate) {
        return item
      }
    } else {
      return item
    }
  } else if (queryString.includes('before:')) {
    const beforeDate = new Date(queryString.split(':')[1])
    if (beforeDate && beforeDate.getTime() >= iDate.getTime()) {
      return item
    }
  } else if (queryString.includes('after:')) {
    const afterDate = new Date(queryString.split(':')[1])
    if (afterDate && afterDate.getTime() <= iDate.getTime()) {
      return item
    }
  } else if (queryString.includes('during:')) {
    const duringDates = queryString.split(':')[1]
    const startDate = new Date(duringDates.split('~')[0]).setUTCHours(
      0,
      0,
      0,
      0,
    )
    const endDate = new Date(duringDates.split('~')[1]).setUTCHours(
      23,
      59,
      59,
      999,
    )

    if (
      startDate &&
      endDate &&
      startDate <= iDate.getTime() &&
      iDate.getTime() <= endDate
    ) {
      return item
    }
  }
  return false
}
