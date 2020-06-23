export function set (obj, path, value) {
  const mutated = { ...obj }
  let cursor = mutated
  if (!Array.isArray(path))
    // eslint-disable-next-line no-param-reassign
    path = path.split('.')
  path.forEach((s, idx) => {
    cursor[s] = idx === path.length - 1 ? value : { ...cursor[s] }
    cursor = cursor[s]
  })
  return mutated
}

export function get (obj, path) {
  try {
    return path.split('.').reduce((cursor, segment) => {
      return segment[cursor]
    }, obj)
  } catch (err) {
    return undefined
  }
}

export function wrap (result) {
  const wrapped = {
    set (path, value) {
      wrapped.result = set(wrapped.result, path, value)
    },
    get (path) {
      get(wrapped.result, path)
    },
    result
  }
  return wrapped
}
