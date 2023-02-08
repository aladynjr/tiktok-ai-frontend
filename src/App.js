import React, { useState, useReducer, useEffect } from 'react';

import './App.scss';

function App() {


  const HOST = 'http://localhost:5001'
  // const HOST = 'http://143.198.58.92:5001'
  const [videoURL, setVideoURL] = useState('')


  const [history, setHistory] = useState([
    {
      prompt: `

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
`}
  ])

  //const [history, setHistory] = useState(null)

  const [getVideoSubsLoading, setGetVideoSubsLoading] = useState(false)
  const [getVideoSubsError, setGetVideoSubsError] = useState(false)


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

  const GetAnswer = async () => {
    setGetAnswerLoading(true)
    setGetAnswerError('')

    console.log(history)
    try {
      const response = await fetch(`${HOST}/api/tiktok/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history })
      })

      const data = await response.json()

      if (data.error) {
        console.error(data.message)
        setGetAnswerError(data.message)
        return null
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

  const [prompts, setPrompts] = useState({
    "hooks": [
      {
        "aiPrompt": 'Generate a hook title for this video that will be used in a caption that will capture a viewers attention and immediately hook them',
        "promptTitle": "Generate a hook title for this video"
      },
      {
        "aiPrompt": 'Generate a hook descrption for this video that is funny and will make the viewer want to watch the video',
        "promptTitle": "Generate a hook description for this video"
      },
      {
        "aiPrompt": 'Create a one sentence pitch for this video that accurately conveys the topic and tone of the video in an interesting way',
        "promptTitle": "Create a one sentence pitch"
      }
    ],
    "headlines": [
      {
        "aiPrompt": 'Generate a headline for this video that is interesting and makes the viewer want to know more about the topic',
        "promptTitle": "Generate a headline for this video"
      },
      {
        "aiPrompt": 'Create a headline for this video that is short and to the point, accurately conveying the topic and tone of the video',
        "promptTitle": "Create a short and to the point headline"
      },
      {
        "aiPrompt": 'Generate a headline for this video that is both interesting and accurately conveys the topic and tone of the video',
        "promptTitle": "Generate an interesting and accurate headline"
      }
    ],
    "subheadlines": [
      {
        "aiPrompt": 'Generate a subheadline for this video that provides more detail about the topic and tone of the video',
        "promptTitle": "Generate a subheadline for this video"
      },
      {
        "aiPrompt": 'Create a subheadline for this video that is short, to the point, and accurately conveys additional information about the video',
        "promptTitle": "Create a short and to the point subheadline"
      },
      {
        "aiPrompt": 'Generate a subheadline for this video that is interesting and provides additional detail about the topic and tone of the video',
        "promptTitle": "Generate an interesting subheadline"
      }
    ],
    "questions": [
      {
        "aiPrompt": 'Generate a question for this video that will make the viewer want to watch the video to find out the answer',
        "promptTitle": "Generate a question for this video"
      },
      {
        "aiPrompt": 'Create a question for this video that is short and to the point, accurately conveying the topic and tone of the video',
        "promptTitle": "Create a short and to the point question"
      },
      {
        "aiPrompt": 'Generate a question for this video that is both interesting and accurately conveys the topic and tone of the video',
        "promptTitle": "Generate an interesting and accurate question"
      }
    ],
    "ideas": [
      {
        "aiPrompt": 'Generate an idea for a sequel to this video that will continue the story and be just as exciting as the original',
        "promptTitle": "Generate a sequel idea for this video"
      },
      {
        "aiPrompt": 'Create an idea to improve this video by making it more visually appealing, adding new elements, or enhancing the overall experience',
        "promptTitle": "Create an idea to improve this video"
      },
      {
        "aiPrompt": 'Generate an idea to add to this video that will make it even more engaging and interesting for the viewer',
        "promptTitle": "Generate an idea to add to this video"
      }
    ]
  });

  useEffect(() => {
    if (!category) return

    console.log(prompts[category])

  })


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
  return (
    <div className="App">


      <h1 style={{ color: '#22272f', width: '90%', maxWidth: '720px', margin: 'auto', marginTop: '70px' }} className="text-5xl font-bold  leading-normal ">
        Take Your TikTok Videos to the Next Level with AI
      </h1>

      <div className="flex justify-center mt-20">


        <div className="block p-6 rounded-lg  " style={{ width: '90%', maxWidth: '720px' }}>
          {/* <h5 className="text-gray-900 text-xl leading-tight font-medium mb-6">Insert a Tiktok video</h5> */}

          <div className="mb-3 flex items-center">
            {/* <label for="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700 text-base text-left "
            >Tiktok video link</label> */}
            <input
              type="text"
              className="  block w-full px-10 py-4 text-base font-light 
              text-gray-900 shadow bg-white bg-clip-padding  
              rounded-3xl transition ease-in-out m-0   "
              placeholder="Insert a Tiktok video..."
              value={videoURL}
              style={{ border: 'none', outline: 'none', borderRadius: '50px' }}
              onChange={(e) => setVideoURL(e.target.value)}
            />
            {/* <div className=' border-r border-gray-300 mx-2 -ml-32' style={{height:'40px'}}></div> */}

            <button type="button"
              className=" 
            inline-block px-6 py-2.5 bg-blue-600 text-white  
            font-medium text-xs leading-tight uppercase rounded-3xl 
            shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
            focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 
            active:shadow-lg transition duration-150 ease-in-out  -ml-32"
              style={{
                opacity: getVideoSubsLoading ? 0.5 : 1,
                pointerEvents: getVideoSubsLoading ? 'none' : 'auto',
                marginLeft: '-100px'
              }}
              onClick={() => {
                GetVideoSubtitles()
              }}
            >START</button>

          </div>



          {getVideoSubsError && <div className="text-red-500 text-xs mt-4">{getVideoSubsError}</div>}
        </div>


      </div>
      {history && <div>
        

        <button id='category-button' onClick={() => setCategory('hooks')} type="button" className=" category-button inline-block px-6 py-2.5 bg-slate-100	 text-white font-medium text-sm leading-tight    hover:bg-slate-200	 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          Hooks
        </button>
        <button id='category-button' onClick={() => setCategory('ideas')} type="button" className="category-button inline-block px-6 py-2.5 bg-slate-100 text-white font-medium text-sm leading-tight    hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          Ideas
        </button>
        <button id='category-button' onClick={() => setCategory('headlines')} type="button" className="category-button inline-block px-6 py-2.5 bg-slate-100 text-white font-medium text-sm leading-tight    hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          Headlines
        </button>
        <button id='category-button' onClick={() => setCategory('subheadlines')} type="button" className="category-button inline-block px-6 py-2.5 bg-slate-100 text-white font-medium text-sm leading-tight    hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          Subheadlines
        </button>
        <button id='category-button' onClick={() => setCategory('questions')} type="button" className="category-button inline-block px-6 py-2.5 bg-slate-100 text-white font-medium text-sm leading-tight    hover:bg-slate-200 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out">
          Questions
        </button>

      </div>}
      {category && <div className="block p-6 rounded-lg shadow-lg bg-white " style={{ width: '90%', maxWidth: '500px', background:'#262626' }}>

{prompts[category].map((prompt, index) => {
  return <div key={index} className="flex justify-start my-6">
       
 <button onClick={() => {
      setHistory(history => [...history, prompt.aiPrompt])
      setQuestion('')
      GetAnswer()
    }} id='category-button' type="button" 
    style={{ background: '#404040', width: 'fit-content' }} className="min-w-[12rem] h-12   relative w-full rounded text-white py-2 px-8 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer bg-neutral-500"
    >
      <div class="flex gap-2 justify-center items-center">
            <div class="flex-shrink-0 h-4 w-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                </path>
              </svg>
            </div>
            <span class="block">
            {prompt.promptTitle}

            </span>
          </div>
    </button> 
  </div>
})
}



</div>}
      <div className="flex justify-center my-12 mb-2">

        {history && history.length > 0 && <div className="block p-6 rounded-lg shadow-lg bg-white " style={{ width: '90%', maxWidth: '500px' }}>
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Ask questions about the video</h5>

          {history.map((item, index) => {
            if (index == 0) return
            return <div key={index} className="flex justify-start my-6">
              <div className='text-gray-500 mr-2' >{(index % 2 == 0) ? 'A  ' : 'Q  '} </div> <div className='text-left' >{item}</div>
            </div>
          })

          }

          <div className="mb-3 ">

            <input
              type="text"
              className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-6"
              placeholder="What is your question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <button type="button"
            className=" inline-block px-6 py-2.5 bg-pink-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out"
            style={{
              opacity: getAnswerLoading ? 0.5 : 1,
              pointerEvents: getAnswerLoading ? 'none' : 'auto'
            }}
            onClick={() => {
              setHistory(history => [...history, question])
              setQuestion('')

              GetAnswer()
            }}
          >SEND</button>

          {getAnswerError && <div className="text-red-500 text-xs mt-4">{getAnswerError}</div>}

        </div>}
      </div>



      

    </div>

  );
}

export default App;
