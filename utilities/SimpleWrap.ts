export type Rule = {
  replace: string
  tag: string
}

export const SimpleWrap = (text: string, rule: Rule): string => {
  const escapedRule = rule.replace.replace(/([^a-zA-Z0-9])/g, '\\$1')
  const replace = new RegExp(`${escapedRule}(.*?)${escapedRule}`, 'gi')
  return text
    .replace(replace, `<${rule.tag}>$&</${rule.tag}>`)
    .replace(new RegExp(escapedRule, 'gi'), '')
}
