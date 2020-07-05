export const initialState = {
  dialogs: {
    show: 'help'
  },
  sort: {
    by: 'file',
    order: 'ascending',
    priorityAlways: true,
    completedLast: true
  },
  remoteStorage: {
    driver: false,
    refreshInterval: 10 * 60 * 1000,
    accessToken: false
    // driver: 'dropbox',
    // accessToken: 'qxqMxMjMF8QAAAAAAAA18-w9ZGyFQL-AhueB40tEK5AJymGtTQv8eGCgbXDpt0yO'
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
