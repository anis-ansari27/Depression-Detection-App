import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, getPosts } from '../actions/posts'
import moment from 'moment'
import axios from 'axios'
import { Button, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ShimmerTitle, ShimmerText } from 'react-shimmer-effects'
import Typing from 'react-typing-animation'
import Blink from 'react-blink-text'
import Webcam from 'react-webcam'
import { ReactMic } from 'react-mic'
import JsonData from './mental-health.json'

const videoConstraints = {
  width: 180,
  height: 180,
  facingMode: 'user',
}
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Home = () => {
  const dispatch = useDispatch()
  const [post, setPostData] = useState({ message: '' })
  const [resultPost, setResultPost] = useState({
    message: '',
    depressionVideo: 0.0,
    depressionText: 0.0,
    depression: false,
    _id: '',
    createdAt: '',
    __v: 0,
  })
  const [depressionImage, setDepressionImage] = useState([])
  const [depressionAudio, setDepressionAudio] = useState(0)
  const [depression, setDepression] = useState(true)
  const [optionVideo, setOptionVideo] = useState(false)
  const webcamRef = React.useRef(null)
  const [checkButton, setCheckButton] = useState(false)
  const [record, setRecord] = useState(false)
  const [optionAudio, setOptionAudio] = useState(0)

  const posts = useSelector((state) => state.posts)

  function ResultPost() {
    return (
      <div className='postTile'>
        <p class='card-body flex-column align-items-start active'>
          <div class='card-header d-flex w-100 justify-content-between'>
            <h5 class='mb-1'>New Jornal Entry</h5>
          </div>
          <div class='card-header d-flex w-100 justify-content-between'>
            <h6 class='mb-1'>
              Depression : {resultPost.depression ? 'true' : 'false'}
            </h6>
            <small>{moment(resultPost.createdAt).format('lll')}</small>
          </div>

          <div class='card-header d-flex w-100 justify-content-between'>
            <h7 class='mb-1'>Depression Text : {resultPost.depressionText}</h7>
            <h7>Depression Video : {resultPost.depressionVideo}</h7>
          </div>
          <p class='mb-1'>{resultPost.message}</p>
        </p>
      </div>
    )
  }
  function LoadingPost() {
    return (
      <div className='postTile'>
        <p class='card-body flex-column align-items-start active'>
          <div class='card-header d-flex w-100 justify-content-between'>
            <Typing loop='true' speed={70}>
              <h5>Your text is being processed</h5>
              <Typing.Backspace count={50} speed={70} />
            </Typing>
          </div>
          <div class='card-header d-flex w-100 justify-content-between'>
            <ShimmerTitle line={1} gap={8} variant='light' />
          </div>
          <ShimmerText line={5} gap={8} variant='dark' />
        </p>
      </div>
    )
  }
  function RecordingAudio() {
    return (
      <div className='postTile'>
        <p class='card-body flex-column align-items-start active'>
          <div class='card-header d-flex w-100 justify-content-between'>
            <Blink color='black' text='Audio is recording....' fontSize='40px'>
              Audio is recording.....
            </Blink>
          </div>
        </p>
      </div>
    )
  }
  function Recommendation() {
    const City = [
      'Location',
      'Bhopal',
      'Mumbai',
      'Kolkata',
      'Surat',
      'Bengaluru',
      'Gurgaon',
      'Hyderabad',
      'New Delhi',
    ]

    const [searchTerm, setSearchTerm] = useState('')

    return (
      <div className='Recommendation'>
        <div class='card-header d-flex w-100 justify-content-between'>
          <h4 class='mb-1'>Here's a list of therapists</h4>
          <select
            type='text'
            placeholder='seach...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            class='btn btn-secondary dropdown-toggle'
          >
            {City.map((city) => (
              <option key={post._id} value={post._id}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className='RecommendationList'>
          {JsonData.filter((val) => {
            if (searchTerm === '') return ''
            else if (val.City.toLowerCase().includes(searchTerm.toLowerCase()))
              return val
            else return ''
          }).map((val, key) => {
            return (
              <div class='card' className='recommendationTile'>
                <p class='card-body flex-column align-items-start active'>
                  <div class='card-header d-flex w-100 justify-content-between'>
                    <h6 class='mb-1'>{val.Name}</h6>
                    <small>{val.Fee}</small>
                  </div>

                  <div class='d-flex w-100 justify-content-between'>
                    <h7 class='mb-1'>{val.City}</h7>
                    <small>{val.Medium}</small>
                  </div>
                  <p class='mb-1'>{val.Qualifications}</p>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const handleImage = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    // console.log(imageSrc)
    axios
      .post('http://localhost:5000/posts/imageDetect', {
        message: imageSrc,
      })
      .then((res) => {
        var newdep = res.data.depression
        var dep = depressionImage
        dep.push(newdep)
        setDepressionImage(dep)
        console.log('depressionImage', depressionImage)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [webcamRef, depressionImage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCheckButton(true)
    setDepressionAudio(0)
    setResultPost({
      message: '',
      depressionText: 0.0,
      depressionVideo: 0.0,
      _id: '',
      createdAt: '',
      __v: 0,
    })
    const depVideo =
      depressionImage.reduce((a, b) => a + b, 0) / depressionImage.length
    const postTemp = { message: post.message, depressionVideo: depVideo }
    setPostData({ message: post.message })
    await dispatch(createPost(postTemp))
    const data = await axios.get('http://localhost:5000/posts/result')
    setResultPost(data.data)
    setCheckButton(false)
    setPostData({ message: '' })
    setDepressionImage([])

    setDepression(resultPost.depression)
    console.log('resultPostDepression', resultPost.depression)
    console.log('depression', depression)
    dispatch(getPosts())
  }

  useEffect(() => {
    console.log('render home')
    dispatch(getPosts())
  }, [dispatch])

  return (
    <div className='Home'>
      <div className='AppContent'>
        <div className='AppPosts'>
          <br />
          <div className='inputForm'>
            <div class='card-header d-flex w-50 justify-content-between'>
              <div className='options'>
                {!optionVideo ? (
                  <button
                    class='btn btn-secondary'
                    onClick={() => {
                      setOptionVideo(!optionVideo)
                      setDepressionAudio(0)
                    }
                  }
                  >
                    ▶ Start Video Recording
                  </button>
                ) : (
                  <button
                    class='btn btn-secondary'
                    onClick={() => setOptionVideo(!optionVideo)}
                  >
                    🛑 Stop Video Recording
                  </button>
                )}
              </div>

              <div className='options'>
                {!optionAudio ? (
                  <button
                    class='btn btn-secondary'
                    onClick={() => {
                      setDepressionAudio(0)
                      setResultPost({
                        message: '',
                        depressionText: 0.0,
                        depressionVideo: 0.0,
                        _id: '',
                        createdAt: '',
                        __v: 0,
                      })
                      setRecord(true)
                      setOptionAudio(true)
                    }}
                  >
                    ▶ Start Audio Recording
                  </button>
                ) : (
                  <button
                    class='btn btn-secondary'
                    onClick={() => {
                      setRecord(false)
                      setOptionAudio(false)
                    }}
                  >
                    🛑 Stop Audio Recording
                  </button>
                )}
              </div>
            </div>
            {!optionAudio ? (
              <div className='container'>
                <br />
                {optionVideo && (
                  <Webcam
                    audio={false}
                    screenshotFormat='image/jpeg'
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                  />
                )}

                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <br />
                    <textarea
                      className='form-control form-rounded'
                      id='exampleFormControlTextarea1'
                      rows='3'
                      name='post'
                      autoFocus='true'
                      placeholder='Enter your text here...'
                      value={post.message}
                      onChange={(e) => {
                        setPostData({ ...post, message: e.target.value })
                        optionVideo && handleImage()
                      }}
                      style={{
                        fontSize: '17px',
                        boxShadow: '0 1px 2px 0 rgb(60 64 67 / 30%)',
                        borderRadius: '5px',
                        marginLeft: '250px',
                        marginRight: '70px',
                        width: '50%',
                      }}
                    />
                  </div>

                  {!checkButton ? (
                    <button type='submit' className='btn btn-secondary'>
                      Detect
                    </button>
                  ) : (
                    <Button variant='secondary' disabled>
                      <Spinner
                        as='span'
                        variant='light'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                        animation='border'
                      />
                      Detecting...
                    </Button>
                  )}
                </form>
              </div>
            ) : (
              <>
                <br />
                <RecordingAudio />
              </>
            )}

            <br />

            {depressionAudio ? (
              <div className='postTile'>
                <p class='card-body flex-column align-items-start active'>
                  <div class='card-header d-flex w-100 justify-content-between'>
                    <h5 class='mb-1'>Depression Detection through audio: </h5>
                  </div>

                  <div class='card-header d-flex w-100 justify-content-between'>
                    <h7 class='mb-1'>Depression Audio : {depressionAudio}</h7>
                  </div>
                </p>
              </div>
            ) : null}

            {checkButton && <LoadingPost />}
            {resultPost.message && <ResultPost />}
          </div>
          <br />

          <Recommendation />
          <br />

          <div className='Posts'>
            {Object.keys(posts).length !== 0 ? (
              <div>
                <div class='card-header d-flex w-100 justify-content-between'>
                  <h4 class='mb-1'>Your Journal Entries...</h4>
                </div>
                <div className='PostList'>
                  {posts.map((post) => (
                    <ul className='postTile' id='post._id'>
                      <p class='card-body flex-column align-items-start active'>
                        <div class='card-header d-flex w-100 justify-content-between'>
                          <h6 class='mb-1'>
                            Depression : {post.depression ? 'true' : 'false'}
                          </h6>
                          <small>{moment(post.createdAt).format('lll')}</small>
                        </div>

                        <div class='card-header d-flex w-100 justify-content-between'>
                          <h7 class='mb-1'>
                            Depression Text : {post.depressionText}
                          </h7>
                          <h7>Depression Video : {post.depressionVideo}</h7>
                        </div>
                        <p class='mb-1'>{post.message}</p>
                      </p>
                    </ul>
                  ))}
                </div>
              </div>
            ) : (
              <div class='card-header d-flex w-100 justify-content-between'>
                <h4 class='mb-1'>No Journal Entries...</h4>
              </div>
            )}
          </div>

          <ReactMic
            record={record}
            className='sound-wave'
            onStop={(recordedBlob) => {
              console.log('recordedBlob is: ', recordedBlob)
              var reader = new FileReader()
              reader.readAsDataURL(recordedBlob.blob)
              reader.onloadend = function () {
                var audioSrc = reader.result
                axios
                  .post('http://localhost:5000/posts/audioDetect', {
                    message: audioSrc,
                  })
                  .then((res) => {
                    setDepressionAudio(res.data.depression)
                    console.log('Depression Audio: ', res.data.depression)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }
            }}
            strokeColor='#FFFFFF'
          />
        </div>
      </div>
    </div>
  )
}

export default Home
