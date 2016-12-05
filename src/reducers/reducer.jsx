
const reducer = function(state = {}, action){
  return {id: action.id,
    text: action.text}
}

module.exports = reducer;
