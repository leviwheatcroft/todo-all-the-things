/* eslint-disable camelcase */
export function v1_1_0 (ctx) {
  const { update } = ctx

  const remoteStorage = {
    lastTouch: 0,
    state: 'noDriver',
    error: false,
    optionsRequired: [],
    options: {
      driver: false
    }
  }
  update(['remoteStorage'], remoteStorage)

  const settings = {
    includeTasksInErrorReport: false,
    prependCreatedDate: true,
    showCreatedDate: true
  }

  update(['settings'], settings)

  update(['version'], 'v1.1.0')
}
