/* eslint-disable camelcase */
export function v1_1_0 (dehydrated) {
  const upgraded = { ...dehydrated }
  const {
    driver,
    accessToken,
    refreshInterval
  } = upgraded.remoteStorage

  upgraded.remoteStorage = {
    options: {
      driver,
      accessToken,
      refreshInterval
    }
  }
  upgraded.settings = {
    includeTasksInErrorReport: false,
    prependCreatedDate: true,
    showCreatedDate: true
  }
  upgraded.version = 'v1.1.0'

  // eslint-disable-next-line no-console
  console.log('upgraded to v1.1.0', dehydrated, upgraded)
  return upgraded
}
