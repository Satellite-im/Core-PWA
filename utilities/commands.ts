import { Command, CurrentCommand } from '~/types/utils/commands'

const commandPrefix = '/'

export function containsCommand(text: string) {
  const cmd = text.split(' ')[0].replace(commandPrefix, '')
  return (
    text.charAt(0) === commandPrefix &&
    (cmd.match(/^[a-z0-9]+$/i) || text.length === 1) // the || part is needed for showing all the available commands after writing the commandPrefix
  )
}

export function parseCommand(text: string): CurrentCommand {
  const splitMessage = text.split(/\s+/)
  return {
    name: splitMessage[0].replace(commandPrefix, ''),
    args: splitMessage.slice(1, splitMessage.length),
  }
}

/**
 * Returns true if currentArgs are valid for command, else false
 * @param command command which arguments need to be checked
 * @param currentArgs incoming args value
 * @returns boolean if currentArgs are valid for command
 */
export function isArgsValid(
  command: Command,
  currentArgs: Array<String> = []
): boolean {
  return command.args.every((a, i) => {
    const possibleValues = a.options.split(' | ')
    return (
      !currentArgs[i] || // Assuming args are optional
      possibleValues.includes(currentArgs[i]?.toLowerCase())
    )
  })
}

export const commands: Command[] = [
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
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
  {
    name: 'placeholder',
    description: 'Just a placeholder command',
    args: [
      {
        name: 'nothing',
        options: 'true | false',
      },
    ],
  },
]
