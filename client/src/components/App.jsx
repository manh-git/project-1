
import  './styles/App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Main from './main'
import Learn from './Flashcard/learn'
import Result from './Quiz/result'
import Flashcard from './Flashcard/Flashcard'
import Quiz from './Quiz/Quiz'
import QuizStart from './Quiz/QuizStart'
import FlashCardExample from './Flashcard/example'; 

const router = createBrowserRouter([
  {
    path:'/',
    element: <Main/>
  },
  {
    path: '/quiz/:topicId',
    element: <Quiz/>
  },
  {
    path: '/quiz/start',
    element: <QuizStart/>
  },
  {
    path: '/result',
    element:<Result/>
  },
  {
    path:'/learn/example',
    element: <FlashCardExample/>
  },
  
  {
    path:'/learn/:topicId',
    element: <Flashcard/>
  },
  {
    path:'/learn',
    element:<Learn/>
  }
  

])

function App() {
  return(
 <>
    <RouterProvider router={router} />
 </>);
}

export default App
