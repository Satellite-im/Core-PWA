/**
 * @method ReleaseNotes
 * @description Get the most recent release notes from github
 * @param none
 * @returns Promise with an object for the release info that includes a body
 * @example
 */

let responseBody: object
export async function ReleaseNotes(): Promise<any> {
  if (!responseBody) {
    const response = await fetch(
      'https://api.github.com/repos/Satellite-im/Core-PWA/releases/latest',
    )
    responseBody = await response.json()
  }
  return responseBody
}
