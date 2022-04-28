export class TracksManager {
  tracks: { [id: string]: MediaStreamTrack }

  constructor() {
    this.tracks = {}
  }

  addTrack(track: MediaStreamTrack) {
    if (this.tracks[track.id]) {
      //  Allow console in lint
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.warn(
        `Track already exists ${track.id} ${track.kind}`,
        this.tracks,
      )
      return
    }

    this.tracks[track.id] = track
  }

  removeTrack(id: string) {
    delete this.tracks[id]
  }

  getTrack(id: string): MediaStreamTrack | undefined {
    return this.tracks[id]
  }

  removeAllTracks() {
    this.tracks = {}
  }
}
