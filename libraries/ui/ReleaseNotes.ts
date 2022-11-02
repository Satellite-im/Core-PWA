/**
 * @method ReleaseNotes
 * @description Get the most recent release notes from github
 * @param none
 * @returns Promise with an object for the release info that includes a body
 * @example
 */

export type ReleaseNotesType = { body: string; tag_name: string }

let responseBody: object
export async function ReleaseNotes(): Promise<ReleaseNotesType | undefined> {
  if (!responseBody) {
    try {
      const response = await fetch(
        'https://api.github.com/repos/Satellite-im/Core-PWA/releases/latest',
      )
      responseBody = await response.json()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  return responseBody as ReleaseNotesType
}
