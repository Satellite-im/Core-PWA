export type CurrentCommand = {
  name: String
  args: Array<String>
}

export type CommandArg = {
  name: string
  options: string
}

export type Command = {
  name: string
  description: string
  args: CommandArg[]
}
