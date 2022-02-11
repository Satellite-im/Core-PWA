import { EventEmitter } from 'events'
import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import SolanaWallet from '../SolanaWallet'
import { Groupchats } from './GroupchatsProgram.types'
import idl from './idl.json'
import Solana from '~/libraries/Solana/SolanaManager/SolanaManager'

export const GROUPCHATS_PROGRAM_ID = new anchor.web3.PublicKey(
  idl.metadata.address,
)

export default class GroupchatsProgram extends EventEmitter {
  solana?: Solana
  program?: Program<Groupchats>
  subscriptions?: { [eventName: string]: number }
  constructor(solana: Solana) {
    super()
    // super()
    if (solana) {
      this.init(solana)
    }
  }

  /**
   * @method init
   * Initializes the class with the SolanaManager instance
   * @param solana SolanaManager instance
   */
  init(solana: Solana) {
    this.solana = solana
    const provider = new anchor.Provider(
      this.solana.connection,
      new SolanaWallet(this.solana.getActiveAccount() as anchor.web3.Keypair),
      {
        preflightCommitment: 'confirmed',
      },
    )
    this.program = new Program(
      idl as anchor.Idl,
      GROUPCHATS_PROGRAM_ID,
      provider,
    ) as unknown as Program<Groupchats>
  }

  async create(groupId: string) {
    const balance = await this.solana?.getCurrentAccountBalance()
    if (balance === 0) {
      await this.solana?.requestAirdrop()
    }
    const groupHash = 'dhfskjdfhsdjkfhsdjkfhdsjkhdjkfds'
    const user = this.solana?.getUserAccount() as anchor.web3.Keypair
    const payer = this.solana?.getActiveAccount() as anchor.web3.Keypair
    const groupSeed = Buffer.from(anchor.utils.bytes.utf8.encode('groupchat'))
    const inviteSeed = Buffer.from(anchor.utils.bytes.utf8.encode('invite'))
    const group = anchor.utils.publicKey.findProgramAddressSync(
      [Buffer.from(anchor.utils.bytes.utf8.encode(groupHash)), groupSeed],
      this.program?.programId as PublicKey,
    )
    const invite = anchor.utils.publicKey.findProgramAddressSync(
      [user.publicKey.toBytes(), group[0].toBytes(), inviteSeed],
      this.program?.programId as PublicKey,
    )

    await this.program?.rpc.create(groupHash, groupId, true, {
      accounts: {
        group: group[0],
        invitation: invite,
        signer: user.publicKey,
        payer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [user],
    })
  }
}
