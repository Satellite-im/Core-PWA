import {
  ConversationActivity,
  ConversationConnection,
  ConversationParticipant,
  ConversationState,
} from './types'
import { initialRootState } from '~/store/getters.test'
import * as module from '~/store/conversation/getters'

describe('misc', () => {
  const InitialConversationState: ConversationState = {
    id: '',
    type: 'friend',
    calling: false,
    participants: [],
  }

  test('otherParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: null, // This element in this array will not be this included because null
        profilePicture: 'profilePicture2',
        state: ConversationConnection.DISCONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] =
      module.default.otherParticipants(localState)

    expect(result).toMatchSnapshot()
  })

  test('onlineParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.DISCONNECTED, // This element in this array will not be this included because it is not CONNECTED (type)
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: 'name2',
        profilePicture: 'profilePicture2',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] = module.default.onlineParticipants(
      localState,
      { otherParticipants: argument },
    )

    expect(result).toMatchSnapshot()
  })

  test('typingParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.DISCONNECTED,
        activity: ConversationActivity.ACTIVE, // This element in this array will not be this included because it is not TYPING (type)
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: 'name2',
        profilePicture: 'profilePicture2',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.TYPING,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] = module.default.typingParticipants(
      localState,
      { otherParticipants: argument },
    )

    expect(result).toMatchSnapshot()
  })

  test('isGroup', () => {
    const localState = { ...InitialConversationState }
    const result = module.default.isGroup(localState)
    expect(result).toMatchSnapshot()
  })

  test('recipient', () => {
    const localState = { ...InitialConversationState }
    localState.id = '77baa97a-3fe5-408d-b773-2471d7a5f389'
    const localRootState = { ...initialRootState }
    localRootState.groups = {
      ...localRootState.groups,
      all: [
        {
          id: '77baa97a-3fe5-408d-b773-2471d7a5f389',
          address: 'consequuntur',
          name: 'Mary Leannon',
          admin: 'necessitatibus',
          creator: 'numquam quas ipsa',
          members: [
            {
              name: 'Eve Welch Sr.',
              photoHash:
                'Aut occaecati nam et. Sunt et ad vitae natus quasi illum est natus est. Enim aut itaque doloribus.',
              status:
                'Iste eveniet velit. Et illo natus optio deserunt eos eligendi quo sapiente quia. Eaque asperiores cupiditate.',
              address:
                'Possimus omnis est nesciunt a. Repellendus error voluptatem quisquam est aut consequatur. Sint eaque harum eligendi fuga earum. Rerum aliquam quia repellat aut maxime et magni dolores maiores.\n \rPossimus cupiditate repellendus est reprehenderit. Deleniti ab consequatur eligendi mollitia occaecati quas ab. Inventore vel dicta consequuntur commodi doloribus et quia omnis at.\n \rVoluptatem qui saepe nam. Quia dicta ut sequi. Sint omnis facere labore porro veritatis quod officiis qui. Minus qui voluptatibus.',
              peerId: 'reprehenderit',
            },
            {
              name: 'Maureen Bartell Sr.',
              photoHash: 'esse nam voluptatum',
              status: 'Est libero fuga debitis animi.',
              address:
                'Tempore molestiae ullam dolorem molestiae. Non beatae assumenda qui et aperiam hic aut delectus. Neque tempora voluptatibus soluta non maiores debitis voluptas excepturi rem. Dolores autem qui quia.\n \rPorro totam voluptas. Sit totam voluptatibus autem iste magni tempore dolorum velit. Esse aut mollitia id. Quaerat praesentium quos. Tempora fugit et eos et ratione.\n \rVoluptatem deleniti et facere quis dolorem dolore. Vel assumenda aperiam minima odio sint dicta ex nihil. Eligendi voluptas delectus.',
            },
            {
              name: 'Alana Hoeger',
              photoHash:
                'Minima velit debitis a ut enim fugit laboriosam. Corporis libero illo incidunt. Odio voluptatem et rerum. In aperiam pariatur. Vel aliquid incidunt nesciunt nihil ut deleniti est asperiores.',
              status: 'ut',
              address: 'iure',
            },
            {
              name: 'Betty Schiller',
              photoHash: 'Voluptas deserunt qui qui quibusdam.',
              status: 'Dolores dicta consequatur quidem neque iste.',
              address: 'Rerum beatae aliquam et.',
              peerId:
                'Et non adipisci perferendis nesciunt iusto et non rerum alias. Quas omnis est architecto odio quod. Enim cumque odit nihil esse nihil. Vero eum quaerat et atque. Illum reprehenderit magnam sed amet. Aspernatur doloribus et quas et voluptates ut.',
            },
            {
              name: 'Darlene Swift',
              photoHash: 'facere debitis quis',
              status:
                'Est voluptatem accusantium debitis est.\nCulpa quibusdam quia aut provident non fuga aut.',
              address:
                'Voluptates eaque occaecati. Iste quis eveniet. Sit est est provident et qui officiis esse.\n \rQui voluptas commodi mollitia ipsum cum. Repellat et voluptatem earum dicta. Autem nulla cupiditate veritatis non. Ea sapiente dignissimos nemo. Quia nulla aut commodi similique ad et explicabo. Fugit omnis et aut quod dolor consequatur in consequatur.\n \rHic ipsam nihil. Sunt aspernatur molestias iste labore repellendus velit. Id iure omnis neque quaerat optio deleniti exercitationem necessitatibus. Non fugiat laudantium quaerat iusto quo voluptas nihil ea. Inventore id error consequatur aut sit incidunt cumque fugit ut. Eos et aut animi dicta harum.',
            },
            {
              name: 'Allen Dietrich',
              photoHash:
                'Sunt voluptas quaerat. Porro mollitia quia facere. Ut minus alias. Voluptatem quidem aut blanditiis quidem.',
              status:
                'Dolor ipsam et eum corrupti. Cumque cum quis et incidunt quia qui. Repellat est corrupti similique molestiae quidem consequatur esse numquam magnam. Illum similique incidunt. Ducimus voluptas dignissimos et totam necessitatibus consequatur. Placeat atque nobis perspiciatis.\n \rEt aut ad quidem in debitis eos. Voluptatem sit molestias illo optio eum excepturi nihil quia itaque. Recusandae esse sunt quisquam exercitationem et. Non eaque in praesentium rem repellendus laboriosam. Cumque nostrum eum quae fugiat aut omnis dignissimos modi. Assumenda quae autem quis facere.\n \rEa ut et veritatis enim voluptate consequuntur magni quia ad. Totam est labore hic fugiat nisi. Perferendis ut vel ea vitae quo. Perferendis cumque mollitia autem beatae. Blanditiis voluptas deserunt quia praesentium amet recusandae nostrum et facere.',
              address: 'Quidem voluptatem et accusantium quia qui omnis.',
              peerId:
                'Voluptas est facere explicabo aut nesciunt modi nihil nobis. Minima est exercitationem dolorem dolore quis quaerat neque cum. Facere hic veniam at deleniti. Cumque non dolorem numquam beatae et sit aut error. Ex expedita excepturi totam accusamus accusantium et fugit ut libero. Quod enim reprehenderit est sed sunt assumenda consequatur rerum.',
            },
            {
              name: 'Emmanuel Bartoletti',
              photoHash:
                'Quia et provident itaque. Quod sit repellendus beatae rerum. Ab doloremque delectus quis.',
              status:
                'Quia labore esse totam aut cum maiores distinctio quibusdam sed.\nNon aut architecto.\nEst veniam assumenda qui voluptas molestiae ad commodi perspiciatis sed.\nConsequatur animi veniam.',
              address:
                'Cumque ullam inventore tempora qui voluptate tempora. Consequatur praesentium nulla voluptatem reiciendis numquam omnis veritatis ut necessitatibus.',
            },
            {
              name: 'Dr. Merlin Fahey',
              photoHash: 'ut',
              status:
                'Nihil reprehenderit tempora dignissimos et. Deserunt qui nesciunt excepturi iure repellat deleniti fugiat recusandae nobis. Aliquam adipisci ad voluptatem aut non nobis ipsam. Perferendis ab illum voluptas sed voluptate ipsa. Aliquam minus quis qui.',
              address:
                'Consequatur incidunt omnis voluptatibus exercitationem et.\nExplicabo repellat dolorem doloremque.\nId mollitia laudantium non sequi exercitationem.\nIusto nihil distinctio tenetur omnis ad qui provident.',
              peerId: 'Quod sed dolorem eligendi et veritatis dolor.',
            },
          ],
          addresses: [
            'Similique sunt eligendi possimus voluptas.\nOdio rerum aut non quam suscipit vero labore.\nDoloribus sequi quisquam qui.\nAut sapiente omnis perspiciatis animi voluptas.',
            'consectetur',
            'Nesciunt dolores sint alias voluptatem perferendis eaque in doloremque.',
            'id natus dolorem',
            'tempora impedit dolor',
            'Neque voluptatem vel labore dignissimos saepe et mollitia.',
            'Consequatur rerum repudiandae saepe asperiores nisi debitis. Quo laboriosam laudantium. Voluptatem omnis voluptate. Aliquam et qui sequi soluta laudantium.',
            'Explicabo qui totam earum aut blanditiis. Magni non facere dolorum nihil. Iusto ipsum officiis quos eligendi eius ad. Molestiae libero et vel incidunt tempore fuga.\n \rCupiditate blanditiis vel nihil ut aut. Quas illum aut voluptas sequi dolor non eum. Aperiam officiis nulla aliquam praesentium beatae. Harum velit facilis repellat et officiis. Voluptas rerum ad consectetur.\n \rDolor et voluptatem aliquam. Amet et culpa sit et dolorem nobis ut est. Necessitatibus libero consequatur.',
            'Magnam nobis consequatur fugiat velit sed illo qui beatae.',
          ],
          openInvites: true,
          encryptionKey:
            'Quo nesciunt quisquam amet perferendis molestiae alias aut ut voluptatem. Et laborum vel. Eveniet magnam magni quia id dolor quidem odit ut.',
          lastUpdate: 78280,
        },
      ],
    }

    const result = module.default.recipient(
      localState,
      { isGroup: true },
      localRootState,
    )
    expect(result).toMatchSnapshot()
  })

  test('recipient', () => {
    const localState = { ...InitialConversationState }
    localState.id = '77baa97a-3fe5-408d-b773-2471d7a5f389'
    const localRootState = { ...initialRootState }
    localRootState.friends = {
      incomingRequests: [
        {
          requestId: 'incomingRequestsItem0',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
          from: '',
          userInfo: {
            name: '',
            servers: {},
            status: '',
            photoHash: '',
          },
        },
      ],
      outgoingRequests: [
        {
          to: '',
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
          userInfo: {
            address: 'a',
            name: 'a',
            photoHash: 'a',
            status: 'a',
            bannerImageHash: 'a',
            extra1: 'a',
            extra2: 'a',
          },
        },
        {
          to: '',
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
          userInfo: {
            address: 'b',
            name: 'b',
            photoHash: 'b',
            status: 'b',
            bannerImageHash: 'b',
            extra1: 'b',
            extra2: 'b',
          },
        },
      ],
      all: [
        {
          publicKey: 'NoWiFi4you',
          localSypingState: 'NOT_TYPING',
          item: {},
          pending: true,
          activeChat: true,
          encryptedTextilePubkey: '',
          name: 'Taurus Nix',
          address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          account: {
            accountId: 'Checking Account',
            from: '.',
            status: 429,
            fromMailboxId: '12345',
            toMailboxId: 'v4.0.0-rc.4',
            to: './path/to/file',
          },
          textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          peerId: '77baa97a-3fe5-408d-b773-2471d7a5f389',
        },
      ],
    }

    const result = module.default.recipient(
      localState,
      { isGroup: false },
      localRootState,
    )
    expect(result).toMatchSnapshot()
  })
})
