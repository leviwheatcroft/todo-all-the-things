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
  if (!path)
    return obj
  const segments = Array.isArray(path) ? path : path.split('.')
  try {
    return segments.reduce((cursor, segment) => {
      return cursor[segment]
    }, obj)
  } catch (err) {
    return undefined
  }
}

export function wrap (result) {
  const wrapped = {
    set (path, value) {
      wrapped.result = set(wrapped.result, path, value)
      return wrapped.result
    },
    get (path) {
      return get(wrapped.result, path)
    },
    result
  }
  return wrapped
}
