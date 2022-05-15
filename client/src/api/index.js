import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' })


// API.interceptors.request.use((req) => {
//   if (localStorage.getItem('profile')) {
//     req.headers.Authorization = `Bearer ${
//       JSON.parse(localStorage.getItem('profile')).token
//     }`
//   }

//   return req
// })

export const fetchPosts = () => API.get('/posts')
export const createPost = (newPost) => 
  API.post('/posts', newPost)
  .then((res) => {
    console.log("api",res)
  })
  .catch((err) => {
    console.log(err)
  })

export const getResult = () => API.get('/result')

export const deletePost = (id) => API.delete(`/posts/${id}`)

// export const createPost = async (newPost) => await axios.post(url, newPost)


// export const signIn = (formData) => API.post('/user/signin', formData)
// export const signUp = (formData) => API.post('/user/signup', formData)
