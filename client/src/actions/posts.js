import * as api from '../api';

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts()
    dispatch({ type: 'FETCH_ALL', payload: data })
  } catch (error) {
    console.log(error)
  }
}
export const deletePost = (id) => async (dispatch) => {
  try {
    await await api.deletePost(id)

    dispatch({ type: 'DELETE', payload: id })
  } catch (error) {
    console.log(error)
  }
}

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post)
    // dispatch({type: 'RESULT',payload: data})
    dispatch({ type: 'CREATE', payload: data })
  } catch (error) {
    console.log(error)
  }
}

// export const imageDetect = (image) => async (dispatch) => {
//   try{
//     const { data } = await api.imageDetect(image)
//     dispatch({ type: 'IMAGE_DETECT', payload: data })
//   }
//   catch(error){
//     console.log(error)
//   }
// }