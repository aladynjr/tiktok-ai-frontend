import React, { useState, useReducer, useEffect } from 'react';

import './App.scss';
import { FaPencilAlt } from 'react-icons/fa'
import { RxFramerLogo } from 'react-icons/rx'
function App() {


  //const HOST = 'http://localhost:5001'
  const HOST = 'http://143.198.58.92:5001'
  const [videoURL, setVideoURL] = useState('')


  /* const [history, setHistory] = useState([
     `
 Weather outside is rifle two potatoes, cut a circle. 
 Boil for 30 minutes until it is soft. 
 Go through as the water. 
 Then here. 
 My favorite way to mash a potato is using a garlic. 
 Press mix mashed potatoes, glutinous rice flour, cornstarch or potato starch, 
 salt and pepper. 
 Knead the dough until smooth, lowering the cut into the shape you like. 
 You can use a fork to press some patent. 
 Deep fry over medium heat for 5 
 minutes until they turn light golden, 
 then deep fry over high heat for 30 more seconds 
 until they turn golden brown chili powder or ketchup?
 `,
     'Generate a headline for this video that is interesting and makes the viewer want to know more about the topic',
     'This is an example response from the AI',
     'Generate a question for this video that will make the viewer want to watch the video to find out the answer',
     'How Can You Make Perfectly Crispy Potato Circles with a Garlic Twist?',
 
 
   ])*/

  const [history, setHistory] = useState([])

  const [prompts, setPrompts] = useState();
  const GetPrompts = async () => {
    try {
      const response = await fetch(`${HOST}/api/prompts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()


      setPrompts(data)
      return data

    }
    catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    GetPrompts()
  }, [])



  const [getVideoSubsLoading, setGetVideoSubsLoading] = useState(false)
  const [getVideoSubsError, setGetVideoSubsError] = useState('')

  const GetVideoSubtitles = async () => {
    setGetVideoSubsLoading(true)
    setGetVideoSubsError('')
    try {
      const response = await fetch(`${HOST}/api/tiktok/subtitles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: videoURL })
      })

      const data = await response.json()

      if (data.error) {
        console.error(data.message)
        setGetVideoSubsError(data.message)
        return null
      }
      setHistory([data.subtitles])
      return data.subtitles

    }
    catch (error) {
      console.log(error.message)
    } finally {
      setGetVideoSubsLoading(false)
    }
  }


  const [question, setQuestion] = useState('')
  const [getAnswerLoading, setGetAnswerLoading] = useState(false)
  const [getAnswerError, setGetAnswerError] = useState(false)

  const GetAnswer = async (history) => {
    setGetAnswerLoading(true)
    setGetAnswerError('')
    console.log('sending history...')
    console.log(history)
    try {
      const response = await fetch(`${HOST}/api/tiktok/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history })
      })

      var data = await response.json()

      if (data.error) {
        console.error(data.message)
        setGetAnswerError(data.message)
        return null
      }

      //if data.answer starts with /n or /r, remove it
      if (data.answer.startsWith('\r') || data.answer.startsWith('\n')) {
        data.answer = data.answer.substring(1)
      }


      setHistory(history => [...history, data.answer])

      return data.answer

    }
    catch (error) {
      console.error(error.message)
    }
    finally {
      setGetAnswerLoading(false)
    }

  }


  const [category, setCategory] = useState('')

  console.log({ category })




  //when clicking on anything else other than an element with id of category-button, set category to empty string
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#category-button')) {
        setCategory('')
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  console.log({ history })

  //when clicking enter, run GetAnswer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
       


        console.log('enter')
        if (!question.trim() || (question?.length < 3)) {
          setGetAnswerError('Please enter a valid question')
          console.log('Please enter a valid question ' + question)
          return
        }
        if (getAnswerLoading) {
          console.log('please wait for the ai to respond ')
          setGetAnswerError('Please wait for the ai to respond')
          return

        }

        setHistory(history => [...history, question])
        setQuestion('')

        GetAnswer([...history, question])

        //clear question 
        setQuestion('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [question])
  console.log({ question })


  const CheckIfTiktokLinkIsValid = () => {
    if (!videoURL) return false
    try {
      var id = videoURL?.match(/video\/.{19}/g)[0]?.replace('video/', '')

      if (id) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e.message)
      return false
    }


  }

  return (
    <div className="App " >
      {/* <div style={{ width: '100%', height: '500px', background: 'white', position: 'absolute' }} ></div> */}
      <div className=" bg-gradient" 
      style={{
        /*height: history?.length ? '100vh' :'200vh',
       borderBottomRightRadius:history?.length ? '100px' : '0px' ,
        borderBottomLeftRadius:history?.length ? '100px' : '0px' ,*/
       }}>
      <div style={{ paddingTop: '75px' }} >
        <RxFramerLogo style={{ fontSize: '75px', color: '#ccdae7', margin: 'auto', opacity: '0.5' }} />
      </div>
      <h1 style={{ color: 'white', width: '90%', maxWidth: '720px', margin: 'auto', marginTop: '30px', marginBottom: '-20px', color: '#ccdae7' }} className="text-5xl font-bold  leading-normal ">
        Take Your TikTok Videos to the<span className='text-gradient__indigo-red' > Next Level</span> with AI
      </h1>

      <div className="flex justify-center mt-20" style={{ marginBottom: '-15px' }}>


        <div className="block p-6 rounded-lg  " style={{ width: '90%', maxWidth: '720px' }}>
          {/* <h5 className="text-gray-900 text-xl leading-tight font-medium mb-6">Insert a Tiktok video</h5> */}

          <div className="mb-3 flex items-center">
            {/* <label for="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700 text-base text-left "
            >Tiktok video link</label> */}

            {/* <div className=' border-r border-gray-300 mx-2 -ml-32' style={{height:'40px'}}></div> */}

            <div class="p-1 w-full rounded-full bg-gradient-to-r from-[#152ce2] via-[#a205c3] to-[#e7004d] md:mr-2">
              <div class="flex flex-col sm:flex-row items-center font-semibold bg-gray-800 rounded-full w-full">
                <div class="flex w-full items-center">
                  <input
                    type="text"
                    className="  block w-full px-10 py-4 text-base font-light 
              text-gray-900 shadow bg-white bg-clip-padding  
              rounded-3xl transition ease-in-out m-0  
               "
                    placeholder="Insert a Tiktok video..."
                    value={videoURL}
                    style={{ border: 'none', outline: 'none', borderRadius: '50px' }}
                    onChange={(e) => setVideoURL(e.target.value)}
                  />      </div>
              </div>
            </div>


            <button type="button"
              className=" 
            inline-block px-6 py-2.5 bg-blue-600 text-white  
            font-medium text-xs leading-tight uppercase rounded-3xl 
            shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
            focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 
            active:shadow-lg transition duration-150 ease-in-out  -ml-32
            
             text-white bg-gradient-to-r from-[#152ce2] via-[#a205c3] to-[#e7004d] whitespace-nowrap
            "
              style={{
                opacity: getVideoSubsLoading ? 0.5 : 1,
                pointerEvents: getVideoSubsLoading ? 'none' : 'auto',
                marginLeft: '-110px',
                backgroundColor: 'rgb(221, 175, 36)',
              }}
              onClick={() => {
                if (!CheckIfTiktokLinkIsValid()) {
                  setGetVideoSubsError('Please enter a valid tiktok video url')

                  return
                }
                console.log('valid tiktok url !')
                GetVideoSubtitles()
              }}
            >START</button>

          </div>



          {getVideoSubsError && <div className="text-white text-xs mt-4 bg-red-500 rounded-2xl px-4 py-1" style={{ width: 'fit-content', margin: 'auto' }}>{getVideoSubsError}</div>}
        </div>


      </div>
      {/*prompts && */<div key={prompts} className='animate__animated animate__fadeIn' style={{minHeight:'50px', opacity: prompts ? '1' :'0'}} >


        <button id='category-button' onClick={() => setCategory('hooks')} type="button"

          style={{ width: '150px', fontSize: '12px', padding: '7px 13px' }}
          className="category-button relative w-full rounded text-white py-1 px-8 text-left  focus:outline-none  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer   hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          <div class="flex gap-2  items-center justify-center category-text">
            <div class="flex-shrink-0 h-4 w-4"><FaPencilAlt /></div>
            Hooks
          </div>
        </button>

        <button id='category-button' onClick={() => setCategory('ideas')} type="button"

          style={{ width: '150px', fontSize: '12px', padding: '7px 13px' }}
          className="category-button relative w-full rounded text-white py-1 px-8 text-left  focus:outline-none  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer  bg-neutral-500 hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          <div class="flex gap-2  items-center justify-center category-text">
            <div class="flex-shrink-0 h-4 w-4"><FaPencilAlt /></div>
            Ideas
          </div>
        </button>
        <button id='category-button' onClick={() => setCategory('pitches')} type="button"

          style={{ width: '150px', fontSize: '12px', padding: '7px 13px' }}
          className="category-button relative w-full rounded text-white py-1 px-8 text-left  focus:outline-none  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer  bg-neutral-500 hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          <div class="flex gap-2  items-center justify-center category-text">
            <div class="flex-shrink-0 h-4 w-4"><FaPencilAlt /></div>
            Pitches
          </div>
        </button>
        <button id='category-button' onClick={() => setCategory('questions')} type="button"

          style={{ width: '150px', fontSize: '12px', padding: '7px 13px' }}
          className="category-button relative w-full rounded text-white py-1 px-8 text-left  focus:outline-none  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer  bg-neutral-500 hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          <div class="flex gap-2  items-center justify-center category-text">
            <div class="flex-shrink-0 h-4 w-4"><FaPencilAlt /></div>
            Questions
          </div>
        </button>
        <button id='category-button' onClick={() => setCategory('headlines')} type="button"

          style={{ width: '150px', fontSize: '12px', padding: '7px 13px' }}
          className="category-button relative w-full rounded text-white py-1 px-8 text-left  focus:outline-none  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer  bg-neutral-500 hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          <div class="flex gap-2  items-center justify-center category-text">
            <div class="flex-shrink-0 h-4 w-4"><FaPencilAlt /></div>
            Headlines
          </div>
        </button>



      </div>}
      {category && <div key={category} className="block p-6 rounded-lg shadow-lg bg-white animate__animated animate__fadeIn animate__faster "
        style={{ width: 'fit-content', maxWidth: '500px', background: '#534898', margin: 'auto', marginTop: '20px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: '10' }}>

        {prompts[category].map((prompt, index) => {
          return <div key={index} className="flex justify-start my-6">

            <button onClick={() => {
              if (!history?.length) {
                console.log('Please input a Tiktok video first! ')
                setGetVideoSubsError('Please input a Tiktok video first!')
                return
              }
              if (getAnswerLoading) {
                console.log('please wait for the ai to respond ')
                setGetAnswerError('Please wait for the ai to respond')
                return

              }
              setHistory(history => [...history, prompt.aiPrompt])
              setQuestion('')
              GetAnswer([...history, prompt.aiPrompt])


            }} type="button"
              style={{ background: '#6559ac', width: '400px' }}
              className="min-w-[12rem] h-12   relative w-full rounded text-white py-2 px-8 text-left shadow-md focus:outline-none 
              focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 
              focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer 
              bg-neutral-500"
            >
              <div class="flex gap-2  items-center justify-start ">
                <div class="flex-shrink-0 h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <span class="block text-left " style={{ fontSize: '14px' }}>
                  {prompt.promptTitle}

                </span>
              </div>
            </button>
          </div>
        })
        }



      </div>}
      </div>


      <div className="flex justify-center my-12 mb-2" style={{marginTop:'-100px'}}>

        {history && history.length > 0 && <div className="block p-6 shadow-lg bg-white rounded-lg animate__animated animate__fadeInDown   " style={{ width: '90%', maxWidth: '500px' }}>
          {/* <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Ask questions about the video</h5> */}

          {history.map((item, index) => {
            var answer = (index % 2 == 0)
            if (index == 0) return
            return <div key={index} className="flex justify-start my-6 ">
              <div className='text-gray-500 mr-2 ' >{answer ? 'A  ' : 'Q  '} </div> <div className='text-left ' dangerouslySetInnerHTML={{ __html: item.replace(/\n/g, "<br />") }}  style={{ fontWeight: answer && '500' }} />
            </div>
          })

          }
          {getAnswerLoading && <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
          <div className="mb-3 py-4 ">

            <textarea
              type="text"
              //5 rows="3"
              rows={4}
              className=" form-control block w-full px-3 py-3 text-sm font-light text-gray-700 bg-white bg-clip-
              padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 
              focus:bg-white focus:border-blue-600 focus:outline-none "
              style={{ marginTop: (history.length > 1) && '10px' }}
              placeholder="e.g. Generate a question for this video that will make the viewer want to watch the video to find out the answer"
              value={question}
              onChange={(e) => {
                if(e.target.value=='\n') return
                setQuestion(e.target.value)
              }}
            />
          </div>

          <button type="button"
            className=" inline-block px-6 py-2.5 bg-pink-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md 
            hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 
            active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out
            text-white bg-gradient-to-r from-[#e7004d] via-[#a205c3] to-[#152ce2] whitespace-nowrap
            "
            style={{
              opacity: getAnswerLoading ? 0.5 : 1,
              pointerEvents: getAnswerLoading ? 'none' : 'auto',
              width: '100%',
              //background: '#e7004d'
            }}
            onClick={() => {
              if (!question.trim() || (question?.length < 3)) {
                setGetAnswerError('Please enter a valid question')
                return
              }
              setHistory(history => [...history, question?.trim()])
              setQuestion('')

              GetAnswer([...history, question?.trim()])
            }}
          >Send  →</button>

          {getAnswerError && <div className="text-red-500 text-xs mt-4">{getAnswerError}</div>}

        </div>}
      </div>





    </div>

  );
}

export default App;
//dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br />") }} 