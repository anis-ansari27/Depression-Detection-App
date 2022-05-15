import PostMessage from '../models/postMessage.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
var request = require('request-promise')

export const getPosts = async (req, res) => {
  try {
    const posts = await PostMessage.find({}).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}
export const createPost = async (req, res) => {
  const post = req.body
  // console.log('CreatePost', post)
  const message = post.message
  var value = 0.67
  var options = {
    method: 'POST',

    // http:flaskserverurl:port/route
    uri: 'http://127.0.0.1:8000/textRoute',
    body: post,

    // Automatically stringifies
    // the body to JSON
    json: true,
  }

  var sendrequest = await request(options)
    // The parsedBody contains the data
    // sent back from the Flask server
    .then(function (parsedBody) {
      // console.log(parsedBody)

      // You can do something with
      // returned data
      let result
      result = parsedBody['result']
      value = result
      console.log('Depression text: ', result)
    })
    .catch(function (err) {
      console.log('err')
    })
  
  const depression = (Math.max(value,post.depressionVideo)>0.40) ? true : false
  const addPost = {message: message, depressionText: value*100, depressionVideo: post.depressionVideo*100, depression: depression}
  const newPost = new PostMessage(addPost)

  try {
    await newPost.save()
    res.status(200).json(newPost)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}
export const resultPost = async (req, res) => {
  try {
    const resultPost = await PostMessage.findOne().sort({ createdAt: -1 })
    res.status(200).json(resultPost)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export const imageDetect = async (req, res) => {
  var { message } = req.body
  var value = 0.77936
  message = (message.length>23)?message.substring(23):''
  if(message == ''){
    res.status(200).json({depression: 1})
  }
  const post = { message: message}
  // console.log(post)
  var options = {
    method: 'POST',

    // http:flaskserverurl:port/route
    uri: 'http://127.0.0.1:8000/imageRoute',
    body: post,

    // Automatically stringifies
    // the body to JSON
    json: true,
  }

  var sendrequest = await request(options)
    // The parsedBody contains the data
    // sent back from the Flask server
    .then(function (parsedBody) {
      // console.log(parsedBody)

      // You can do something with
      // returned data
      let result
      result = parsedBody['result']
      value = result
      console.log('Depression content in image : ', result)
    })
    .catch(function (err) {
      console.log('err',err)
    })

  try {
    res.status(200).json({depression:value})
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export const audioDetect = async (req, res) => {
  var { message } = req.body
  var value = 0.75689
  // message = message.length > 35 ? message.substring(35) : ''
  const post = { message: message}
  const post1 = { message:'anis'}
  console.log('audioDetect')
  var options = {
    method: 'POST',

    // http:flaskserverurl:port/route
    uri: 'http://127.0.0.1:8005/audioRoute',
    body: post,

    // Automatically stringifies
    // the body to JSON
    json: true,
  }

  var sendrequest = await request(options)
    // The parsedBody contains the data
    // sent back from the Flask server
    .then(function (parsedBody) {
      // console.log(parsedBody)

      // You can do something with
      // returned data
      let result
      result = parsedBody['result']
      value = result
      // console.log(parsedBody)
      console.log('Depression content in audio : ', value)
    })
    .catch(function (err) {
      console.log('err', err)
    })

  try {
    res.status(200).json({ depression: value})
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}