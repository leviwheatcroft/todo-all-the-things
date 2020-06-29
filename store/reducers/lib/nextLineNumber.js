export function nextLineNumber (tasks) {
  tasks = Object.values(tasks)
  if (!tasks.length)
    return 1

  return tasks.reduce((lineNumber, task) => {
    return Math.max(lineNumber, task.lineNumber + 1)
  }, 0)
}
