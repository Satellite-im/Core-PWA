import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import Crypto from '~/libraries/Crypto/Crypto'

const solana = new SolanaManager()
const serverProgram = new ServerProgram()
const usersProgram = new UsersProgram(solana)
const friendsProgram = new FriendsProgram(solana)
const crypto = new Crypto()
