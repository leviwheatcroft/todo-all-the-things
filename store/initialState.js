export const initialState = {
  dialogs: {
    show: false
  },
  options: {
    sort: {
      by: 'file',
      order: 'ascending',
      priorityAlways: true,
      completedLast: true
    }
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
