import { upgrades } from './upgrades'

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
    state: 'noDriver',
    optionsRequired: [],
    options: {
      driver: 'none'
    }
  },
  settings: {
    includeTasksInErrorReport: false,
    prependCreatedDate: true,
    showCreatedDate: true
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
  contexts: [],
  version: 'v1.1.0'
}

const dehydrators = {
  dialogs: () => undefined,
  sort: ({ sort }) => sort,
  remoteStorage: ({ remoteStorage: { options } }) => {
    return { options }
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

export function upgrade (dehydrated) {
  const current = dehydrated.version
  const upgradeVersions = Object.keys(upgrades)
  const next = upgradeVersions.findIndex((version) => {
    return versionCompare(current, version) < 0
  })
  // console.log(available.findIndex(() => true))
  if (next === -1)
    return dehydrated
  return Object.values(upgrades).slice(next).reduce((dehydrated, upgrade) => {
    return upgrade(dehydrated)
  }, dehydrated)
}

function versionCompare (a, b) {
  if (a === undefined)
    return -1
  a = a.replace('v', '').split('.')
  b = b.replace('v', '').split('.')
  for (let i = 0; i < 3; i += 1) {
    const na = Number(a[i])
    const nb = Number(b[i])
    if (na > nb)
      return 1
    if (nb > na)
      return -1
    if (
      !Number.isNaN(na) &&
      Number.isNaN(nb)
    )
      return 1
    if (
      Number.isNaN(na) &&
      !Number.isNaN(nb)
    )
      return 1
  }
  return 0
}
