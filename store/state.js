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
    accessToken: false
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
