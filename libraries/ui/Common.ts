export function validURL(text: string): boolean {
  const pattern = new RegExp(
    '^((ftp|ws|wss|rtp|rtmp|srt|udp|http|https)?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,63}|' +
      'localhost|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  )
  return !!text.match(pattern) || !text || !(text.length > 2048)
}
