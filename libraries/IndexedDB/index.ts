import { db } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions, DateOptions } from '~/types/ui/query'
import { AccountsState } from '~/store/accounts/types'

export const searchMessage = async (
  accounts: AccountsState,
  queryOptions: QueryOptions,
  page: number = 1,
) => {
  const { friends, queryString, dateRange, orderBy } = queryOptions
  const addresses = friends.map((fItem: User) => fItem.address)

  let list: any[] = []

  let totalRows: number = 0

  const skip = (page - 1) * 10

  await db.transaction('rw', db.conversations1, () => {
    let results: any = db.conversations1.orderBy('at').reverse()

    if (orderBy === 'old') {
      results = results.reverse()
    }

    results = results
      .filter((message: any) => {
        return addresses.includes(message.address)
      })
      .filter((message: any) => {
        return validateItem(message, queryString, dateRange)
      })

    results.count((count: number) => {
      totalRows = count
    })

    results
      .offset(skip)
      .limit(10)
      .toArray()
      .then((messageArray: any) => {
        messageArray = messageArray.map((cItem: any) => {
          const user =
            accounts?.details?.textilePubkey === cItem?.from
              ? accounts.details
              : friends.find(
                  (fItem: User) => fItem.textilePubkey === cItem?.from,
                )

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
