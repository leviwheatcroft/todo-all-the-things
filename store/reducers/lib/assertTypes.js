/* eslint-disable no-console */
export function assertShape (subject, shape) {
  if (Object.getPrototypeOf(subject) !== Object.prototype)
    console.error('test object must be plain object', subject, shape)
  const expectedKeys = Object.keys(shape)
  const existingKeys = Object.keys(subject)
  expectedKeys.forEach((key) => {
    if (!existingKeys.includes(key))
      console.error(`missing property: ${key}`, subject, shape)
  })
  const extraKeys = existingKeys.filter((k) => !expectedKeys.includes(k))
  if (extraKeys.length)
    console.error(`extra properties: ${extraKeys.join(', ')}`, subject, shape)
  Object.entries(shape).forEach(([key, tests]) => {
    tests = [].concat(tests)
    const type = tests[0]
    tests[0] = (value) => Object.getPrototypeOf(value) === type.prototype
    tests.forEach((test) => {
      if (!test(subject[key]))
        console.error(`type mismatch: ${key}`, subject[key], test.toString(), shape)
    })
  })
}
