/**
 * @function encode
 * @description fetches svg from textile and converts to a data string
 */
export default async function encode(url: string): Promise<string> {
  const svg = await fetch(url).then((res) => res.text())

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
