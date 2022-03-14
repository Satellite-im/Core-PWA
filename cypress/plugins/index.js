import { addMatchImageSnapshotCommand } from "../../node_modules/cypress-image-snapshot/command";

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config)
}
