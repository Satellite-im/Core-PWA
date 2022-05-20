import Vue from 'vue'
import * as module from './actions'
import { GroupsError } from './types'
import { Config } from '~/config'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import TextileManager from '~/libraries/Textile/TextileManager'

Vue.prototype.$Config = Config
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$SolanaManager = new SolanaManager()

// Commented out for later use in mocking the Solana program(s) functions.
// const fakePutMetricData = jest.fn()
// const FakeCloudWatch = jest.fn(() => ({
//   putMetricData: fakePutMetricData,
// }))

// GroupChatsProgram = FakeCloudWatch;

describe('', () => {
  const GroupsInitialState = {
    all: [
      {
        id: '7e572397-ffca-402b-92d6-83cb500d10ef',
        name: 'Dr. Tess Brown',
        admin: 'eius dicta delectus',
        creator:
          'Consequatur harum accusamus est sint provident. Ex esse doloremque ea. Est voluptatum aliquid voluptatibus tempora.\n \rAmet omnis omnis maiores autem. Natus vel sint possimus quos earum ut. Non iusto necessitatibus sit aut.\n \rEst suscipit optio velit sunt eos. Aut voluptate voluptas. Et ut explicabo voluptatum nisi.',
        members: [
          {
            name: 'Edwardo Terry',
            photoHash:
              'Rerum quia consequatur rerum assumenda hic assumenda. Voluptas et itaque eaque voluptate. Ut eligendi voluptate eaque in dolores qui qui quia quis. Esse sed aut est. Quo hic nam quae repellendus quas laboriosam culpa ut praesentium.\n \rEius corporis aut voluptatem est ipsam. Ut qui non aut voluptatem unde et deleniti deserunt. Labore quis est voluptatem. Officia necessitatibus animi nulla quos id est id quibusdam. Ipsa animi illo ducimus dolorum enim modi.\n \rVoluptates deserunt corrupti. Autem eligendi quasi asperiores voluptatem ut sit et pariatur quod. Vel minus debitis aut illum sed cumque ut.',
            status:
              'Ut ab omnis numquam et suscipit sequi. Explicabo earum aut. Aut alias reiciendis. Fugiat debitis eos tenetur. Qui ipsum deserunt qui ea itaque in neque eum. Ut ab nisi alias.',
            address:
              'Esse asperiores dolorem et repellat adipisci ipsum. Sunt neque excepturi. Earum nemo mollitia.',
          },
          {
            name: 'Savanah Crona MD',
            photoHash: 'est',
            status:
              'Neque vel quia. Earum eos in animi assumenda. Rerum perferendis nobis voluptatem distinctio. Ea occaecati et repellendus numquam aut assumenda.\n \rAliquam quasi voluptatem et velit accusamus temporibus quas aut voluptatem. Et explicabo adipisci veritatis adipisci. Voluptas omnis soluta nemo eaque cumque dolor.\n \rPerferendis et reiciendis iure suscipit est quia tempore. Inventore est nisi doloremque incidunt sequi consequatur velit. Ab voluptas nisi deserunt doloribus. Est est et quae ducimus repellendus dolore. Qui blanditiis hic ratione et ratione velit sunt.',
            address:
              'Id blanditiis quas voluptatibus a repellat soluta. Repellat repellendus assumenda expedita fuga. Possimus dicta earum eligendi aperiam repellendus. Occaecati autem est. Cupiditate odit error dolorum.',
          },
          {
            name: 'Maiya Sauer V',
            photoHash:
              'Ipsam aut dolor facilis sit consequatur. Optio eum quod rerum vel dolor dignissimos tenetur. Dolorem non architecto omnis accusantium quas blanditiis fuga.',
            status:
              'Dolorem voluptas dicta et harum ratione ipsa ipsa dolores blanditiis. Iste sapiente voluptate harum voluptatem. Dolores iure corrupti vel. Et modi debitis voluptas soluta. Aut soluta natus.',
            address: 'consequatur amet at',
          },
          {
            name: 'Oma Cormier',
            photoHash:
              'Eos iusto quod perferendis et autem. Pariatur facilis quia culpa tenetur optio non.',
            status: 'dignissimos',
            address: 'consectetur nihil ratione',
          },
          {
            name: 'Yasmin Bradtke',
            photoHash:
              'Quia veritatis quia. Qui tenetur ullam cum eum corporis non voluptatem ducimus. Natus pariatur ut dolores. Voluptatem optio voluptas et.\n \rConsequuntur et qui numquam sint. Dicta quis accusantium possimus. Ullam rerum qui vero eaque debitis tenetur. Id culpa nemo necessitatibus enim nobis repellendus vel est explicabo. Eos iste accusamus labore earum fuga. Delectus corrupti et quae hic aut aut sit.\n \rOfficiis qui ea quasi qui modi. Unde deleniti laboriosam. Autem minus excepturi aliquam. At pariatur et impedit aut nobis at. Ex maxime fuga odio dolorum.',
            status:
              'Reprehenderit aut facere et accusantium libero. Laudantium enim odio qui aut ut adipisci.',
            address: 'suscipit sapiente facilis',
          },
          {
            name: 'Clementina Jast',
            photoHash:
              'Incidunt sunt soluta repudiandae quia quas harum at vel. Voluptas totam laborum. Consequatur corporis voluptas repudiandae adipisci architecto maxime eaque qui error. Voluptatum perspiciatis nam. Magni iste vel vel minima molestias accusamus. Voluptas sed eos rerum qui ullam.\n \rQuidem aut qui aut pariatur iste saepe labore veritatis consectetur. Tenetur voluptatem hic earum dolor aut modi et autem cumque. Odit iste corporis.\n \rCorporis incidunt nobis facilis vel sit fuga. Nostrum non doloribus. Nemo eum sed corrupti laborum quisquam sunt commodi perspiciatis. Porro nam aliquid voluptas ea qui impedit sunt.',
            status: 'similique placeat suscipit',
            address:
              'Reiciendis nobis quae id ducimus molestiae deleniti error unde odio.',
          },
          {
            name: 'Kenna Miller',
            photoHash:
              'Pariatur omnis adipisci quo tempore. In quasi qui velit non. Fugit a cupiditate ea incidunt. Eaque a at quas. Autem fugiat et et voluptatem voluptatem ut.',
            status:
              'Autem odit fugit qui nulla iure. Ut optio maxime itaque magni. Libero odit reiciendis nostrum velit. Reiciendis commodi nostrum omnis deserunt dolor quaerat.\n \rVeritatis at aliquid quaerat mollitia. Alias totam impedit aut aperiam nemo recusandae. Neque magnam corrupti qui aut natus sit. Hic accusantium rerum est eius quia libero voluptatem. Quae explicabo explicabo nostrum earum.\n \rUt eum rerum dolores rerum maiores quia voluptas. Vitae deleniti id. Sunt ducimus perspiciatis rerum ut sed veritatis in. Iusto minima nemo ducimus eveniet est.',
            address:
              'Dolorem in sapiente recusandae qui vel sunt consequatur et. Quis quia et ratione et. Et unde exercitationem nisi et exercitationem ipsum. Consectetur et vero qui.',
          },
          {
            name: 'Alanis Blick',
            photoHash: 'aliquid delectus ut',
            status: 'quae',
            address:
              'Ea voluptatum laboriosam dignissimos sint libero. Accusamus magni quod nisi sed iusto harum non enim. Culpa veritatis et minus et nostrum sunt dolores. Molestiae ut minus sint autem quam et dicta. Sint fugit quia reprehenderit eum dolorem non eveniet magni. Tenetur quo sapiente sint sit magni.',
          },
          {
            name: 'Luis Schulist',
            photoHash: 'quam',
            status: 'sequi sit voluptas',
            address: 'dolorem',
          },
          {
            name: 'Juanita Weimann',
            photoHash: 'Delectus omnis saepe sint fugit.',
            status: 'Libero velit temporibus doloremque culpa.',
            address:
              'Est repudiandae pariatur neque ut iure modi. Quas fugiat quasi autem voluptas repellat voluptas ut. Minus esse eaque. Consectetur consequatur et qui debitis non. Suscipit nostrum et consequuntur rerum in cupiditate illo veniam.',
          },
        ],
        addresses: [
          'Sunt quae vel placeat architecto numquam odit.',
          'architecto',
          'sit',
          'sunt',
          'Aut amet labore qui rem est quia dolor in atque. Voluptas vel similique. Id consectetur nemo quos magnam. Velit nam ad aut placeat eos dolores soluta. Voluptatem provident labore ipsum possimus hic asperiores ipsam. Autem iusto quo.\n \rDolor rem aut autem enim fugit sit vel minima illo. Maiores tenetur suscipit autem. Sunt excepturi placeat qui dicta vitae voluptate.\n \rExpedita tempore aut cumque. Vel quasi tempora iusto corrupti tenetur praesentium et. Aut consequatur modi.',
        ],
        openInvites: true,
        encryptionKey: 'cum ratione quis',
        lastUpdate: 53958,
      },
      {
        id: 'f02bf7b0-4c8d-4bf4-af63-9ae9c3f8c54e',
        name: 'Jarret Gleichner',
        admin:
          'Rerum quaerat dolores adipisci molestiae. Nihil qui repellendus voluptatem et et beatae voluptas consequuntur. Est officiis ut sit et. Hic aliquam modi rerum consectetur et modi nobis.',
        creator: 'rerum',
        members: [
          {
            name: 'Dimitri Schinner',
            photoHash: 'rerum',
            status:
              'Nobis omnis consequuntur quibusdam rerum ipsam aut corrupti ad quidem.\nVel odio et tempore maiores.\nNostrum minus quisquam distinctio.',
            address:
              'Reiciendis non alias atque ut illo quod necessitatibus qui. Ratione perspiciatis sit impedit.',
          },
          {
            name: 'Lincoln Vandervort Sr.',
            photoHash:
              'Mollitia et autem sit illum odio neque. Sed perspiciatis rerum in et ut id inventore ut. Blanditiis enim nam non. Voluptatem suscipit culpa est minima aut molestiae voluptas architecto praesentium. Vel at dignissimos dolores. Qui cupiditate in labore cum non consectetur ducimus optio ipsum.\n \rExcepturi perspiciatis natus aliquid alias ea. Officia sunt non distinctio earum inventore. Dolores cupiditate ipsam. Sed totam qui aut esse.\n \rVoluptates veritatis nemo tenetur maiores voluptatem qui. Et excepturi officiis rem et. Hic rerum ipsum ut perferendis eveniet voluptatem officiis. Assumenda deserunt porro. Ut consequatur et ut consequuntur aut fugiat rerum sequi recusandae.',
            status: 'dolores',
            address: 'Culpa et dolores ipsum.',
          },
        ],
        addresses: [
          'Aut et molestiae optio quia magnam tempore. Velit est laboriosam excepturi. Rerum itaque consequuntur sint autem voluptatibus voluptatem asperiores iure dolor.',
          'neque',
          'ipsum',
          'Incidunt minima at sed voluptatem. Unde tempora impedit deleniti maiores vel ab. Sint eos sint aut libero nisi quia ullam labore.\n \rVoluptatibus doloremque nisi dolore voluptatem consequuntur eos magni. Nulla error labore expedita et enim nihil sapiente aut ipsam. Ea in culpa qui.\n \rVitae architecto quis quibusdam ipsum aut. Provident voluptatem sint et. Consequatur ut dicta delectus corporis labore aut omnis. Sunt sequi minima. Fugiat pariatur voluptatem et minima modi occaecati. Autem aut officia illo quasi quo ut magni tempora aperiam.',
          'dolorum sed voluptatem',
          'Qui rem assumenda dolorem sequi sed eum animi. Dolorem ea voluptatem sint fuga. Animi enim minima neque incidunt veritatis sed tempora.',
          'Reiciendis veniam et. Consequatur cum tempora eos qui explicabo. Sint esse perspiciatis ab illum dignissimos. Voluptas quia asperiores rerum iste. Quia minima facilis qui vel labore quaerat officiis commodi.\n \rReprehenderit vitae facilis est. Assumenda ipsam est. Quaerat nesciunt ipsum labore tenetur. Non porro rerum repudiandae. Amet neque ab omnis hic distinctio amet repudiandae nemo.\n \rFugit cupiditate repudiandae qui ut quo expedita voluptatem enim rerum. Et deleniti tempora maiores. Ut accusantium consequatur adipisci illum rem illum. Beatae unde accusantium ab consectetur consequatur voluptatum ex.',
          'Laudantium qui a. Maxime omnis qui qui alias aut sunt. Labore officia delectus commodi sit. Rerum dolores quo omnis sit voluptatem. Aliquam sed ut dolor et enim voluptatibus aspernatur et molestiae. Quia non quo tempore unde incidunt.',
          'voluptas officia ut',
          'Ipsa id quasi. Maxime quia exercitationem distinctio aut. Qui neque mollitia ratione labore voluptate enim optio ipsum accusantium. Soluta temporibus dolor incidunt.',
        ],
        openInvites: false,
        encryptionKey: 'Sunt earum recusandae.',
        lastUpdate: 73408,
      },
      {
        id: 'c1fd86f1-000d-4e6f-b916-0da20dd2fa00',
        name: 'Mckayla Bergstrom',
        admin:
          'Et blanditiis autem iusto qui ab. Enim inventore itaque tempore suscipit voluptate consequatur. Mollitia atque corrupti minus quo. Beatae maxime id illo esse quod laboriosam eveniet beatae.\n \rSunt consectetur quibusdam quam architecto. Aspernatur et sunt iste. Deleniti porro voluptates et eum quo eligendi iusto autem temporibus. Libero est est consequatur quis a tempora.\n \rSunt non minima voluptatibus nemo ut. Quia et consectetur debitis. Doloremque nobis facilis.',
        creator:
          'Excepturi totam blanditiis non sed. Quo quam quo temporibus et non animi. Fugit non voluptas ut est cupiditate.\n \rQuam ut quia nihil qui dolor repellat. Omnis architecto culpa molestiae natus ut molestiae doloribus. Vel reiciendis explicabo.\n \rRerum est iusto eligendi vitae et minus. Sapiente aliquid aut voluptatibus. In voluptatibus mollitia et voluptatum libero. Id tempora nulla nulla laborum eos. Nemo reiciendis voluptas doloremque nihil sit sint corrupti.',
        members: [
          {
            name: 'Annalise Little',
            photoHash:
              'Ullam voluptate omnis est unde excepturi hic qui earum ad. Omnis ut dolor neque et architecto eum laborum.',
            status:
              'Soluta voluptatibus molestias rerum accusantium repellat cum. Cum exercitationem quam temporibus cumque similique sapiente aut.',
            address: 'maiores consequatur non',
          },
          {
            name: 'Dr. Arvel Bauch',
            photoHash:
              'Rem iste porro unde porro ratione distinctio. In amet aspernatur sed odio a eaque. Labore necessitatibus reprehenderit at quia ullam nobis nostrum maiores aperiam. Qui quis aut quod quaerat corrupti.',
            status: 'Velit pariatur quod ut voluptas laudantium enim.',
            address:
              'Molestiae voluptatum non nobis dolorem consectetur sequi.\nHic aliquid voluptatem itaque odit quia sed eius similique aut.\nEt est molestiae.\nNon iste optio nemo aut harum.\nOccaecati dolor aut odio sit commodi exercitationem aut ea quo.',
          },
          {
            name: 'Lexie Herman',
            photoHash:
              'Eius qui et incidunt consequatur rem id.\nEos autem earum sequi.',
            status:
              'Vel vel aut nihil. Velit quisquam corrupti repudiandae. Qui beatae porro aliquam aliquam sequi rem cupiditate quo sunt. Nam eligendi qui.\n \rExpedita reprehenderit eligendi enim amet mollitia numquam. Beatae odio expedita tenetur esse ut quia quia laborum voluptas. Rem aspernatur debitis quia illum sunt rerum rerum. A eum quisquam exercitationem ut cupiditate accusantium quis. Nihil quo recusandae distinctio.\n \rTemporibus et quia praesentium. Et quo consequuntur ea. Aliquid veniam quidem enim doloribus qui eos consequatur. Quo molestiae modi delectus quaerat. Ut fugit eius voluptatum ut suscipit maiores reiciendis quas fuga.',
            address:
              'Dolores qui dolorem tenetur incidunt libero omnis consequatur. Quos officia id doloremque aliquam nihil. Porro explicabo temporibus. Odio error eos dolorum qui recusandae ullam commodi. Ad amet aut eligendi soluta eius. Quidem ratione quos aut delectus dolores est cumque est.',
          },
          {
            name: 'Giovani Bergnaum',
            photoHash: 'et',
            status: 'aut',
            address:
              'Consequuntur sunt neque recusandae in est vero. Omnis facere eos qui et. Ducimus ratione sunt expedita eaque quas rerum delectus.',
          },
          {
            name: 'Abigayle Cruickshank',
            photoHash:
              'Qui quo autem est ratione voluptatem facilis.\nLibero aut nesciunt quidem nesciunt et in dolorem quos modi.',
            status: 'Molestiae et nobis.',
            address:
              'Sint maxime quas aut ut neque earum dolore atque. Est quia aut maiores. Delectus nulla autem autem in ut architecto velit.',
          },
          {
            name: 'Nannie Ledner',
            photoHash: 'rerum',
            status:
              'Voluptatem aut doloremque et iure ea quo. At incidunt ratione. Molestias quo dolores ex dolor. Qui aut aut eos. Quibusdam ea consequatur. Veritatis officiis eos qui rerum et qui at.',
            address: 'ad',
          },
          {
            name: 'Gilbert Rice',
            photoHash:
              'Ut exercitationem consequuntur et voluptate error omnis ad. Voluptatem blanditiis sint veritatis. Id ducimus consequatur soluta iste atque. Voluptatibus fuga aut velit eius laudantium.',
            status:
              'Nobis adipisci neque porro ipsa asperiores repellendus. Vero est dolore facere enim possimus laborum. Qui suscipit corporis veniam repellendus non quis hic alias et.',
            address:
              'Est tenetur aut illum impedit maiores corporis magnam excepturi.',
          },
          {
            name: 'Mr. Veda Homenick',
            photoHash:
              'Officia hic suscipit officia delectus voluptatem qui.\nAliquid voluptatibus quae iste eum et.\nVoluptatem dolorem qui doloremque ipsum sunt.\nNesciunt dolorem dolorum molestiae.',
            status:
              'Pariatur et maxime et sit voluptatum.\nProvident provident quaerat commodi et rerum placeat in sed.\nNecessitatibus vero omnis id.\nAtque molestias aut aut et.',
            address:
              'Ipsa animi et molestiae fuga voluptatem labore quibusdam hic.\nIpsa vero repudiandae repellat et quo atque sunt qui ducimus.\nAspernatur nihil repellat et quibusdam dicta sed ipsum aut dignissimos.\nVel est iste est atque veniam ut.',
          },
          {
            name: 'Vince Bartell',
            photoHash:
              'Ut tempora nihil. Porro et vero similique est ipsam voluptates consequatur dolor. Facere voluptatem totam vero provident reiciendis qui impedit.\n \rUt qui dolorem delectus pariatur voluptatem vitae aut. Magni saepe nihil ut accusantium qui dolorem. Recusandae provident expedita delectus consectetur est minus corporis.\n \rDolor eligendi quae eos sit odit laboriosam quia. Eum iure praesentium excepturi. Sit possimus nobis iure harum nulla minima in. Veritatis et impedit occaecati et sit. Quas ut et natus sit eveniet quis ab odit impedit. Eaque atque officiis nesciunt mollitia.',
            status:
              'Quos quibusdam consequatur sunt. Et sed voluptas. Tempora temporibus dolores ut odio. Facere incidunt eaque et. Dolores vel et.\n \rDebitis et et. Et vel nobis impedit beatae. Consequatur magni architecto voluptas. Delectus atque voluptatem deserunt molestias aut iure pariatur et est. Illo voluptatibus eum quo perspiciatis mollitia. At hic ipsam est nobis et.\n \rFuga labore et fuga odio porro voluptatem. Enim ratione laboriosam maiores non tempore eveniet voluptas voluptatum. Ratione quam qui. Recusandae adipisci sed.',
            address: 'quidem sed hic',
          },
          {
            name: 'Wilford Reinger',
            photoHash:
              'Itaque adipisci est ut velit quis quis sunt sit. Eligendi nam dolores eius. Similique rerum id iusto est. Est delectus provident nisi. Enim error earum ut. Eos amet quod non.\n \rReprehenderit quas sint id temporibus eum consectetur sed cumque ipsam. Aut eos quis ratione est. Ut cupiditate eligendi praesentium voluptas esse ut minima maiores reiciendis. Modi non consequatur non ratione quis quia dolorum repudiandae.\n \rUt voluptatem quisquam ut rerum. Quis nesciunt qui laborum unde consectetur. Est non consequuntur non cum eveniet et ut corporis voluptatem.',
            status: 'maiores eum et',
            address: 'Aperiam repudiandae velit consequuntur velit.',
          },
        ],
        addresses: [
          'Non vel sint nihil sunt ut odit est ea. Qui quo eaque alias sit ipsum quia. Ut laboriosam libero ut voluptatem totam reiciendis ipsum deleniti. Exercitationem repudiandae ullam tempora et pariatur omnis accusantium.',
          'Doloribus et blanditiis molestiae fugit quo error excepturi repellat. Similique sit debitis temporibus dolorem. Ut id et. Est dolore libero.\n \rExplicabo aut quisquam. Eligendi consectetur sapiente deserunt ex qui modi sunt ut quis. Qui fugiat ea hic eaque. Magni sint consequuntur cum repellendus in.\n \rIpsa qui et magnam. Laudantium commodi repellat id. Dolores earum laudantium sit quas quis. Maxime et doloremque est soluta voluptatem laboriosam voluptas consequuntur voluptas. Nam sed maxime at qui quae dolores sequi et.',
          'Eos debitis id eum quis nulla. Consequuntur nisi ducimus illum. Animi assumenda aut velit ipsa officiis. Officiis libero enim quisquam soluta voluptatem nostrum ut quae temporibus.',
          'voluptates',
          'Non occaecati est quae unde ut. Voluptate voluptas et saepe et architecto. Occaecati voluptas voluptatum iusto nostrum. Fuga ea dolores.',
        ],
        openInvites: false,
        encryptionKey:
          'Ipsum numquam voluptatem sunt officiis earum rerum magnam.',
        lastUpdate: 23157,
      },
      {
        id: '372d9ee6-4888-4280-90cd-a67d4c02a1c3',
        name: 'Sam Goldner',
        admin: 'est',
        creator:
          'Sed magnam occaecati laborum. Soluta voluptas doloribus magni ducimus laboriosam soluta quis ut voluptas. Provident voluptatem dolorum odio aspernatur doloremque unde sint et. Sed laboriosam tempora repudiandae sed nesciunt est et. Minima blanditiis est qui illum et soluta consequatur ipsa.',
        members: [
          {
            name: 'Lilyan Konopelski',
            photoHash: 'labore occaecati itaque',
            status: 'voluptatibus dolore et',
            address:
              'Amet sed non distinctio pariatur numquam a ut esse provident. Magnam est et quisquam sequi quasi. Laborum sed et consectetur et. Veritatis aut facere sint deleniti. Voluptas sit quisquam qui nulla autem corporis assumenda natus. Natus qui quo facere quo nulla consequatur temporibus assumenda.',
          },
          {
            name: 'Sigrid Cormier',
            photoHash: 'quasi ut voluptatem',
            status:
              'Aliquid quos sapiente dolore fugit accusantium excepturi quo velit voluptatem. Alias voluptatibus iusto repellat voluptas unde. Corrupti qui repellendus voluptatem velit.',
            address:
              'Aut nihil ipsam quas possimus quam cumque officiis provident qui.\nExcepturi doloribus suscipit quibusdam mollitia id qui sit.\nNemo beatae sunt consequatur aperiam aliquam sequi aperiam qui libero.\nEt similique omnis rerum.\nEius rerum magnam ex.',
          },
          {
            name: 'Tobin Yost',
            photoHash:
              'Minima sed aliquid placeat neque et dolor dolor ratione. Reprehenderit dignissimos rerum aut nesciunt quis ratione enim architecto.',
            status:
              'Aut quasi nihil et. Saepe facilis atque similique ut impedit neque dicta. Numquam tempore hic aut aliquid porro voluptas repellat rerum. Molestiae dicta enim. Omnis et fugiat ullam adipisci voluptatum corporis. Aut exercitationem quia dolore et ut corrupti.',
            address: 'Ut quas recusandae.',
          },
          {
            name: 'Buster Kertzmann',
            photoHash:
              'Non nulla qui ut nemo. Repellendus qui ut quibusdam aut et incidunt mollitia ex dolorem. Repellendus dolorum ut ut. Quo rerum cum est magnam odit. Et unde quasi harum qui. Odit dolorum voluptates incidunt.',
            status: 'maiores',
            address: 'odio',
          },
          {
            name: 'Brett Weissnat',
            photoHash:
              'Ab sit non dolores aperiam commodi sint placeat nostrum aliquam. Consequuntur at dolores distinctio. Fuga molestiae expedita sit enim. Quia eos optio enim rerum debitis impedit perferendis. Eos quia accusantium aliquam vitae sunt vitae sit.',
            status:
              'Qui tenetur necessitatibus voluptas. Eum dicta quae excepturi. Praesentium facere facere officia ullam. Officia necessitatibus voluptatem autem ad. Error corporis laudantium aperiam. Molestiae omnis possimus repudiandae id veniam voluptas tenetur quam.',
            address: 'Dolorem repellat dolor ab provident veritatis quos.',
          },
        ],
        addresses: [
          'consectetur',
          'Autem molestias in ad qui omnis commodi voluptate. Ut provident aut cum voluptas voluptas enim. Possimus illo dignissimos modi delectus quidem.',
          'cumque quis aperiam',
          'iusto voluptatem perspiciatis',
          'Quam id beatae harum.',
          'Eius voluptatum necessitatibus facere voluptatem qui repellat fugit. Sit quasi dolor autem aut autem est nesciunt. Dolores culpa placeat ex nostrum non nesciunt architecto nesciunt dicta.',
          'Qui nesciunt voluptate consequatur. Quia eaque voluptas alias tempora cupiditate. Laudantium quo molestiae pariatur autem. Ratione error provident molestiae ad vel at excepturi laborum. Ipsum iure est voluptate optio impedit molestiae et.',
        ],
        openInvites: true,
        encryptionKey: 'sunt quia vel',
        lastUpdate: 82627,
      },
      {
        id: '2964dfcd-fede-4cc7-93fa-d898ea1b9f26',
        name: 'Nikolas Koepp',
        admin: 'Est voluptatem consequatur omnis quos dolorem.',
        creator: 'non',
        members: [
          {
            name: 'Burley Jerde',
            photoHash:
              'Inventore at qui.\nEa nostrum esse quidem nisi nihil.\nIncidunt necessitatibus perferendis ratione eum est dolorem voluptatem molestiae.\nSed voluptas eveniet beatae aut.\nVoluptatum non et.',
            status:
              'Itaque reprehenderit dolor dignissimos facere laborum voluptatem est. Delectus velit voluptates qui beatae rerum voluptatibus libero qui. Amet incidunt asperiores id quo placeat suscipit laudantium ratione. Veniam enim dolores debitis voluptas sunt quam hic quo. In enim et cupiditate tempora.',
            address: 'officia',
          },
        ],
        addresses: [
          'Nesciunt aut sed quia. Ipsa totam harum odit voluptatem sit maiores modi autem. Nesciunt accusamus iusto quisquam magni tenetur. Distinctio aut quaerat unde.',
          'exercitationem',
          'Quasi illo omnis. Consequatur qui commodi dicta et velit occaecati consequatur quibusdam. Quis corrupti nulla vitae facilis nisi. Adipisci maiores dolores quo voluptatem voluptas totam quidem consequatur. Iste blanditiis voluptatum corrupti in sit eaque asperiores non.',
        ],
        openInvites: true,
        encryptionKey: 'Earum alias consectetur iure non libero.',
        lastUpdate: 33200,
      },
    ],
    inviteSubscription: 18621,
    groupSubscriptions: [
      'Porro est ducimus dolor. Sed aliquid laudantium aspernatur. Et eveniet facere assumenda sunt ipsum unde praesentium ut id. Fuga cumque aut.\n \rArchitecto qui laudantium illum qui est in illo a repellendus. Sit voluptates consectetur totam beatae non necessitatibus reiciendis voluptas. Fuga aliquid quis porro est quia suscipit voluptas cumque.\n \rQuo tempora rerum repudiandae voluptate in et. Doloribus voluptatum voluptatem quae aspernatur. Voluptatibus ut unde adipisci.',
      'Omnis et nihil facere numquam et rerum similique aliquid. Quo explicabo pariatur animi iusto qui ipsum. Sequi sed qui iure et laudantium tempora laborum. Minus ea nulla. Ipsum maiores quia laudantium. Voluptatum soluta nostrum.',
      'Doloribus cumque perferendis ab dolorem placeat nihil voluptas eveniet nisi. Asperiores minima veniam sapiente.',
      'Rerum vero eos repudiandae voluptatem expedita dolorum officiis. Illo quasi eos delectus amet minima. Aut sunt eius sit quis sint quis iusto dignissimos.\n \rEt rerum cum voluptas natus. Saepe et voluptate unde. Dolorum quam officiis doloremque non saepe vitae debitis consequatur.\n \rNobis ut sit quae ad est sapiente delectus ut. Quis esse excepturi. Consectetur iusto atque incidunt cumque cumque error iure est.',
      'et placeat enim',
      'A et quia pariatur eum cum rerum sapiente et reprehenderit.',
      'voluptate',
      'laboriosam',
    ],
  }

  test('module.default.initialize', () => {
    const dispatch = jest.fn()

    module.default.initialize({ dispatch })
    expect(dispatch).toHaveBeenCalledWith('fetchGroups')
    expect(dispatch).toHaveBeenCalledWith('subscribeToGroupInvites')
    expect(dispatch).toHaveBeenCalledWith('subscribeToGroupsUpdate')
  })

  test.skip('module.default.addGroup', async () => {
    // Skipped for now because having problem mocking GroupChatsProgram
    const commit = jest.fn()
    const state = { ...GroupsInitialState }

    module.default.addGroup({ commit, state }, 'non-existant-id')
    expect(commit).toHaveBeenCalledWith('addGroup')
  })
})

describe('module.exportForTesting', () => {
  test('getGroupChatManager without initializing Textile', () => {
    try {
      const result = module.exportForTesting.getGroupChatManager()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        GroupsError.TEXTILE_NOT_INITIALIZED,
      )
    }
  })
  test('getUserAccount without initializing User', () => {
    try {
      const result = module.exportForTesting.getUserAccount()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', GroupsError.USER_NOT_INITIALIZED)
    }
  })
})
