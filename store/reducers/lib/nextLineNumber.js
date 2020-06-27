export function nextLineNumber (tasks) {
  return Object.values(tasks)
    .reduce((lineNumber, task) => {
      return Math.max(lineNumber, task.lineNumber + 1)
    }, 0)
}
