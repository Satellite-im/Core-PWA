import { db, DexieMessage } from '~/plugins/thirdparty/dexie'
import { User } from '~/types/ui/user'
import { QueryOptions } from '~/types/ui/query'

export const searchMessage = async (
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
    const user = friends.find((fItem: User) => fItem.address === mItem?.key)
    mItem?.conversation.forEach((cItem) => {
      newResult.push({
        ...cItem,
        user: {
          name: user?.name,
          address: user?.address,
        },
      })
    })
  })

  const result = newResult.filter((item) => {
    if (item.payload.includes(queryString)) {
      if (dateRange) {
        const queryDate = new Date(dateRange).setHours(0, 0, 0, 0)
        const iDate = new Date(item.at).setHours(0, 0, 0, 0)
        console.log(queryDate, iDate)
        if (queryDate === iDate) {
          return item
        }
      } else {
        return item
      }
    }
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
