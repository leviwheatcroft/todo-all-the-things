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
    driver: 'dropbox',
    accessToken: 'qxqMxMjMF8QAAAAAAAA18-w9ZGyFQL-AhueB40tEK5AJymGtTQv8eGCgbXDpt0yO'
    // dropbox: {
    //   key: 'sc2hb6nhiz63zf4',
    //   // secret: 'h50n76e2nlxff6',
    //   accessToken: 'qxqMxMjMF8QAAAAAAAA18-w9ZGyFQL-AhueB40tEK5AJymGtTQv8eGCgbXDpt0yO'
    // }
  },
  filter: {
    text: '',
    regExp: /.*/
  },
  lists: {
    todo: {
      id: 'todo',
      tasks: {}
    }
  },
  projects: [],
  contexts: []
}
