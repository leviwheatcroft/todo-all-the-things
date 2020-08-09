const _prefix = 'tdw'

export function prefix (key) {
  return `${_prefix}-${key}`
}

// TODO: get rid of this
export default prefix
