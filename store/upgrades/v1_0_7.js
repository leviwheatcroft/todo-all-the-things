/* eslint-disable camelcase */
export function v1_0_7 (dehydrated) {
  const upgraded = { ...dehydrated }
  if (upgraded.remoteStorage.driver === 'dropbox')
    upgraded.remoteStorage.state = 'connected'
  else
    upgraded.remoteStorage.state = 'noDriver'
  upgraded.version = 'v1.0.7'

  // eslint-disable-next-line no-console
  console.log('upgraded to v1.0.7', dehydrated, upgraded)
  return upgraded
}
