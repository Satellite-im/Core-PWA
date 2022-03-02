import 'fake-indexeddb/auto'
import * as idb from './index'
import { db } from '~/plugins/thirdparty/dexie'
import { RegistrationStatus } from '~/store/accounts/types'
import { QueryOptions } from '~/types/ui/query'

describe('', () => {
  test('', async () => {
    const argumentAccounts = {
      initialized: true,
      storePin: true,
      registry: true,
      loading: false,
      locked: true,
      pin: 'Minima consequatur necessitatibus. At fugiat illo illum aut libero possimus. Aut necessitatibus neque voluptate. Nulla impedit qui. Voluptas quia esse impedit accusantium excepturi doloribus magni similique. Quasi occaecati illo aut dolorum et asperiores.',
      pinHash:
        'Explicabo velit soluta modi dicta id quidem voluptas dolores. Vel aut vel ipsam. Necessitatibus quisquam atque quidem officiis veritatis et blanditiis sit vel. Laborum aperiam modi culpa tenetur sit aut veritatis. Ea velit rerum voluptatem esse tempora sunt nobis. Est vero dolorum.',
      active:
        'Alias dolorem porro error et.\nEx recusandae nam nihil laudantium aut.\nNeque repudiandae est natus.\nNam necessitatibus illum.\nError est non impedit voluptatum ab aut.',
      gasPrice:
        'Dignissimos itaque accusamus quia laboriosam cum repellendus ab.',
      phrase: 'Ab quo veniam sit inventore.',
      error: 'atque',
      encryptedPhrase:
        'Laborum explicabo soluta distinctio voluptatem sit veniam qui. Dolor ab est fugit voluptatum modi accusamus beatae provident sequi. Velit omnis in enim est commodi consectetur numquam autem autem. Aspernatur et nihil dolore corporis aspernatur enim.',
      registered: false,
      registrationStatus: RegistrationStatus.FUNDING_ACCOUNT,
      lastVisited: 'Rem pariatur molestiae numquam ea et vel iure.',
    }
    const argumentQueryOptions: QueryOptions = {
      queryString:
        'Pariatur inventore repudiandae quaerat ut. Velit unde nobis voluptatem. Nemo dolorem dolore ea aut est voluptates voluptate dolores. Ut consequatur ut ut enim et. Et veniam maiores aut cupiditate.',
      friends: [
        {
          name: 'Waldo Runte',
          address:
            'Voluptas possimus deleniti occaecati voluptas mollitia necessitatibus quisquam. Atque quas ab qui assumenda voluptatem nesciunt incidunt deleniti fugiat. Qui enim tempore. Eligendi et sunt sapiente natus fuga voluptate ut.',
          state: 'mobile',
          badge: 'verified',
          userAccount: '',
          lastUpdate: 79526,
        },
        {
          name: 'Runte Waldo',
          address:
            'Voluptas possimus deleniti occaecati voluptas mollitia necessitatibus quisquam. Atque quas ab qui assumenda voluptatem nesciunt incidunt deleniti fugiat. Qui enim tempore. Eligendi et sunt sapiente natus fuga voluptate ut.',
          state: 'mobile',
          badge: 'verified',
          userAccount: '',
          lastUpdate: 79526,
        },
      ],
      dateRange: {
        start:
          'Vel et ad facere rerum tenetur et. Est eos veritatis quas autem qui ea quas veritatis consequuntur. Ut praesentium occaecati aspernatur hic eum qui est consequatur. Expedita sunt ut. Et nemo omnis eveniet libero architecto ex.',
        end: 'Fugit quaerat qui ex soluta. Expedita et nostrum consequatur odio. Nam molestias alias ipsa sit est vel ratione enim vero. Tempora autem quod ipsa necessitatibus aut.\n \rVoluptatem vel excepturi odit dolore eligendi et aut dolorem distinctio. Aut magnam magni nihil dolores adipisci est occaecati adipisci. Suscipit sequi earum est. Impedit id consequatur nihil in. Minus ea aut mollitia tenetur quos voluptas aperiam aut.\n \rEt laudantium facere. Officiis alias dolorum consequatur eum ex odit vel. Recusandae neque perferendis omnis doloribus consequatur officiis.',
      },
    }

    db.conversations.bulkGet = jest.fn()

    const result = await idb.filterMessages(
      argumentAccounts,
      argumentQueryOptions,
    )
    expect(db.conversations.bulkGet).toHaveBeenCalled()
    console.log(result)
  })
})
