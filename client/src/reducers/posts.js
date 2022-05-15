
const reducer = (posts = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload
    case 'CREATE':
      return [action.payload, ...posts]
    case 'DELETE':
      return posts.filter((post) => post._id !== action.payload)
    default:
      return posts
  }
}
export default reducer
