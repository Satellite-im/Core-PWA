import { Command } from '~/types/utils/commands'

const commandPrefix = '/'

export function containsCommand(text: string) {
  const cmd = text.split(' ')[0].replace(commandPrefix, '')
  return text.charAt(0) === commandPrefix && cmd.match(/^[a-z0-9]+$/i)
}

export function parseCommand(text: string): Command {
  const splitMessage = text.split(' ')
  return {
    name: splitMessage[0].replace(commandPrefix, ''),
    args: splitMessage.slice(1, splitMessage.length),
  }
}

export const commands = [
  {
    name: 'reload',
    description: 'Reload the application',
    args: [
      {
        name: 'clear_cache',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'address',
    description: 'Send your account address',
    args: [],
  },
]
