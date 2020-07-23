export const initialState = {
  dialogs: {
    show: false
  },
  sort: {
    by: 'file',
    order: 'ascending',
    priorityAlways: true,
    completedLast: true
  },
  remoteStorage: {
    lastTouch: 0,
    driver: false,
    state: 'noDriver',
    refreshInterval: 10 * 60 * 1000,
    accessToken: false,
    error: false
  },
  settings: {
    includeTasksInErrorReport: false,
    prependCreatedDate: true
  },
  filter: {
    text: '',
    regExp: /.*/
  },
  selectedListId: 'todo',
  lists: {
    todo: {
      id: 'todo',
      tasks: {}
    }
  },
  projects: [],
  contexts: []
}

const dehydrators = {
  dialogs: () => undefined,
  sort: ({ sort }) => sort,
  remoteStorage: ({ remoteStorage }) => {
    const persisted = ['driver', 'refreshInterval', 'accessToken']
    return Object.fromEntries(
      Object.entries(remoteStorage)
        .filter(([key]) => persisted.includes(key))
    )
  },
  settings: ({ settings }) => settings,
  filter: ({ filter: { text, regExp } }) => {
    return { text, regExp: new RegExp(regExp) }
  },
  selectedListId: ({ selectedListId }) => selectedListId,
  version: ({ version }) => version,
  lists: () => undefined,
  projects: () => undefined,
  contexts: () => undefined
}
const hydrators = {
  filter: ({ filter: { text, regExp } }) => {
    return { text, regExp: new RegExp(regExp) }
  }
}

export function dehydrate (state) {
  return Object.fromEntries(
    Object.entries(state)
      .map(([key]) => [key, dehydrators[key](state)])
      .filter(([, value]) => value !== undefined)
  )
}
export function hydrate (state) {
  return Object.fromEntries(
    Object.entries(state)
      .map(([key, value]) => {
        return [key, hydrators[key] ? hydrators[key](state) : value]
      })
  )
}
