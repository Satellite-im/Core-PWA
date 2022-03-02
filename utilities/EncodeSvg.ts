/**
 * @function encode
 * @description fetches svg from textile and converts to a data string
 */
export default async function encode(url: string): Promise<string> {
  const svg = await fetch(url).then((res) => res.text())

  return (
    'data:image/svg+xml,' +
    svg
      .replace(
        '<svg',
        ~svg.indexOf('xmlns')
          ? '<svg'
          : '<svg xmlns="http://www.w3.org/2000/svg"',
      )
      .replace(/"/g, "'")
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      .replace(/\s+/g, ' ')
  )
}
