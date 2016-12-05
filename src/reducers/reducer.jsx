// define some actions...

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'START':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    default:
      return state
  }
}

module.exports = reducer